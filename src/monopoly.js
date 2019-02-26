import React from 'react';

class Game {
  constructor(dice) {
    this.cells = [];
    this.players = [];
    this.chanceCards = [];
    this.houses = 32;
    this.hotels = 12;
    this.communityChestCards = [];
    this.activePlayer = 0;
    this.dice = dice || new RandomDice();
    this.doublesInARow = 0;
  }

  newGame(n, m) {
    this.makeAPlayingField();
    if (n >= 2 && n <= 6) {
      for (let i = 0; i < n; i++) {
        this.players[i] = new Player();
        this.players[i].money = m;
      }
    } else throw new Error('Invalid players number');
  };

  endMove() {
    this.doublesInARow = 0;
    this.activePlayer = (this.activePlayer + 1) % this.players.length;
    if (this.players[this.activePlayer].bankrupt) {
      this.endMove();
    }
  };

  moveUnit() {
    let player = this.players[this.activePlayer];
    let sum = this.dice.roll();
    if (this.dice.isDouble()) this.doublesInARow++;
    if (this.doublesInARow == 3) {
      player.position = 10;
      player.isFree = false;
      return;
    }
    player.position += sum;
    if (player.position >= 40) {
      player.position -= 40;
      player.money += 200;
    }
    this.checkPosition();
  };

  takeChanceCard() {
    this.chanceCards[0].action(this);
    this.checkPosition();
    this.chanceCards.push(this.chanceCards.shift());
  };

  takeCommunityCard() {
    this.communityChestCards[0].action(this);
    this.checkPosition();
    this.communityChestCards.push(this.communityChestCards.shift());
  };

  checkPosition() {
    let player = this.players[this.activePlayer];
    // if (player.position == 7 || player.position == 22 || player.position == 36) {
    //   this.chanceCards[0].action(this);
    //   this.chanceCards.push(this.chanceCards.shift());
    // }
    if (player.position == 30) {
      player.position = 10;
      player.isFree = false;
      return;
    }
    if (player.position == 4) {
      player.money -= 200;
      return;
    }
    if (player.position == 38) {
      player.money -= 100;
      return;
    }
    // if (player.position == 2 || player.position == 17 || player.position == 33){
    //   this.communityChestCards[0].action(this);
    //   this.communityChestCards.push(this.communityChestCards.shift());
    // }
    if (this.cells[player.position].owner != undefined
      && this.players[this.cells[player.position].owner].isFree
      && !this.cells[player.position].isPledged)
      this.payRent();
  };

  buyDeed() {
    let index = this.players[this.activePlayer].position;
    this.cells[index].owner = this.activePlayer;
    this.players[this.activePlayer].money -= this.cells[index].price;
  };

  pledge(i) {
    if (this.canCellBeTransferred(i)) {
      let player = this.players[this.activePlayer];
      if (this.cells[i].isPledged || this.cells[i].houses > 0
        || this.cells[i].hotels > 0 || this.cells[i].owner != this.activePlayer)
        throw new Error('You can\'t pledge');
      this.cells[i].isPledged = true;
      player.money += this.cells[i].price / 2;
    } else {
      alert ('It can\'t be pledged');
    }
  };

  unPledge(i) {
    let player = this.players[this.activePlayer];
    if (!this.cells[i].isPledged || this.cells[i].owner != this.activePlayer
      || this.players[this.activePlayer].money < this.cells[i].price)
      throw new Error('You can\'t unPledge');
    this.cells[i].isPledged = false;
    player.money -= this.cells[i].price;
  }

  payRent() {
    let index = this.players[this.activePlayer].position;
    let rent = this.getRent(index);
    this.players[this.activePlayer].money -= rent;
    this.players[this.cells[index].owner].money += rent;
  }

  getRent(i) {
    if (this.cells[i].street == 'rWStation') {
      let k = 12.5;
      for (let j = 5; j < this.cells.length; j += 10) {
        let cell = this.cells[j];
        if (cell.street == 'rWStation' && cell.owner == this.cells[i].owner) {
          k *= 2;
        }
      }
      return k;
    }
    if (this.cells[i].street == 'communalServices') {
      if (this.cells[12].owner != this.cells[28].owner) {
        return (this.dice.dice1 + this.dice.dice2) * 4;
      } else {
        return (this.dice.dice1 + this.dice.dice2) * 10;
      }
    }
    if (this.cells[i].hotels == 1) return this.cells[i].rent[5];
    if (this.cells[i].houses >= 1) {
      return this.cells[i].rent[this.cells[i].houses];
    }
    if (this.isMonopolyStreet(this.players[this.activePlayer].position)) {
      return this.cells[i].rent[0] * 2;
    }
    return this.cells[i].rent[0];
  }

  build(i) {
    if (!this.canIBuild(i))
      throw new Error('You can\'t build');
    if (this.cells[i].houses == 4) {
      this.hotels--;
      this.houses += 4;
      this.cells[i].houses = 0;
      this.cells[i].hotels = 1;
    } else {
      this.houses--;
      this.cells[i].houses++;
    }
    this.players[this.activePlayer].money -= this.cells[i].buildPrice;
  }

  remove(i) {
    for (let j = 0; j < this.cells.length; j++) {
      if (this.cells[j].street == this.cells[i].street) {
        if (this.cells[j].hotels == 0 && this.cells[i].hotels == 0
          && this.cells[j].houses > this.cells[i].houses)
          throw new Error('You can\'t remove');
        if (this.cells[j].hotels > this.cells[i].hotels)
          throw new Error('You can\'t remove');
      }
    }
    if (this.cells[i].owner != this.activePlayer
      || this.cells[i].hotels == 0 && this.cells[i].houses == 0)
      throw new Error('You can\'t remove');
    if (this.cells[i].hotels == 0) {
      this.cells[i].houses--;
      this.houses++;
      this.players[this.activePlayer].money += this.cells[i].buildPrice / 2;
    }
    if (this.cells[i].hotels == 1) {
      this.cells[i].hotels--;
      this.hotels++;
      if (this.houses < 4) {
        this.cells[i].houses = this.houses;
        this.houses = 0;
      } else {
        this.houses -= 4;
        this.cells[i].houses = 4;
      }
      this.players[this.activePlayer].money += this.cells[i].buildPrice / 2;
    }
  }

  fullRemove(i) {
    let hotels = this.cells[i].hotels;
    let houses = this.cells[i].houses;
    this.cells[i].hotels = 0;
    this.cells[i].houses = 0;
    this.hotels += hotels;
    this.houses += houses;
  };

  canIBuild(i) {
    if (!this.isMonopolyStreet(i) || this.cells[i].isPledged
      || this.cells[i].owner != this.activePlayer) return false;
    if (this.players[this.activePlayer].money < this.cells[i].buildPrice)
      return false;
    if (this.cells[i].hotels == 1) return false;
    if (this.cells[i].houses == 4 && this.hotels == 0) return false;
    if (this.cells[i].houses < 4 && this.houses == 0) return false;
    for (let j = 0; j < this.cells.length; j++) {
      if (this.cells[j].street == this.cells[i].street) {
        if (this.cells[j].houses < this.cells[i].houses
          && this.cells[j].hotels == 0) return false;
      }
    }
    return true;
  };

  isMonopolyStreet(index) {
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].street == this.cells[index].street) {
        if (this.cells[i].owner != this.cells[index].owner
          || this.cells[i].isPledged) return false;
      }
    }
    return true;
  };

  canCellBeTransferred(i) {
    if ('hotels' in this.cells[i]) {
      return !this.cells.filter(c=>c.street==this.cells[i].street).some(c=>c.hotels>0 || c.houses>0);
    }
    else return true;
  }

  moneyTransfer(from, to, sum) {
    if (sum > this.players[from].money && sum != 0) {
      throw new Error('Transfer Error');
    } else {
      this.players[from].money -= sum;
      this.players[to].money += sum;
    }
  };

  propertyTransfer(from, to, prop) {
    if (this.cells[prop].owner != from || this.cells[prop].hotels > 0
      || this.cells[prop].houses > 0) {
      throw new Error('Transfer Error');
    } else {
      this.cells[prop].owner = to;
    }
  };

  bankrupt() {
    let n = this.activePlayer;
    for (let i=0; i<this.cells.length; i++) {
      if ('owner' in this.cells[i] && this.cells[i].owner == n) {
        if ('hotels' in this.cells[i]) {
          this.fullRemove(i);
        }
        this.cells[i].owner = undefined;
        this.cells[i].isPledged = false;
      }
    }
    this.players[n].bankrupt = true;
    this.endMove();
  };

  makeAPlayingField() {
    this.communityChestCards[0] = new CommunityChestCards(function (game) {
      let player = game.players[game.activePlayer];
      player.money += 200;
      player.position = 0;
    }, 'Go to start and receive 200GD');
    this.communityChestCards[1] = new CommunityChestCards(function (game) {
      let player = game.players[game.activePlayer];
      player.position = 10;
      player.isFree = false;
    }, 'go to the prison');
    this.communityChestCards[2] = new CommunityChestCards(function (game) {
      let player = game.players[game.activePlayer];
      for (let i = 0; i < game.players.length; i++) {
        game.players[i].money += 50;
        player.money -= 50;
      }
    }, 'Give 50GD each player');
    this.communityChestCards[3] = new CommunityChestCards(function (game) {
      let player = game.players[game.activePlayer];
      player.money -= 200;
    }, 'You lose 200GD');
    this.communityChestCards[4] = new CommunityChestCards(function (game) {
      let player = game.players[game.activePlayer];
      for (let i = 0; i < game.players.length; i++) {
        if (i != game.activePlayer && game.players[i].money >= 50) {
          if (!game.players[i].bankrupt) {
            game.players[i].money -= 50;
            player.money += 50;
          }
        }
      }
    }, <span>Take 50GD from each player<br/>(if he have 50GD)</span>);
    this.communityChestCards[5] = new CommunityChestCards(function (game) {
      let player = game.players[game.activePlayer];
      for (let i = 0; i < game.players.length; i++) {
        if (!game.players[i].bankrupt) {
          game.players[i].money += 25;
          player.money -= 25;
        }
      }
    }, 'Give 25GD each player');
    this.communityChestCards[6] = new CommunityChestCards(function (game) {
      let player = game.players[game.activePlayer];
      for (let i = 0; i < game.players.length; i++) {
        if (i != game.activePlayer && game.players[i].money >= 25) {
          if (!game.players[i].bankrupt) {
            game.players[i].money -= 25;
            player.money += 25;
          }
        }
      }
    }, <span>Take 25GD from each player<br/>(if he have 25GD)</span>);
    this.communityChestCards[7] = new CommunityChestCards(function (game) {
      let player = game.players[game.activePlayer];
      let tax = [];
      for (let i = 0; i < game.cells.length; i++) {
        if (game.cells[i].owner == game.activePlayer
          && 'hotels' in game.cells[i]) {
          tax.push(game.cells[i].hotels);
          tax.push(game.cells[i].hotels);
          tax.push(game.cells[i].houses);
        }
      }
      let result = tax.reduce(function (sum, current) {
        return sum + current;
      }, 0);
      player.money -= result * 50;
    }, <span>Pay tax: 50GD for each house<br/>and 100GD for each hotel</span>);
    this.communityChestCards[8] = new CommunityChestCards(function (game) {
      let player = game.players[game.activePlayer];
      for (let i = 0; i < game.players.length; i++) {
        if (i != game.activePlayer && game.players[i].money >= 25) {
          if (!game.players[i].bankrupt) {
            game.players[i].money -= 25;
            player.money += 25;
          }
        }
      }
    }, <span>Take 25GD from each player<br/>(if he have 25GD)</span>);
    this.communityChestCards[9] = this.communityChestCards[7];
    this.communityChestCards[10] = new CommunityChestCards(function () {
      let player = game.players[game.activePlayer];
      player.money = Math.round(player.money * 1.1);
    }, <span>Your capital has increased<br/>by 10%</span>);
    this.communityChestCards[11] = new CommunityChestCards(function () {
      let player = game.players[game.activePlayer];
      player.money = Math.round(player.money * 0.9);
    }, <span>Your capital has decreased<br/>by 10%</span>);
    this.communityChestCards[12] = new CommunityChestCards(function () {
      let player = game.players[game.activePlayer];
      player.money = Math.round(player.money * 1.05);
    }, <span>Your capital has increased<br/>by 5%</span>);
    this.communityChestCards[13] = new CommunityChestCards(function () {
      let player = game.players[game.activePlayer];
      player.money = Math.round(player.money * 0.95);
    }, <span>Your capital has decreased<br/>by 5%</span>);
    this.communityChestCards[14] = new CommunityChestCards(function (game) {
      let player = game.players[game.activePlayer];
      player.money -= 125;
    }, 'You lose 125GD');
    this.communityChestCards[15] = new CommunityChestCards(function (game) {
      let player = game.players[game.activePlayer];
      player.money += 125;
    }, 'Take 125GD from bank');
    this.communityChestCards.sort(function (a, b) {
      return Math.random() - 0.5;
    });
    this.chanceCards[0] = new ChanceCardGoTo();
    this.chanceCards[1] = this.chanceCards[0];
    this.chanceCards[2] = this.chanceCards[0];
    this.chanceCards[3] = this.chanceCards[0];
    this.chanceCards[4] = this.chanceCards[0];
    this.chanceCards[5] = this.chanceCards[0];
    this.chanceCards[6] = this.chanceCards[0];
    this.chanceCards[7] = this.chanceCards[0];
    this.chanceCards[8] = new ChanceCardMoney();
    this.chanceCards[9] = this.chanceCards[8];
    this.chanceCards[10] = this.chanceCards[8];
    this.chanceCards[11] = this.chanceCards[8];
    this.chanceCards[12] = this.chanceCards[8];
    this.chanceCards[13] = this.chanceCards[8];
    this.chanceCards[14] = this.chanceCards[8];
    this.chanceCards[15] = this.chanceCards[8];
    this.chanceCards.sort(function (a, b) {
      return Math.random() - 0.5;
    });
    this.cells[0] = new CellStart();
    this.cells[1] = new CellsDeeds(
      'Craster\'s Keep', '1-3', 60, 50, [2, 10, 30, 90, 160, 250]
    );
    this.cells[2] = new CellsCommunityChests();
    this.cells[3] = new CellsDeeds(
      'The Fist', '1-3', 60, 50, [4, 20, 60, 180, 320, 450]
    );
    this.cells[4] = new CellsTaxes();
    this.cells[5] = new CellsRailwayStations('Baratheon\'s  flag');
    this.cells[6] = new CellsDeeds(
      'The Nightfort', '6-8-9', 100, 50, [6, 30, 90, 270, 400, 550]
    );
    this.cells[7] = new CellsChance();
    this.cells[8] = new CellsDeeds(
      'Mole\'s Town', '6-8-9', 100, 50, [6, 30, 90, 270, 400, 550]
    );
    this.cells[9] = new CellsDeeds(
      'The Inn', '6-8-9', 120, 50, [8, 40, 100, 300, 450, 600]
    );
    this.cells[10] = new CellPrison();
    this.cells[11] = new CellsDeeds(
      'Vaes Dothrak', '11-13-14', 140, 100, [10, 50, 150, 450, 625, 750]
    );
    this.cells[12] = new CellsCommunalServices();
    this.cells[13] = new CellsDeeds(
      'Qarth', '11-13-14', 140, 100, [10, 50, 150, 450, 625, 750]
    );
    this.cells[14] = new CellsDeeds(
      'Pentos', '11-13-14', 160, 100, [12, 60, 180, 500, 700, 900]
    );
    this.cells[15] = new CellsRailwayStations('Tyrell\'s flag');
    this.cells[16] = new CellsDeeds(
      'The Eurie', '16-18-19', 180, 100, [14, 70, 200, 550, 700, 900]
    );
    this.cells[17] = new CellsCommunityChests();
    this.cells[18] = new CellsDeeds(
      'Dragonstone', '16-18-19', 180, 100, [14, 70, 200, 550, 700, 950]
    );
    this.cells[19] = new CellsDeeds(
      'Moat Cailin', '16-18-19', 200, 100, [16, 80, 220, 600, 800, 1000]
    );
    this.cells[20] = new CellParking();
    this.cells[21] = new CellsDeeds(
      'Harrenhall', '21-23-24', 220, 150, [18, 90, 250, 700, 875, 1050]
    );
    this.cells[22] = new CellsChance();
    this.cells[23] = new CellsDeeds(
      'The Dreadfort', '21-23-24', 220, 150, [18, 90, 250, 700, 875, 1050]
    );
    this.cells[24] = new CellsDeeds(
      'The Twins', '21-23-24', 240, 150, [20, 100, 300, 750, 925, 1100]
    );
    this.cells[25] = new CellsRailwayStations('Targaryen\'s flag');
    this.cells[26] = new CellsDeeds(
      'Astapor', '26-27-29', 260, 150, [22, 110, 330, 800, 925, 1150]
    );
    this.cells[27] = new CellsDeeds(
      'Yunkai', '26-27-29', 260, 150, [22, 110, 330, 800, 925, 1150]
    );
    this.cells[28] = new CellsCommunalServices();
    this.cells[29] = new CellsDeeds(
      'Meereen', '26-27-29', 280, 150, [24, 120, 360, 850, 1025, 1200]
    );
    this.cells[30] = new CellJail();
    this.cells[31] = new CellsDeeds(
      'Castle Black', '31-32-34', 300, 200, [26, 130, 390, 900, 1100, 1275]
    );
    this.cells[32] = new CellsDeeds(
      'Pyke', '31-32-34', 300, 200, [26, 130, 390, 900, 1100, 1275]
    );
    this.cells[33] = new CellsCommunityChests();
    this.cells[34] = new CellsDeeds(
      'Binterfell', '31-32-34', 320, 200, [28, 150, 450, 1000, 1200, 1400]
    );
    this.cells[35] = new CellsRailwayStations('Lannister\'s flag');
    this.cells[36] = new CellsChance();
    this.cells[37] = new CellsDeeds(
      'Braavos', '37-39', 350, 200, [35, 175, 500, 1100, 1300, 1500]
    );
    this.cells[38] = new CellsTaxes();
    this.cells[39] = new CellsDeeds(
      'King\'s Landing', '37-39', 400, 200, [50, 200, 600, 1400, 1700, 2000]
    );
  };
}

class RandomDice {
  constructor() {
    this.diceCounter = 0;
  }
  roll() {
    this.diceCounter++;
    this.dice1 = Math.floor(1 + Math.random() * 6);
    this.dice2 = Math.floor(1 + Math.random() * 6);
    return this.dice1 + this.dice2;
  };

  isDouble(){
    return this.dice1 == this.dice2;
  };

}

class ChanceCardGoTo {
  init(game){
    let player = game.players[game.activePlayer];
    let arr;
    if(player.position == 7) {
      arr = [1, 3, 4, 5, 6, 8, 9, 11, 12, 13, 14];
    } else if (player.position == 22) {
      arr = [15, 16, 18, 19, 20, 21, 23, 24, 25, 26, 27];
    } else {
      arr = [0, 28, 29, 30, 31, 32, 34, 35, 37, 38, 39];
    }
    let rand = Math.floor(Math.random() * 11);
    this.nextPosition = arr[rand];
    let diff = this.nextPosition - player.position;
    let vector;
    if (diff > 0) vector = 'forward';
    else vector = 'back';
    this.text = 'go to ' + Math.abs(diff) + ' cell(s) ' + vector;
  };
  action(game){
    let player = game.players[game.activePlayer];
    player.position = this.nextPosition;
    // player.position = arr[game.dice.roll()-2];
    if (player.position == 0){
      player.money += 200;
    }
  };
}

class ChanceCardMoney {
  init(game) {
    let player = game.players[game.activePlayer];
    let arr = [-25, 25, -50, 50, -100, 100, -200, 200];
    let rand = Math.floor(Math.random() * 8);
    this.newMoney = arr[rand];
    if (arr[rand] > 0) this.text = 'take ' + Math.abs(this.newMoney) + 'GD from bank';
    else this.text = 'You lost ' + Math.abs(this.newMoney) + 'GD';
  };

  action(game) {
    let player = game.players[game.activePlayer];
    player.money += this.newMoney;
  };
}

class CommunityChestCards{
  constructor(action, text) {
    this.action = action;
    this.text = text;
  }
}

class CellStart {}

class CellsDeeds {
  constructor(name, street, price, buildPrice, rents) {
    this.name = name;
    this.street = street;
    this.price = price;
    this.buildPrice = buildPrice;
    this.rent = rents;
    this.owner = undefined;
    this.isPledged = false;
    this.houses = 0;
    this.hotels = 0;
  }
}

class CellsRailwayStations {
  constructor(name) {
    this.name = name;
    this.owner = undefined;
    this.street = 'rWStation';
    this.price = 200;
    this.isPledged = false;
  }
}

class CellPrison {}

class CellParking {}

class CellsTaxes {}

class CellsCommunityChests {}

class CellsChance {}

class CellsCommunalServices{
  constructor() {
    this.name = 'Master of Coin';
    this.owner = undefined;
    this.street = 'communalServices';
    this.price = 150;
    this.isPledged = false;
  }
}

class CellJail{}

class Player {
  constructor() {
    this.position = 0;
    this.money = 1500;
    this.isFree = true;
    this.bankrupt = false;
    this.attemptToDoubleInPrison = 0;
    this.name = '';
    this.color = '';
  }
}

exports.Game = Game;
