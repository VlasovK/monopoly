let assert = require('assert');
let monopoly = require('./monopoly.js');
let {DefinedDice} = require('./test_util.js');

function makeTest(x, expected){
  it('newGame with ' + x + ' gamers is ' + expected, function(){
    let game = new monopoly.Game();
    game.newGame(x, 1500);
    assert.equal(game.players.length, expected);
  });
}
// TODO: fix tests
// makeTest(1, 0);
makeTest(2, 2);
// makeTest(7, 0);

it('dice rolling', function(){
  let game = new monopoly.Game();
  game.newGame(2, 1500);
  for (let i=0; i<100; i++) {
    let result = game.dice.roll();
    assert.equal(result >= 2 && result <= 12, true);
  }
});

it('creating player field with newGame', function(){
  let game = new monopoly.Game();
  game.newGame(3, 1500);
  assert.equal(game.cells.length, 40);
  assert.equal(game.chanceCards.length, 16);
  assert.equal(game.communityChestCards.length, 16);
  assert.equal(game.houses, 32);
});

it('change player position', function(){
  let game = new monopoly.Game(new DefinedDice([4, 4, 5, 6]));
  game.newGame(4, 1500);
  game.moveUnit();
  assert.equal(game.players[0].position, 8);
  game.players[0].position = 38;
  assert.equal(game.players[0].money, 1500);
  game.moveUnit();
  assert.equal(game.players[0].position, 9);
  assert.equal(game.players[0].money, 1500+200);
});

it('endMove changes activePlayer to the next one', function(){
  let game = new monopoly.Game(new DefinedDice([2, 3]));
  game.newGame(2, 1500);
  game.endMove();
  assert.equal(game.activePlayer, 1);
  game.endMove();
  assert.equal(game.activePlayer, 0);
});

it('buy deeds', function(){
  let game = new monopoly.Game(new DefinedDice([1, 2]));
  game.newGame(2, 1500);
  game.moveUnit();
  assert.equal(game.cells[3].owner, undefined);
  game.buyDeed();
  assert.equal(game.cells[3].owner, 0);
});

it('jail and prison', function(){
  let game = new monopoly.Game(new DefinedDice([30, 0]));
  game.newGame(2, 1500);
  game.moveUnit();
  game.endMove();
  assert.equal(game.players[0].position, 10);
  assert.equal(game.activePlayer, 1);
});

it('go to prison with 3 doubles', function(){
  let game = new monopoly.Game(new DefinedDice([1, 1, 2, 2, 3, 3]));
  game.newGame(2, 1500);
  game.moveUnit();
  game.moveUnit();
  game.moveUnit();
  game.endMove();
  assert.equal(game.activePlayer, 1);
  assert.equal(game.players[0].position, 10);
});

it('get rent', function(){
  let game = new monopoly.Game(new DefinedDice([1, 2, 1, 2, 1, 1, 1, 0]));
  game.newGame(2, 1500);
  game.cells[3].owner = 1;
  game.cells[6].owner = 1;
  game.cells[8].owner = 1;
  game.cells[8].houses = 2;
  game.cells[9].owner = 1;
  game.cells[9].hotels = 1;
  game.moveUnit();
  game.moveUnit();
  game.moveUnit();
  game.moveUnit();
  assert.equal(game.players[0].money, 1500-4-12-90-600);
  assert.equal(game.players[1].money, 1500+4+12+90+600);
});

it('pay rent', function(){
  let game = new monopoly.Game(new DefinedDice([1, 2, 2, 1]));
  game.newGame(2, 1500);
  game.moveUnit();
  game.buyDeed();
  game.endMove();
  game.moveUnit();
  assert.equal(game.cells[3].owner, 0);
  assert.equal(game.players[0].money, 1500-60+4);
  assert.equal(game.players[1].money, 1500-4);
});

it('build houses and pay rent + isMonopolyStreet()', function(){
  let game = new monopoly.Game(
    new DefinedDice([3, 3, 1, 1, 1, 0, 3, 3, 1, 1])
  );
  game.newGame(2, 1500);
  game.moveUnit();
  game.buyDeed();
  game.moveUnit();
  game.buyDeed();
  game.moveUnit();
  game.buyDeed();
  game.build(6);
  game.endMove();
  game.moveUnit();
  game.moveUnit();
  assert.equal(game.players[0].money, 1500-100-100-120-50+30+12);
  assert.equal(game.players[1].money, 1500-30-12);
});

it('pay rent in prison', function(){
  let game = new monopoly.Game(new DefinedDice([1, 2, 30, 0, 1, 2]));
  game.newGame(3, 1500);
  game.cells[3].owner = 1;
  game.moveUnit();
  game.endMove();
  game.moveUnit();
  game.moveUnit();
  assert.equal(game.players[0].money, 1500-4);
  assert.equal(game.players[2].money, 1500);
});

it('pledge deeds', function(){
  let game = new monopoly.Game(new DefinedDice([1, 2, 1, 2]));
  game.newGame(3, 1500);
  game.cells[3].owner = 1;
  game.moveUnit();
  game.endMove();
  game.pledge(3);
  game.endMove();
  game.moveUnit();
  assert.equal(game.players[0].money, 1496);
  assert.equal(game.players[1].money, 1534);
  assert.equal(game.players[2].money, 1500);
  game.endMove();
  game.endMove();
  game.cells[1].owner = 1;
  game.players[1].money = 0;
  assert.throws(function(){
    game.unPledge(3);
  }, /You can't unPledge/);
  game.players[1].money = 1534;
  game.unPledge(3);
  assert.equal(game.players[1].money, 1534-60);
  game.build(1);
  assert.throws(function(){
    game.unPledge(1);
  }, /You can't unPledge/);
  assert.throws(function(){
    game.pledge(1);
  }, /You can't pledge/);
});

it('builds sequence', function(){
  let game = new monopoly.Game();
  game.newGame(2, 1500);
  game.cells[1].owner = 0;
  assert.throws(function(){
    game.build(1);
  }, /You can't build/);
  game.cells[3].owner = 0;
  game.build(1);
  assert.equal(game.cells[1].houses, 1);
  assert.throws(function(){
    game.build(1);
  }, /You can't build/);
  game.build(3);
  game.build(1);
  game.build(3);
  game.players[game.activePlayer].money = 40;
  assert.throws(function(){
    game.build(1);
  }, /You can't build/);
  game.players[game.activePlayer].money = 1500;
  game.build(1);
  game.build(3);
  game.build(1);
  game.build(3);
  game.hotels = 0;
  assert.throws(function(){
    game.build(1);
  }, /You can't build/);
  game.hotels = 12;
  game.build(1);
  assert.equal(game.houses, 28);
  assert.equal(game.hotels, 11);
  game.build(3);
  assert.throws(function(){
    game.build(1);
  }, /You can't build/);
});

it('remove sequence', function(){
  let game = new monopoly.Game();
  game.newGame(2, 1500);
  game.cells[1].owner = 0;
  game.cells[3].owner = 0;
  game.cells[1].houses = 2;
  game.cells[3].houses = 2;
  game.remove(1);
  assert.throws(function(){
    game.remove(1);
  }, /You can't remove/);
  game.cells[1].houses = 0;
  game.cells[1].hotels = 1;
  game.cells[3].houses = 0;
  game.cells[3].houses = 1;
  game.remove(1);
  assert.equal(game.cells[1].hotels, 0);
  assert.equal(game.cells[1].houses, 4);
  game.cells[1].houses = 0;
  game.cells[1].hotels = 1;
  game.houses = 2;
  game.remove(1);
  assert.equal(game.cells[1].hotels, 0);
  assert.equal(game.cells[1].houses, 2);
});

it('cells taxes', function(){
  let game = new monopoly.Game(new DefinedDice([2, 2, 34, 0]));
  game.newGame(2, 1500);
  assert.equal(game.players[0].money, 1500);
  game.moveUnit();
  assert.equal(game.players[0].money, 1300);
  game.moveUnit();
  assert.equal(game.players[0].money, 1200);
});

it('cells taxes', function() {
  let game = new monopoly.Game(new DefinedDice([1, 1]));
  game.newGame(2, 1500);
  game.moveUnit();
  assert.equal();
});

it.skip('communityChestCards', function(){
  let game = new monopoly.Game(new DefinedDice([1, 1, 1, 1]));
  game.newGame(2, 1500);
  game.moveUnit();
  game.takeCommunityCard();
  assert.equal(game.players[0].position, 0);
  assert.equal(game.players[0].money, 1700);
  game.endMove();
  game.moveUnit();
  game.takeCommunityCard();
  assert.equal(game.players[1].position, 10);
  assert.equal(game.players[1].isFree, false);
});

it.skip('cards chance', function(){
  let game = new monopoly.Game(new DefinedDice([36, 0, 1, 1, 1, 1, 6, 6]));
  game.newGame(2, 1500);
  game.moveUnit();
  game.takeChanceCard();
  assert.equal(game.players[0].position, 0);
  assert.equal(game.players[0].money, 1700);
  game.players[0].position = 34;
  game.moveUnit();
  game.takeChanceCard();
  assert.equal(game.players[0].position, 39);
  assert.equal(game.players[0].money, 1700);
});

it('railway stations', function(){
  let game = new monopoly.Game(new DefinedDice([2, 3, 2, 3, 4, 6, 4, 6]));
  game.newGame(2, 1500);
  game.moveUnit();
  game.buyDeed();
  game.endMove();
  game.moveUnit();
  game.endMove();
  assert.equal(game.players[0].money, 1500-200+25);
  assert.equal(game.players[1].money, 1500-25);
  game.moveUnit();
  game.buyDeed();
  game.endMove();
  game.moveUnit();
  assert.equal(game.players[0].money, 1500-200+25-200+50);
  assert.equal(game.players[1].money, 1500-25-50);
});

it('communal services', function(){
  let game = new monopoly.Game(new DefinedDice([12, 0, 12, 0, 3, 4]));
  game.newGame(2, 1500);
  game.moveUnit();
  game.buyDeed();
  game.endMove();
  game.moveUnit();
  assert.equal(game.players[0].money, 1500-150+28);
  assert.equal(game.players[1].money, 1500-28);
});

it('exchange', function(){
  let game = new monopoly.Game();
  game.newGame(2, 1500);
  game.cells[3].owner = 0;
  game.propertyTransfer(0, 1, 3);
  assert.equal(game.cells[3].owner, 1);
  assert.throws(function(){
    game.propertyTransfer(0, 1, 3);
  }, /Transfer Error/);
  game.moneyTransfer(0, 1, 1000);
  assert.equal(game.players[0].money, 500);
  assert.equal(game.players[1].money, 2500);
  assert.throws(function(){
    game.moneyTransfer(0, 1, 1000);
  }, /Transfer Error/);
});

it('bankrupt', function(){
  let game = new monopoly.Game(new DefinedDice([2, 2]));
  game.newGame(2, 150);
  game.cells[1].owner = 0;
  game.pledge(1);
  game.moveUnit();
  game.bankrupt(0);
  assert.equal(game.cells[1].owner, undefined);
  assert.equal(game.cells[1].isPledged, false);
  assert.equal(game.activePlayer, 1);
  assert.equal(game.players[0].bankrupt, true);
});
