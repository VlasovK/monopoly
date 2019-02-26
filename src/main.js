let infoTimeout;
let index = [1, 3, 5, 6, 8, 9, 11, 12, 13, 14, 15, 16, 18, 19, 21, 23, 24, 25
  , 26, 27, 28, 29, 31, 32, 34, 35, 37, 39];
let game;
let oneHover = false;

function rndDicePosition(){
  function randomise(min, max){
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }
  $('#dice-1').css('transform', 'rotate(' + randomise(0, 180) + 'deg)');
  $('#dice-2').css('transform', 'rotate(' + randomise(0, 180) + 'deg)');
  $('#dice-1').css('margin-top', randomise(0, 10) * (-1) + '%');
  $('#dice-2').css('margin-top', randomise(0, 10) * (-1) + '%');
  let marginLeft = randomise(-53, 0);
  let marginRight = randomise(12, 17 - marginLeft);
  $('#dice-1').css('margin-left', marginLeft + '%');
  $('#dice-1').css('margin-right', marginRight + '%');
}

function checkCapital(){
  let player = game.players[game.activePlayer];
  if (player.money >= 0){
    $('.bankrupt').hide();
    return;
  } else {
    $('#bankrupt-' + game.activePlayer).show();
  }
}

function nextPlayer(){
  $('.buy-deeds, .cards, .end, .roll, .dice, .pay-50, .wait-double').hide();
  for (let i=0; i<game.players.length; i++){
    $('#player-' + i).removeClass('active-player');
    $('.unit-' + i).removeClass('active-unit');
  }
  $('#player-' + game.activePlayer).addClass('active-player');
  $('.unit-' + game.activePlayer).addClass('active-unit');
  if (game.players[game.activePlayer].isFree == false){
    $('#player-' + game.activePlayer + ' .wait-double').show();
    $('#player-' + game.activePlayer + ' .pay-50').show();
  } else {
    $('#player-' + game.activePlayer + ' .roll').show();
  }
  if (game.players[game.activePlayer].bankrupt){
    nextPlayer();
  }
}

function showBuilds(i) {
  if (game.cells[i].hotels == 1) {
    $('.cell-' + i + '-top').css('color', '#880000')
      .css('line-height', '100%').css('text-shadow', '1px 1px #777');
  } else {
    $('.cell-' + i + '-top').css('color', '')
      .css('line-height', '').css('text-shadow', '1px 1px #bbb');
  }
  if (game.cells[i].hotels == 1) {
    $('.cell-' + i + '-top').html('🟎');
  } else if (game.cells[i].houses == 1){
    $('.cell-' + i + '-top').html('*');
  } else if (game.cells[i].houses == 2){
    $('.cell-' + i + '-top').html('**');
  } else if (game.cells[i].houses == 3){
    $('.cell-' + i + '-top').html('***');
  } else if (game.cells[i].houses == 4){
    $('.cell-' + i + '-top').html('****');
  } else {
    $('.cell-' + i + '-top').html('');
  }
  $('#hotels').text('🟎'.repeat(game.hotels));
  $('#houses').text('*'.repeat(game.houses));
}

//show main menu

$('#menu').hover(
  function(){
    $('#menu-right ul').show();
  },
  function(){
    infoTimeout = setTimeout(function(){
      $('#menu-right ul').hide();
    }, 270);
  }
);

$('#menu-right ul').hover(function (){
  $('#menu-right ul').show();
  clearTimeout(infoTimeout);
}, function () {
  infoTimeout = setTimeout(function(){
    $('#menu-right ul').hide();
  }, 270);
});

// new game

$('#menu-right ul li:first').click(function(){
  $('#new-game-settings').show();
  $('#new-game-right input').each(function(){
    this.value = '';
  });
  $('#new-game-right input:first').focus();
});

// start monopoly 🟎 *

// TODO refactor
$('#new-game-settings').submit(function(){
  if (!oneHover){
    oneHover = true;
    for (let i=0; i<index.length; i++) {
      $('.build-' + index[i]).click(function (){
        if (game.players[game.activePlayer].money
          >= game.cells[index[i]].buildPrice){
          game.build(index[i]);
          $('#player-' + game.activePlayer + ' .player-money')
            .html(game.players[game.activePlayer].money);
          showBuilds(index[i]);
        } else alert ('not enough GD');
      });
      $('.remove-' + index[i]).click(function (){
        game.remove(index[i]);
        $('#player-' + game.activePlayer + ' .player-money')
          .html(game.players[game.activePlayer].money);
        showBuilds(index[i]);
        checkCapital();
      });
      $('.pledge-' + index[i]).click(function (){
        game.pledge(index[i]);
        $('#player-' + game.activePlayer + ' .player-money')
          .html(game.players[game.activePlayer].money);
        $('#cell-' + index[i]).css('filter', 'brightness(35%)');
        $('#cell-' + index[i] + '-info-full' + ' .pledge').hide();
        $('#cell-' + index[i] + '-info-full' + ' .unpledge').show();
        checkCapital();
      });
      $('.unpledge-' + index[i]).click(function (){
        game.unPledge(index[i]);
        $('#player-' + game.activePlayer + ' .player-money')
          .html(game.players[game.activePlayer].money);
        $('#cell-' + index[i]).css('filter', '');
        $('#cell-' + index[i] + '-info-full' + ' .pledge').show();
        $('#cell-' + index[i] + '-info-full' + ' .unpledge').hide();
      });
      $('.cell-' + index[i] + '-top').hover(function (){
        $('.info').hide();
        $('#cell-' + index[i] + '-info-full').show();
        if (game.cells[index[i]].isPledged) {
          $('#cell-' + index[i] + '-info-full' + ' .pledge').hide();
          $('#cell-' + index[i] + '-info-full' + ' .unpledge').show();

        } else {
          $('#cell-' + index[i] + '-info-full' + ' .pledge').show();
          $('#cell-' + index[i] + '-info-full' + ' .unpledge').hide();
        }
      }, function () {
        infoTimeout = setTimeout(function (){
          $('#cell-' + index[i] + '-info-full').hide();
        }, 150);
      });
      $('#cell-' + index[i] + '-info-full').hover(function (){
        $('#cell-' + index[i] + '-info-full').show();
        clearTimeout(infoTimeout);
        if (game.cells[index[i]].isPledged) {
          $('#cell-' + index[i] + '-info-full' + ' .pledge').hide();
        } else {
          $('#cell-' + index[i] + '-info-full' + ' .unpledge').hide();
        }
      }, function () {
        $('#cell-' + index[i] + '-info-full').hide();
      });
    }
    for (let i=0; i<6 ;i++){
      $('#bankrupt-' + i).click(function(){
        $('.unit-' + i).hide();
        for (let j=0; j<game.cells.length; j++){
          if ('owner' in game.cells[j] && game.cells[j].owner == i){
            $('.owner-' + i).hide();
            $('#cell-' + j).css('filter', '');
          }
          if ('hotels' in game.cells[j]
            && game.cells[j].hotels > 0 || game.cells[j].houses > 0){
            while (game.cells[j].hotels > 0 || game.cells[j].houses > 0){
              game.fullRemove(j);
            }
          }
          showBuilds(j);
        }
        game.bankrupt(i);
        $('#player-' + i).css('filter', 'brightness(25%)');
        $('#player-' + i + ' .player-money').css('color', 'red').html('bankrupt');
        $('#bankrupt-' + i).hide();
        nextPlayer();
        let numberOfBankrupts = 0;
        for (let i=0; i<game.players.length; i++){
          if (game.players[i].bankrupt){
            numberOfBankrupts++;
          }
        }
        if (numberOfBankrupts + 1 == game.players.length){
          $('#player-' + game.activePlayer + ' .player-money')
            .css('color', '#33cc33').html('Winner!');
          $('.roll, .end, .pay-50, .wait-double').hide();
        }
      });
    }
  }
  // create game
  let players = [];
  for (let i=0; i<6; i++){
    $('#player-' + i).hide();
  }
  $('.roll, .end, .dice, .pay-50, .wait-double, .cards, .buy-deeds').hide();
  for (let i=0; i<40; i++){
    $('#cell-' + i + ' .unit').remove();
    for (let j=0; j<6; j++) {
      $('#cell-' + i + ' .owner-' + j).remove();
    }
  }
  $('.enter-player-name').each(function(){
    if (this.value != ''){
      players.push(this.value);
    }
  });
  if (players.length<2) {
    alert( 'min 2 players' );
    return false;
  }
  $('#new-game-settings').hide();
  // new DefinedDice([])
  game = new Game();
  game.newGame(players.length, +this.elements.money.value);
  for (let i=0; i<players.length; i++){
    $('#player-' + i).show();
    $('#player-' + i + ' .player-name').html(players[i]);
    $('#player-' + i + ' .player-money').html(this.elements.money.value);
  }
  for (let i=0; i<game.players.length ;i++) {
    let div = document.createElement('div');
    div.className = 'unit unit-' + i;
    $('#cell-0').append(div);
  }
  $('#player-' + game.activePlayer).addClass('active-player');
  $('.unit-' + game.activePlayer).addClass('active-unit');
  nextPlayer();
  $('#hotels').text('🟎'.repeat(game.hotels));
  $('#houses').text('*'.repeat(game.houses));
  return false;
});

// dice roll

$('.roll').click(function() {
  game.moveUnit();
  rndDicePosition();
  checkPosition();
});

function checkPosition(){
  let player = game.players[game.activePlayer];
  if (player.isFree == false){
    $('.buy-deeds, .roll').hide();
    $('.active-player .end').show();
  }
  if (game.doublesInARow >= 3 || player.position == 30){
    $('.d-res, .buy-deeds, .roll').hide();
    $('.dice').show();
    $('.dice1-result-' + game.dice.dice1).show();
    $('.dice2-result-' + game.dice.dice2).show();
    $('.active-player .end').show();
    $('#cell-' + player.position).append($('.unit-' + game.activePlayer));
    return;
  }
  $('.dice').show();
  $('.d-res').hide();
  if (!game.dice.isDouble()) {
    $('.roll').hide();
    $('.active-player .end').show();
  }
  $('.dice1-result-' + game.dice.dice1).show();
  $('.dice2-result-' + game.dice.dice2).show();
  $('#cell-' + player.position).append($('.unit-' + game.activePlayer));
  for (let i=0; i<game.players.length; i++){
    if (!game.players[i].bankrupt){
      $('#player-' + i + ' .player-money').html(game.players[i].money);
    }
  }
  if ('owner' in game.cells[player.position]
    && game.cells[player.position].owner == undefined){
    $('.buy-deeds').removeClass('buy-deeds-pos1 buy-deeds-pos2' +
      ' buy-deeds-pos3 buy-deeds-pos4').show();
    $('.buy-deeds p').html('would You like to buy<br/>this place for '
      + game.cells[game.players[game.activePlayer].position].price + 'GD?');
    if (player.position >= 35 || player.position < 5){
      $('.buy-deeds').addClass('buy-deeds-pos1');
    } else if (player.position >= 5 && player.position < 15){
      $('.buy-deeds').addClass('buy-deeds-pos2');
    } else if (player.position >= 15 && player.position < 25){
      $('.buy-deeds').addClass('buy-deeds-pos3');
    } else {
      $('.buy-deeds').addClass('buy-deeds-pos4');
    }
  }
  if (player.position == 2|| player.position == 17|| player.position == 33){
    $('#winter-is-coming').show();
    $('.buy-deeds').hide();
    setTimeout(function(){
      $('#winter-is-coming').hide();
    }, 1300);
    $('#winter-action').html(game.communityChestCards[0].text);
    setTimeout(function(){
      $('#winter-action').show();
    }, 1350);
    $('.end').hide();
    $('.roll').hide();
  }
  if (player.position == 7|| player.position == 22|| player.position == 36){
    $('#valari').show();
    $('.buy-deeds').hide();
    setTimeout(function(){
      $('#valari').hide();
    }, 1300);
    game.chanceCards[0].init(game);
    $('#valari-action').html(game.chanceCards[0].text);
    setTimeout(function(){
      $('#valari-action').show();
    }, 1350);
    $('.end').hide();
    $('.roll').hide();
  }
  checkCapital();
}

$('#winter-action').click(function(){
  let player = game.players[game.activePlayer];
  game.takeCommunityCard();
  $('#winter-action').hide();
  $('#cell-' + player.position).append($('.unit-' + game.activePlayer));
  for (let i=0; i<game.players.length; i++){
    if (!game.players[i].bankrupt){
      $('#player-' + i + ' .player-money').html(game.players[i].money);
    }
  }
  if (game.dice.isDouble()) $('.active-player .roll').show();
  else $('.active-player .end').show();
  if (player.position != 2 && player.position != 17 && player.position != 33){
    checkPosition();
  }
});

$('#valari-action').click(function(){
  let player = game.players[game.activePlayer];
  game.takeChanceCard();
  $('#valari-action').hide();
  $('#cell-' + player.position).append($('.unit-' + game.activePlayer));
  for (let i=0; i<game.players.length; i++){
    if (!game.players[i].bankrupt){
      $('#player-' + i + ' .player-money').html(game.players[i].money);
    }
  }
  if (game.dice.isDouble()) $('.active-player .roll').show();
  else $('.active-player .end').show();
  if (player.position != 7 && player.position != 22 && player.position != 36){
    checkPosition();
  }
});

// end move

$('.end').click(function(){
  game.endMove();
  nextPlayer();
});

// leave the prison

$('.pay-50').click(function(){
  game.players[game.activePlayer].isFree = true;
  game.players[game.activePlayer].money -= 50;
  $('#player-' + game.activePlayer + ' .player-money')
    .html(game.players[game.activePlayer].money);
  $('.wait-double, .pay-50').hide();
  $('.active-player .roll').show();
});

$('.wait-double').click(function(){
  game.dice.roll();
  rndDicePosition();
  $('.dice').show();
  $('.d-res').hide();
  $('.dice1-result-' + game.dice.dice1).show();
  $('.dice2-result-' + game.dice.dice2).show();
  if (!game.dice.isDouble()){
    $('.wait-double, .pay-50').hide();
    $('.active-player .end').show();
    game.players[game.activePlayer].attemptToDoubleInPrison++;
    if (game.players[game.activePlayer].attemptToDoubleInPrison == 3){
      $('.active-player .end').hide();
      $('.active-player .pay-50').show();
      game.players[game.activePlayer].attemptToDoubleInPrison = 0;
    }
  } else {
    $('.wait-double, .pay-50').hide();
    $('.active-player .roll').show();
    game.players[game.activePlayer].isFree = true;
    game.doublesInARow = 0;
  }
});

// buy deeds

$('#buy').click(function() {
  if (game.players[game.activePlayer].money
    >= game.cells[game.players[game.activePlayer].position].price){
    game.buyDeed();
  $('.buy-deeds').hide();
  let div = document.createElement('div');
  div.className = 'owner-' + game.activePlayer;
  $('#cell-' + game.players[game.activePlayer].position).prepend(div);
  $('#player-' + game.activePlayer + ' .player-money')
    .html(game.players[game.activePlayer].money);
  } else {
    alert ('not enough GD');
  }
});

$('#no-buy').click(function(){
  $('.buy-deeds').hide();
});

// $(document).keyup(function(e){
//   if (e.shiftKey && e.keyCode==78){
//
//   }
// });
