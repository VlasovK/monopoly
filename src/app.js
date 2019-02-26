import React from "react";
import ReactDOM from "react-dom";
import {Game} from "./monopoly";
import {DefinedDice} from "./test_util";
let game;
const maxPlayers = 6;
const maxCells = 40;

function randomise(min, max){
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

class Player extends React.Component {
  render() {
    let {player, isActive, isBankruptVisible} = this.props;
    let className = 'players-box' + (isActive ? ' active-player' : '');
    let buttons = [];
    if (isBankruptVisible && isActive) {
      buttons.push(<div key="0" className="player-button bankrupt" onClick={this.props.bankrupt}>bankrupt</div>);
    }
    if (!isBankruptVisible && this.props.isRollVisible && isActive) {
      buttons.push(<div key="1" className="player-button roll" onClick={this.props.diceRoll}>move unit</div>);
    }
    if (!isBankruptVisible && this.props.isEndTurnVisible && isActive) {
      buttons.push(<div key="2" className="player-button end" onClick={this.props.endTurn}>end turn</div>);
    }
    if (!isBankruptVisible && this.props.isWaitDoubleVisible && isActive) {
      buttons.push(<div key="3" className="player-button wait-double" onClick={this.props.waitDouble}>dice roll</div>);
    }
    if (!isBankruptVisible && this.props.isPay50Visible && isActive) {
      buttons.push(<div key="4" className="player-button pay-50" onClick={this.props.pay50}>pay 50GD</div>);
    }
    if (this.props.isGameOver && !player.bankrupt) {
      buttons.push(<div key="5" className="winner">winner</div>);
    }
    let money = player.bankrupt ? <span className="bankrupt-style">bankrupt</span> : `${player.money}GD`;
    return (
      <div className={className}>
        <div className={`player-box-${player.color}`} onClick={this.props.setTransferTo}>
          {!player.isFree && 'ᚎ'}
        </div>
        <div className="player-stats">
          <div className="player-name text-eclipse">{player.name}</div>
          <div className="player-money">{money}</div>
        </div>
        {buttons}
      </div>
    );
  }
}

// props:
// - diceCounter, dice1, dice2, isDicesVisible
class Dices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static getDerivedStateFromProps(props, state) {
    if (state.diceCounter == props.diceCounter)
      return null;
    let marginLeft1 = randomise(2, 64);
    return {
      dice1: props.dice1,
      dice2: props.dice2,
      diceCounter: props.diceCounter,
      marginTop1: randomise(2, 12),
      marginTop2: randomise(2, 12),
      marginLeft1,
      marginLeft2: randomise(5, 69 - marginLeft1),
      rotate1: randomise(0, 359),
      rotate2: randomise(0, 359)
    };
  }
  render(){
    let style1 = {
      marginTop: this.state.marginTop1 + "%",
      marginLeft: this.state.marginLeft1 + "%",
      transform: "rotate(" + this.state.rotate1 + "deg)"
    };
    let style2 = {
      marginTop: this.state.marginTop2 + "%",
      marginLeft: this.state.marginLeft2 + "%",
      transform: "rotate(" + this.state.rotate2 + "deg)"
    };
    let dice1, dice2;
    if (this.props.isDicesVisible) {
      dice1 = <div className={`dice firstDice dice${this.state.dice1}`} style={style1}/>;
      dice2 = <div className={`dice secondDice dice${this.state.dice2}`} style={style2}/>;
    }
    return (
      <div id="dices-block">
        {dice1}
        {dice2}
      </div>
    );
  }
}

class Players extends React.Component {
  render(){
    return game.players.map((player, index)=>{
      return (
        <Player
          setTransferTo={()=>this.props.setTransferTo(index)}
          key={`p${index}`}
          player={player}
          nextPlayer={this.props.nextPlayer}
          isActive={this.props.activePlayer == index}
          activePlayer={this.props.activePlayer}
          isBankruptVisible={this.props.isBankruptVisible}
          bankrupt={this.props.bankrupt}
          isRollVisible={this.props.isRollVisible}
          setRollVisible={this.props.setRollVisible}
          diceRoll={this.props.diceRoll}
          isEndTurnVisible={this.props.isEndTurnVisible}
          setEndTurnVisible={this.props.setEndTurnVisible}
          endTurn={this.props.endTurn}
          isWaitDoubleVisible={this.props.isWaitDoubleVisible}
          setWaitDoubleVisible={this.props.setWaitDoubleVisible}
          waitDouble={this.props.waitDouble}
          isPay50Visible={this.props.isPay50Visible}
          setPay50Visible={this.props.setPay50Visible}
          pay50={this.props.pay50}
          isGameOver={this.props.isGameOver}
        />
      );
    });
  }
}

class TopOfTheMap extends React.Component{
  render() {
    return(
      <div id="top-of-the-map">
        <Cell id="cell-30" className="cell"/>
        <Cell id="cell-29" className="top-line cell" cellsOwners={this.props.cellsOwners} isPledged={this.props.isPledged}>
          <Color
            showInfo={this.props.showInfo} hideInfo={this.props.hideInfoTimer}
            isBuilds={this.props.isBuilds}
            i={29}
            street={'26-27-29'}
          />
          <div className="cell-29">
            <p className="cell-text">meereen</p>
            <p className="cell-text-bottom">280gd</p>
          </div>
        </Cell>
        <Cell id="cell-28" className="top-line cell" cellsOwners={this.props.cellsOwners} isPledged={this.props.isPledged}>
          <div className="cell-master-of-coin cell-28-top"
            onMouseEnter={()=>this.props.showInfo(28)} onMouseLeave={this.props.hideInfoTimer}
          >
            <p className="cell-text">master of coin</p>
            <p className="cell-12-28-text">150gd</p>
          </div>
        </Cell>
        <Cell id="cell-27" className="top-line cell" cellsOwners={this.props.cellsOwners} isPledged={this.props.isPledged}>
          <Color
            showInfo={this.props.showInfo} hideInfo={this.props.hideInfoTimer}
            isBuilds={this.props.isBuilds}
            i={27}
            street={'26-27-29'}
          />
          <div className="cell-27">
            <p className="cell-text">yunkai</p>
            <p className="cell-text-bottom">260gd</p>
          </div>
        </Cell>
        <Cell id="cell-26" className="top-line cell" cellsOwners={this.props.cellsOwners} isPledged={this.props.isPledged}>
          <Color
            showInfo={this.props.showInfo} hideInfo={this.props.hideInfoTimer}
            isBuilds={this.props.isBuilds}
            i={26}
            street={'26-27-29'}
          />
          <div className="cell-26">
            <p className="cell-text">astapor</p>
            <p className="cell-text-bottom">260gd</p>
          </div>
        </Cell>
        <Cell id="cell-25" className="top-line cell" cellsOwners={this.props.cellsOwners} isPledged={this.props.isPledged}>
          <div className="cell-25-top"
            onMouseEnter={()=>this.props.showInfo(25)} onMouseLeave={this.props.hideInfoTimer}
          >
            <p className="cell-houses-price">200GD</p>
          </div>
        </Cell>
        <Cell id="cell-24" className="top-line cell" cellsOwners={this.props.cellsOwners} isPledged={this.props.isPledged}>
          <Color
            showInfo={this.props.showInfo} hideInfo={this.props.hideInfoTimer}
            isBuilds={this.props.isBuilds}
            i={24}
            street={'21-23-24'}
          />
          <div className="cell-24">
            <p className="cell-text">the twins</p>
            <p className="cell-text-bottom">240gd</p>
          </div>
        </Cell>
        <Cell id="cell-23" className="top-line cell" cellsOwners={this.props.cellsOwners} isPledged={this.props.isPledged}>
          <Color
            showInfo={this.props.showInfo} hideInfo={this.props.hideInfoTimer}
            isBuilds={this.props.isBuilds}
            i={23}
            street={'21-23-24'}
          />
          <div className="cell-23">
            <p className="cell-text">dreadfort</p>
            <p className="cell-text-bottom">220gd</p>
          </div>
        </Cell>
        <Cell id="cell-22" className="top-line cell">
          <div className="cell-valari"/>
        </Cell>
        <Cell id="cell-21" className="top-line cell" cellsOwners={this.props.cellsOwners} isPledged={this.props.isPledged}>
          <Color
            showInfo={this.props.showInfo} hideInfo={this.props.hideInfoTimer}
            isBuilds={this.props.isBuilds}
            i={21}
            street={'21-23-24'}
          />
          <div className="cell-21">
            <p className="cell-text">harren hall</p>
            <p className="cell-text-bottom">220gd</p>
          </div>
        </Cell>
        <Cell id="cell-20" className="cell"/>
      </div>
    )
  }
}

class LeftOfTheMap extends React.Component{
  render() {
    return(
      <div id="left-of-the-map">
        <Cell id="cell-19" className="left-line cell" cellsOwners={this.props.cellsOwners} isPledged={this.props.isPledged}>
          <Color
            showInfo={this.props.showInfo} hideInfo={this.props.hideInfoTimer}
            isBuilds={this.props.isBuilds}
            i={19}
            street={'16-18-19'}
          />
          <div className="cell-19">
            <p className="cell-text">moat cailin</p>
            <p className="cell-text-bottom">200gd</p>
          </div>
        </Cell>
        <Cell id="cell-18" className="left-line cell" cellsOwners={this.props.cellsOwners} isPledged={this.props.isPledged}>
          <Color
            showInfo={this.props.showInfo} hideInfo={this.props.hideInfoTimer}
            isBuilds={this.props.isBuilds}
            i={18}
            street={'16-18-19'}
          />
          <div className="cell-18">
            <p className="cell-text">dragon stone</p>
            <p className="cell-text-bottom">180gd</p>
          </div>
        </Cell>
        <Cell id="cell-17" className="left-line cell">
          <div className="cell-winter-is-coming"/>
        </Cell>
        <Cell id="cell-16" className="left-line cell" cellsOwners={this.props.cellsOwners} isPledged={this.props.isPledged}>
          <Color
            showInfo={this.props.showInfo} hideInfo={this.props.hideInfoTimer}
            isBuilds={this.props.isBuilds}
            i={16}
            street={'16-18-19'}
          />
          <div className="cell-16">
            <p className="cell-text">the eurie</p>
            <p className="cell-text-bottom">180gd</p>
          </div>
        </Cell>
        <Cell id="cell-15" className="left-line cell" cellsOwners={this.props.cellsOwners} isPledged={this.props.isPledged}>
          <div className="cell-15-top"
            onMouseEnter={()=>this.props.showInfo(15)} onMouseLeave={this.props.hideInfoTimer}
          >
            <p className="cell-houses-price">200GD</p>
          </div>
        </Cell>
        <Cell id="cell-14" className="left-line cell" cellsOwners={this.props.cellsOwners} isPledged={this.props.isPledged}>
          <Color
            showInfo={this.props.showInfo} hideInfo={this.props.hideInfoTimer}
            isBuilds={this.props.isBuilds}
            i={14}
            street={'11-13-14'}
          />
          <div className="cell-14">
            <p className="cell-text">pentos</p>
            <p className="cell-text-bottom">160gd</p>
          </div>
        </Cell>
        <Cell id="cell-13" className="left-line cell" cellsOwners={this.props.cellsOwners} isPledged={this.props.isPledged}>
          <Color
            showInfo={this.props.showInfo} hideInfo={this.props.hideInfoTimer}
            isBuilds={this.props.isBuilds}
            i={13}
            street={'11-13-14'}
          />
          <div className="cell-13">
            <p className="cell-text">qarth</p>
            <p className="cell-text-bottom">140gd</p>
          </div>
        </Cell>
        <Cell id="cell-12" className="left-line cell" cellsOwners={this.props.cellsOwners} isPledged={this.props.isPledged}>
          <div className="cell-master-of-coin cell-12-top"
            onMouseEnter={()=>this.props.showInfo(12)} onMouseLeave={this.props.hideInfoTimer}
          >
            <p className="cell-text">master of coin</p>
            <p className="cell-12-28-text">150gd</p>
          </div>
        </Cell>
        <Cell id="cell-11" className="left-line cell" cellsOwners={this.props.cellsOwners} isPledged={this.props.isPledged}>
          <Color
            showInfo={this.props.showInfo} hideInfo={this.props.hideInfoTimer}
            isBuilds={this.props.isBuilds}
            i={11}
            street={'11-13-14'}
          />
          <div className="cell-11">
            <p className="cell-text">vaes dothrak</p>
            <p className="cell-text-bottom">140gd</p>
          </div>
        </Cell>
      </div>
    )
  }
}

class WinterCard extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      winterInverted: false,
    };
  }
  invertWinter() {
    this.setState({winterInverted: !this.state.winterInverted});
  }
  render() {
    if (!this.state.winterInverted) {
     return <div id="winter-is-coming" className="cards" onClick={this.invertWinter.bind(this)}/>;
    } else {
      return (
        <div id="winter-action" className="cards" onClick={this.props.winterAction}>
          {game.communityChestCards[0].text}
        </div>
      );
    }
  }
}

class ValariCard extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      valariInverted: false,
    };
  }
  invertValari() {
    this.setState({valariInverted: !this.state.valariInverted});
  }
  render() {
    if (!this.state.valariInverted) {
      return <div id="valari" className="cards" onClick={this.invertValari.bind(this)}/>;
    } else {
      return (
        <div id="valari-action" className="cards" onClick={this.props.valariAction}>
          {game.chanceCards[0].text}
        </div>
      );
    }
  }
}

class CentralSquare extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    let info;
    this.properties = [1, 3, 6, 8, 9, 11, 13, 14, 16, 18, 19, 21, 23, 24, 26, 27, 29, 31, 32, 34, 37, 39];
    this.railways = [5, 15, 25, 35];
    this.communals = [12, 28];
    let i = this.props.showInfoId;
    if (game && this.properties.includes(i)) {
      info =
        <div id={`cell-${i}-info-full`} className="info"
          onMouseEnter={()=>this.props.showInfo(i)}
          onMouseLeave={this.props.hideInfo}
        >
          <div id={`cell-${i}-info`}>
            <div className={`cell-${game.cells[i].street}-info-color`}>{game.cells[i].name}</div>
            <div className="cell-info-block">
              {`rent ${game.cells[i].rent[0]}GD`}<br/>
              <b>{`⚐`}</b>{` ${game.cells[i].rent[1]}GD`}<br/>
              <b>{`⚐⚐`}</b>{` ${game.cells[i].rent[2]}GD`}<br/>
              <b>{`⚐⚐⚐`}</b>{` ${game.cells[i].rent[3]}GD`}<br/>
              <b>{`⚐⚐⚐⚐`}</b>{` ${game.cells[i].rent[4]}GD`}<br/>
              <b>{`⚑`}</b>{` ${game.cells[i].rent[5]}GD`}
            </div>
            <div
              className={`cell-info-button remove remove-${i}`}
              onClick={()=>this.props.remove(i)}
            >
              {`remove ${game.cells[i].buildPrice/2}GD`}
            </div>
            {game.cells[i].isPledged ?
              <div
                className={`cell-info-button unpledge unpledge-${i}`}
                onClick={()=>this.props.unpledge(i)}
              >
                {`buyback ${game.cells[i].price}GD`}
              </div>
            : <div
                className={`cell-info-button pledge pledge-${i}`}
                onClick={()=>this.props.pledge(i)}
              >
                {`plegde ${game.cells[i].price / 2}GD`}
              </div>
            }
            <div
              className={`cell-info-button build build-${i}`}
              onClick={()=>this.props.build(i)}
            >
              {`build ${game.cells[i].buildPrice}GD`}
              </div>
          </div>
        </div>;
    } else if (game && this.railways.includes(i)) {
      info =
        <div id={`cell-${i}-info-full`} className="info"
          onMouseEnter={()=>this.props.showInfo(i)}
          onMouseLeave={this.props.hideInfo}
        >
          <div className={`cell-${i}-info`}>
            <div className={`cell-${i}-info-left`}>{'X1 25GD'}<br/>{'X2 50GD'}<br/>{'X3 100GD'}<br/>{'X4 200GD'}</div>
            <div className={`cell-${i}-img`}/>
          </div>
          {game.cells[i].isPledged ?
              <div
                className={`cell-info-button unpledge unpledge-${i}`}
                onClick={()=>this.props.unpledge(i)}
              >
                {`buyback ${game.cells[i].price}GD`}
              </div>
            : <div
                className={`cell-info-button pledge pledge-${i}`}
                onClick={()=>this.props.pledge(i)}
            >
                {`pledge ${game.cells[i].price / 2}GD`}
              </div>
          }
        </div>;
    } else if (game && this.communals.includes(i)) {
      info =
        <div id={`cell-${i}-info-full`} className="info"
          onMouseEnter={()=>this.props.showInfo(i)}
          onMouseLeave={this.props.hideInfo}
        >
          <div className={`cell-${i}-info`}>
            <div className={`cell-${i}-info-left`}>{'X1 roll*4'}<br/>{'X2 roll*10'}</div>
            <div className={`cell-${i}-img`}/>
          </div>
          {game.cells[i].isPledged ?
            <div
              className={`cell-info-button unpledge unpledge-$[i]`}
              onClick={()=>this.props.unpledge(i)}
            >
              buyback 150GD
            </div>
          : <div
              className={`cell-info-button pledge pledge-$[i]`}
              onClick={()=>this.props.pledge(i)}
            >
              pledge 75GD
            </div>
          }
        </div>;
    }
    let buyDeedsInfo;
    if (this.props.isBuyDeeds) {
      let i = this.props.isBuyDeeds;
      buyDeedsInfo = (
        <div className="buy-deeds">
          <p>{'Would you like to buy'}
            <br/>{game.cells[i].name.toUpperCase()}
            <br/>{'for ' + game.cells[i].price + 'GD?'}
          </p>
          <div id="buy" onClick={this.props.buyDeeds}>yes</div>
          <div id="no-buy" onClick={this.props.hideBuyDeeds}>no <small>thanks</small></div>
        </div>
      );
    }
    let winterCard;
    if (this.props.isWinterVisible) {
      winterCard = <WinterCard winterAction={this.props.winterAction}/>;
    }
    let valariCard;
    if (this.props.isValariVisible) {
      valariCard = <ValariCard valariAction={this.props.valariAction}/>;
    }
    return(
      <div id="central-square">
        {info}
        {buyDeedsInfo}
        {winterCard}
        {valariCard}
      </div>
    )
  }
}

class RightOfTheMap extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div id="right-of-the-map">
        <Cell id="cell-39" className="right-line cell" cellsOwners={this.props.cellsOwners} isPledged={this.props.isPledged}>
          <Color
            showInfo={this.props.showInfo} hideInfo={this.props.hideInfoTimer}
            isBuilds={this.props.isBuilds}
            i={39}
            street={'37-39'}
          />
          <div className="cell-39">
            <p className="cell-text">king's landing</p>
            <p className="cell-text-bottom">400gd</p>
          </div>
        </Cell>
        <Cell id="cell-38" className="right-line cell">
          <div className="cell-boltons">
            <p className="cell-boltons-cost">-100GD</p>
          </div>
        </Cell>
        <Cell id="cell-37" className="right-line cell" cellsOwners={this.props.cellsOwners} isPledged={this.props.isPledged}>
          <Color
            showInfo={this.props.showInfo} hideInfo={this.props.hideInfoTimer}
            isBuilds={this.props.isBuilds}
            i={37}
            street={'37-39'}
          />
          <div className="cell-37">
            <p className="cell-text">braavos</p>
            <p className="cell-text-bottom">350gd</p>
          </div>
        </Cell>
        <Cell id="cell-36" className="right-line cell">
          <div className="cell-valari"/>
        </Cell>
        <Cell id="cell-35" className="right-line cell" cellsOwners={this.props.cellsOwners} isPledged={this.props.isPledged}>
          <div className="cell-35-top"
            onMouseEnter={()=>this.props.showInfo(35)} onMouseLeave={this.props.hideInfoTimer}
          >
            <p className="cell-houses-price">200GD</p>
          </div>
        </Cell>
        <Cell id="cell-34" className="right-line cell" cellsOwners={this.props.cellsOwners} isPledged={this.props.isPledged}>
          <Color
            showInfo={this.props.showInfo} hideInfo={this.props.hideInfoTimer}
            isBuilds={this.props.isBuilds}
            i={34}
            street={'31-32-34'}
          />
          <div className="cell-34">
            <p className="cell-text">winterfell</p>
            <p className="cell-text-bottom">320gd</p>
          </div>
        </Cell>
        <Cell id="cell-33" className="right-line cell">
          <div className="cell-winter-is-coming"/>
        </Cell>
        <Cell id="cell-32" className="right-line cell" cellsOwners={this.props.cellsOwners} isPledged={this.props.isPledged}>
          <Color
            showInfo={this.props.showInfo} hideInfo={this.props.hideInfoTimer}
            isBuilds={this.props.isBuilds}
            i={32}
            street={'31-32-34'}
          />
          <div className="cell-32">
            <p className="cell-text">pyke</p>
            <p className="cell-text-bottom">300gd</p>
          </div>
        </Cell>
        <Cell id="cell-31" className="right-line cell" cellsOwners={this.props.cellsOwners} isPledged={this.props.isPledged}>
          <Color
            showInfo={this.props.showInfo} hideInfo={this.props.hideInfoTimer}
            isBuilds={this.props.isBuilds}
            i={31}
            street={'31-32-34'}
          />
          <div className="cell-31">
            <p className="cell-text">castle black</p>
            <p className="cell-text-bottom">300gd</p>
          </div>
        </Cell>
      </div>
    )
  }
}

class Cell extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    let units = [];
    let owner;
    let i = +this.props.id.slice(5);
    if (game) {
      game.players.map((player, index)=>{
        if (player.position == i && !player.bankrupt) {
          units.push(
            <div
              key={'k' + index}
              className={'unit unit-' + player.color + (game.activePlayer == index ? ' active-unit' : '')}
            />
          );
        }
      });
      if ('owner' in game.cells[i] && this.props.cellsOwners[i] != undefined) {
        owner = <div className={`owner owner-${game.players[game.cells[i].owner].color}`}/>
      }
    }
    let styleCSS = {};
    if (game && 'owner' in game.cells[i] && this.props.isPledged[i]) {
      styleCSS = {"filter": "brightness(35%)"};
    } else {
      styleCSS = {};
    }
    return (
      <div id={this.props.id} className={this.props.className} style={styleCSS}>
        {owner}
        {this.props.children}
        {units}
      </div>
    );
  }
}

class Color extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    let builds;
    if (game && this.props.isBuilds[this.props.i] == 5) {
      builds = '⚑';
    } else if (game) {
      builds = '⚐'.repeat(game.cells[this.props.i].houses);
    } else {
      builds = '';
    }
    return (
      <div className={`cell-${this.props.i}-top cell-${this.props.street}-color`}
        onMouseEnter={()=>this.props.showInfo(this.props.i)}
        onMouseLeave={this.props.hideInfo}
      >
        {builds}
      </div>
    );
  }
}

class BottomOfTheMap extends React.Component{
  render() {
    return(
      <div id="bottom-of-the-map">
        <Cell id="cell-10" className="cell"/>
        <Cell id="cell-9" className="top-line cell" cellsOwners={this.props.cellsOwners} isPledged={this.props.isPledged}>
          <Color
            showInfo={this.props.showInfo} hideInfo={this.props.hideInfoTimer}
            isBuilds={this.props.isBuilds}
            i={9}
            street={'6-8-9'}
          />
          <div className="cell-9">
            <p className="cell-text">the inn</p>
            <p className="cell-text-bottom">120gd</p>
          </div>
        </Cell>
        <Cell id="cell-8" className="top-line cell" cellsOwners={this.props.cellsOwners} isPledged={this.props.isPledged}>
          <Color
            showInfo={this.props.showInfo} hideInfo={this.props.hideInfoTimer}
            isBuilds={this.props.isBuilds}
            i={8}
            street={'6-8-9'}
          />
          <div className="cell-8">
            <p className="cell-text">mole's town</p>
            <p className="cell-text-bottom">100gd</p>
          </div>
        </Cell>
        <Cell id="cell-7" className="top-line cell">
          <div className="cell-valari"/>
        </Cell>
        <Cell id="cell-6" className="top-line cell" cellsOwners={this.props.cellsOwners} isPledged={this.props.isPledged}>
          <Color
            showInfo={this.props.showInfo} hideInfo={this.props.hideInfoTimer}
            isBuilds={this.props.isBuilds}
            i={6}
            street={'6-8-9'}
          />
          <div className="cell-6">
            <p className="cell-text">the nightfort</p>
            <p className="cell-text-bottom">100gd</p>
          </div>
        </Cell>
        <Cell id="cell-5" className="top-line cell" cellsOwners={this.props.cellsOwners} isPledged={this.props.isPledged}>
          <div className="cell-5-top"
            onMouseEnter={()=>this.props.showInfo(5)} onMouseLeave={this.props.hideInfoTimer}
          >
            <p className="cell-houses-price">200GD</p>
          </div>
        </Cell>
        <Cell id="cell-4" className="top-line cell">
          <div className="cell-boltons">
            <p className="cell-boltons-cost">-200GD</p>
          </div>
        </Cell>
        <Cell id="cell-3" className="top-line cell" cellsOwners={this.props.cellsOwners} isPledged={this.props.isPledged}>
          <Color
            showInfo={this.props.showInfo} hideInfo={this.props.hideInfoTimer}
            isBuilds={this.props.isBuilds}
            i={3}
            street={'1-3'}
          />
          <div className="cell-3">
            <p className="cell-text">the fist of the first men</p>
            <p className="cell-text-bottom">60gd</p>
          </div>
        </Cell>
        <Cell id="cell-2" className="top-line cell">
          <div className="cell-winter-is-coming"/>
        </Cell>
        <Cell id="cell-1" className="top-line cell" cellsOwners={this.props.cellsOwners} isPledged={this.props.isPledged}>
          <Color
            showInfo={this.props.showInfo} hideInfo={this.props.hideInfoTimer}
            isBuilds={this.props.isBuilds}
            i={1}
            street={'1-3'}
          />
          <div className="cell-1">
            <p className="cell-text">craster's keep</p>
            <p className="cell-text-bottom">60gd</p>
          </div>
        </Cell>
        <Cell id="cell-0" className="cell"/>
      </div>
    )
  }
}

class Form extends React.Component{
  constructor(props) {
    super(props);
    this.handleRadio = this.handleRadio.bind(this);
    this.state = {
      startCapital: 1500,
      playerNames: ['', '', '', '', '', ''],
      playerColors: []
    };
    this.arrColors = ['yellow', 'limegreen', 'dodgerblue', 'red', 'orange', 'lightblue', 'purple', 'pink'];
    this.state.playerColors = this.arrColors.slice();
  }
  handleRadio(event) {
    let val = event.target.value;
    this.setState({startCapital: val});
  }
  nextColor(i) {
    let index = this.arrColors.indexOf(this.state.playerColors[i]);
    let newIndex = (index+1)%this.arrColors.length;
    this.setState({playerColors: Object.assign(this.state.playerColors, {[i]: this.arrColors[newIndex]})});
  }
  handleName(i, event) {
    this.setState({playerNames: Object.assign(this.state.playerNames, {[i]: event.target.value})});
  }
  closeSetMenu() {
    this.setState({formVisible: true});
  }
  hasDuplicatedNames(players) {
    let object = {};
    players.forEach((value)=>{
      object[value] = true;
    });
    let playersFiltered = [];
    for (let key in object) {
      playersFiltered.push(key);
    }
    return players.length != playersFiltered.length;
  }
  hasDuplicatedColors(colors) {
    let object = {};
    colors.forEach((value)=>{
      object[value] = true;
    });
    let colorsFiltered = [];
    for (let key in object) {
      colorsFiltered.push(key);
    }
    return colors.length != colorsFiltered.length;
  }
  startGame(event) {
    event.preventDefault();
    let players = [];
    for (let key in this.state.playerNames) {
      if (this.state.playerNames[key]) {
        players.push(this.state.playerNames[key]);
      }
    }
    let colors = [];
    for (let key in this.state.playerColors) {
      if (this.state.playerNames[key]) {
        colors.push(this.state.playerColors[key]);
      }
    }
    if (players.length < 2) {
      alert('min 2 players');
      return;
    }
    if (this.hasDuplicatedNames(players)) {
      alert('select different names');
      return;
    }
    if (this.hasDuplicatedColors(colors)) {
      alert('select different colors');
      return;
    }
    window.game = game = new Game(); // new DefinedDice([])
    game.newGame(players.length, +this.state.startCapital);
    players.forEach((name, index)=>{
      game.players[index].name = name;
    });
    colors.forEach((color, index)=>{
      game.players[index].color = color;
    });
    this.props.onClose();
    this.props.nextPlayer();
    this.props.showPlayers();
    // todo: this form shouldn't know about player's buttons
    this.props.setRollVisible(true);
  }
  render() {
    let gameItems = [];
    let moneyItems = [750, 1500, 2500, 3000, 4000, 5000];
    for (let i=0; i<maxPlayers; i++) {
      gameItems.push(
        <div key={'b'+i} className="qwe">
          <label className="settings-label">
            <input
              type="radio"
              name="money"
              value={moneyItems[i]}
              onChange={this.handleRadio}
              checked={moneyItems[i] == this.state.startCapital}
              tabIndex="-1"
              key={'input'+i}
            />
            &nbsp;{moneyItems[i]}GD
          </label>
          <div
            className={'change-color player-color-'+this.state.playerColors[i]}
            onClick={this.nextColor.bind(this, i)}
          />
          <input
            className="enter-player-name"
            onChange={this.handleName.bind(this, i)}
            placeholder={`player ${i + 1}`}
            autoFocus={i == 0}
            maxLength="21"
            spellCheck="false"
            value={this.state.playerNames[i]}
          />
        </div>
      );
    }
    return (
      <form id="game-settings" onSubmit={this.startGame.bind(this)}>
        <div id="game-settings-close" onClick={this.props.onClose}>close</div>
        <div id="settings-spans">
          <span id="start-money">start money</span>
          <span id="players-name">players name</span>
        </div>
        {gameItems}
        <button id="submit" type="submit">start Monopoly</button>
      </form>
    );
  }
}

// props:
// - activePlayer
// - transferWith
// - closeTransfer()
// - onTransfer(transferWith, moneyLeft, propertiesLeft = [], moneyRight, propertiesRight = [])
class PlayerTransferForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      left: {money: 0, properties: []},
      right: {money: 0, properties: []},
    };
  }
  setMoney(side, money) {
    let player;
    if (side == "left") {
      player = game.activePlayer;
    } else {
      player = this.props.transferWith;
    }
    if (!isNaN(money) && money <= game.players[player].money)
      this.setState({[side]: Object.assign(this.state[side], {money})});
  }
  toggleProperty(side, index, checked){
    let p = this.state[side].properties;
    p = checked ? [...p, index] : p.filter(i=>i!=index);
    this.setState({[side]: Object.assign(this.state[side], {properties: p})});
  }
  playersItems(side, playerId){
    let money = (
      <div>
        <input
          className={`enter-money enter-money-${side}`}
          value={this.state[side].money||''}
          onChange={e=>this.setMoney(side, +e.target.value)}
          placeholder={`from 0 to ${game.players[playerId].money}`}
        />
        <small>GD</small>
      </div>
    );
    let properties = [];
    // game.cells.filter().map();
    for (let i=0; i<game.cells.length; i++) {
      if (game.cells[i].owner == playerId && game.canCellBeTransferred(i)) {
        properties.push(
          <label key={i} className={`transfer-deeds-color-${game.cells[i].street}`}>
            <input
              type="checkbox"
              checked={this.state[side].properties.includes(i)}
              onChange={e=>this.toggleProperty(side, i, e.target.checked)}
            />
            {game.cells[i].name}
          </label>
        );
      }
    }
    let color = game.players[playerId].color;
    return (
      <div className={`transfer-contain transfer-contain-${side}`}>
        <div className={`transfer-color-${color}`} style={{float: side}}/>
        {money}
        {properties}
      </div>
    );
  }
  onSubmit(e){
    e.preventDefault();
    this.props.transfer(this.props.transferWith, this.state.left.money, this.state.left.properties,
      this.state.right.money, this.state.right.properties);
  }
  render(){
    return (
      <form onSubmit={this.onSubmit.bind(this)} id="transfer-block">
        <div id="transfer-close" onClick={this.props.closeTransfer}>close</div>
        <h2>Transfer</h2>
        {this.playersItems('left', this.props.activePlayer)}
        {this.playersItems('right', this.props.transferWith)}
        <button id="transfer-submit" type="submit">Apply</button>
      </form>
    );
  }
}

class MenuRight extends React.Component {
  constructor(props) {
    super(props);
    this.timerId = null;
    this.state = {
      menuVisible: false,
      formVisible: false
    };
  }
  menuHoverOn() {
    clearTimeout(this.timerId);
    this.setState({menuVisible: true});
  }
  menuHoverOff() {
    this.timerId = setTimeout(()=>{
      this.setState({menuVisible: false})
    }, 270);
  }
  ulHoverOn() {
    clearTimeout(this.timerId);
    this.setState({menuVisible: true});
  }
  ulHoverOff() {
    this.timerId = setTimeout(()=>{
      this.setState({menuVisible: false})
    }, 270);
  }
  showForm() {
    game ? alert('refresh the page') : this.setState({formVisible: true});
  }
  render() {
    let ul, form;
    if (this.state.menuVisible) {
      ul =
        <ul onMouseEnter={this.ulHoverOn.bind(this)} onMouseLeave={this.ulHoverOff.bind(this)}>
          <li onClick={this.showForm.bind(this)}>new game</li>
          <li>monopoly rules</li>
          <li>feedback</li>
        </ul>;
    }
    if (this.state.formVisible) {
      form =
        <Form
          onClose={()=>{ this.setState({formVisible: false}); }}
          showPlayers={this.props.showPlayers}
          hidePlayers={this.props.hidePlayers}
          nextPlayer={this.props.nextPlayer}
          activePlayer={this.props.activePlayer}
          setRollVisible={this.props.setRollVisible}
        />;
    }
    let transferBlock;
    if (this.props.transferWith!==undefined) {
      transferBlock =
        <PlayerTransferForm
          activePlayer={this.props.activePlayer}
          transferWith={this.props.transferWith}
          transfer={this.props.transfer}
          closeTransfer={this.props.closeTransfer}
        />;
    }
    return (
      <div id="menu-right" className="menu">
        <div id="menuImg" onMouseEnter={this.menuHoverOn.bind(this)} onMouseLeave={this.menuHoverOff.bind(this)}/>
        {ul}
        {form}
        {transferBlock}
      </div>
    );
  }
}

class HotelsAndHouses extends React.Component {
  render() {
    return (
      <div id="hotels-and-houses">
        <p><span>⚑</span>&nbsp;{this.props.hotels}</p>
        <p>⚐&nbsp;{this.props.houses}</p>
      </div>
    );
  }
}

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.timerId = null;
    this.state = {
      cellsOwners: [],
      isPledged: [],
      playersVisible: false,
      infoVisible: undefined,
      activePlayer: null,
      isBankruptVisible: false,
      isRollVisible: false,
      isEndTurnVisible: false,
      isRollWaitDoubleVisible: false,
      isPay50Visible: false,
      isDicesVisible: false,
      isWinterVisible: false,
      isValariVisible: false,
      isBuyDeeds: undefined,
      builds: [],
      isGameOver: false,
      transferWith: undefined,
    };
    for (let i=0; i<maxCells; i++) {
      this.state.cellsOwners[i] = undefined;
      this.state.isPledged[i] = false;
      this.state.builds[i] = 0;
    }
  }
  showPlayers() {
    this.setState({playersVisible: true});
  }
  hidePlayers() {
    this.setState({playersVisible: false});
  }
  showInfo(i) {
    clearTimeout(this.timerId);
    if (game) {
      this.setState({infoVisible: i});
    }
  }
  hideInfo() {
    this.setState({infoVisible: undefined});
  }
  hideInfoTimer() {
    this.timerId = setTimeout(()=>{
      this.setState({infoVisible: undefined});
    }, 180);
  }
  nextPlayer() {
    this.setState({activePlayer: game.activePlayer});
    if (!game.players[game.activePlayer].isFree) {
      this.setWaitDoubleVisible(true);
      this.setPay50Visible(true);
    } else {
      this.setRollVisible(true);
    }
    // if (game.players[game.activePlayer].bankrupt()) {
    //   this.nextPlayer();
    // }
  }
  showDices() {
    this.setState({isDicesVisible: true});
  }
  hideDices() {
    this.setState({isDicesVisible: false});
  }
  bankrupt() {
    game.bankrupt();
    for (let i=0; i<game.cells.length; i++) {
      if ('owner' in game.cells[i] && game.cells[i].owner == undefined) {
        this.setState({isPledged: Object.assign(this.state.isPledged, {[i]: false})});
        this.setState({cellsOwners: Object.assign(this.state.cellsOwners, {[i]: undefined})});
        if ('hotels' in game.cells[i] && game.cells[i].owner == undefined) {
          this.showBuilds(i);
        }
      }
    }
    this.hideButtons();
    this.hideDices();
    this.nextPlayer();
    let numOfBankrupts = 0;
    for (let i=0; i<game.players.length; i++) {
      if (game.players[i].bankrupt) {
        numOfBankrupts++;
      }
    }
    if (numOfBankrupts + 1 == game.players.length) {
      this.hideButtons(); // todo:
      this.setState({isGameOver: true});
    }
    // this.forceUpdate();
  }
  setRollVisible(state) {
    this.setState({isRollVisible: state});
  }
  diceRoll() {
    this.closeTransfer();
    this.hideBuyDeeds();
    game.moveUnit();
    this.showDices();
    this.setState({
      dice1: game.dice.dice1,
      dice2: game.dice.dice2,
      diceCounter: game.dice.diceCounter
    });
    this.checkPosition();
  }
  setEndTurnVisible(state) {
    this.setState({isEndTurnVisible: state});
  }
  endTurn() {
    this.hideButtons();
    this.hideDices();
    game.endMove();
    this.nextPlayer();
  }
  setWaitDoubleVisible(state) {
    this.setState({isWaitDoubleVisible: state});
  }
  waitDouble() {
    this.closeTransfer();
    game.dice.roll();
    this.showDices();
    this.setState({
      dice1: game.dice.dice1,
      dice2: game.dice.dice2,
      diceCounter: game.dice.diceCounter
    });
    if (!game.dice.isDouble()) {
      this.hideButtons();
      this.setEndTurnVisible(true);
      game.players[game.activePlayer].attemptToDoubleInPrison++;
      if (game.players[game.activePlayer].attemptToDoubleInPrison == 3) {
        this.setEndTurnVisible(false);
        this.setPay50Visible(true);
      }
    } else {
      game.players[game.activePlayer].isFree = true;
      game.players[game.activePlayer].attemptToDoubleInPrison = 0;
      game.doublesInARow = 0;
      this.hideButtons();
      this.setRollVisible(true);
    }
  }
  setPay50Visible(state) {
    this.setState({isPay50Visible: state});
  }
  pay50() {
    this.closeTransfer();
    game.players[game.activePlayer].attemptToDoubleInPrison = 0;
    game.players[game.activePlayer].isFree = true;
    game.players[game.activePlayer].money -= 50;
    this.hideButtons();
    this.setRollVisible(true);
    // todo: there was a check for player's money
  }
  showBuyDeeds(i) {
    this.setState({isBuyDeeds: i});
  }
  hideBuyDeeds() {
    this.setState({isBuyDeeds: undefined});
  }
  buyDeeds() {
    this.closeTransfer();
    let n = game.activePlayer;
    let i = game.players[n].position;
    if (game.players[n].money >= game.cells[i].price) {
      game.buyDeed(i);
      this.setState({cellsOwners: Object.assign(this.state.cellsOwners, {[i]: n})});
      this.hideBuyDeeds();
    } else {
      alert ('not enough GD');
    }
  }
  hideButtons() {
    this.closeTransfer();
    this.setRollVisible(false);
    this.setEndTurnVisible(false);
    this.setWaitDoubleVisible(false);
    this.setPay50Visible(false);
    this.hideBuyDeeds();
  }
  showWinter() {
    this.closeTransfer();
    this.setState({isWinterVisible: true});
  }
  hideWinter() {
    this.setState({isWinterVisible: false});
  }
  winterAction() {
    this.closeTransfer();
    let player = game.players[game.activePlayer];
    game.takeCommunityCard();
    this.hideWinter();
    if (player.isFree && game.dice.isDouble()) {
      this.setRollVisible(true);
    } else {
      this.setEndTurnVisible(true);
    }
    if (player.position != 2 && player.position != 17 && player.position != 33) {
      this.checkPosition();
    }
    // todo: there was a check for player's money
  }
  showValari() {
    this.closeTransfer();
    this.setState({isValariVisible: true});
  }
  hideValari() {
    this.setState({isValariVisible: false});
  }
  valariAction() {
    this.closeTransfer();
    let player = game.players[game.activePlayer];
    game.takeChanceCard();
    this.hideValari();
    if (player.isFree && game.dice.isDouble()) {
      this.setRollVisible(true);
    } else {
      this.setEndTurnVisible(true);
    }
    if (player.position != 7 && player.position != 22 && player.position != 36) {
      this.checkPosition();
    }
    // todo: there was a check for player's money
  }
  checkPosition() {
    let player = game.players[game.activePlayer];
    if (!player.isFree) {
      this.hideButtons();
      this.setEndTurnVisible(true);
      return;
    }
    if (!game.dice.isDouble()) {
      this.setRollVisible(false);
      this.setEndTurnVisible(true);
    }
    if ('owner' in game.cells[player.position] && game.cells[player.position].owner == undefined) {
      let i = game.players[game.activePlayer].position;
      this.showBuyDeeds(i);
    }
    // Winter cards:
    if ([2, 17, 33].includes(player.position)) {
      this.showWinter();
      this.hideButtons();
    }
    // Valari cards:
    if ([7, 22, 36].includes(player.position)) {
      this.showValari();
      this.hideButtons();
      game.chanceCards[0].init(game);
    }
    // todo: there was a check for player's money
  }
  pledge(i) {
    this.closeTransfer();
    game.pledge(i);
    if (game.cells[i].isPledged) {
      this.setState({isPledged: Object.assign(this.state.isPledged, {[i]: true})});
      this.showInfo(i);
      // todo: there was a check for player's money
    }
  }
  unpledge(i) {
    this.closeTransfer();
    game.unPledge(i);
    this.setState({isPledged: Object.assign(this.state.isPledged, {[i]: false})});
    this.showInfo(i);
  }
  showBuilds(i) {
    if (game.cells[i].hotels == 1) {
      this.setState({builds: Object.assign(this.state.builds, {[i]: 5})});
    } else {
      let n = game.cells[i].houses;
      this.setState({builds: Object.assign(this.state.builds, {[i]: n})});
    }
  }
  build(i) {
    this.closeTransfer();
    game.build(i);
    this.showBuilds(i);
  }
  remove(i) {
    this.closeTransfer();
    game.remove(i);
    this.showBuilds(i);
    // todo: there was a check for player's money
  }
  closeTransfer() {
    this.setState({transferWith: undefined});
  }
  setTransferTo(index) {
    if (index != game.activePlayer && !game.players[index].bankrupt) {
      this.setState({transferWith: index});
    }
  }
  transfer(transferWith, moneyLeft, propertiesLeft, moneyRight, propertiesRight){
    game.moneyTransfer(game.activePlayer, transferWith, moneyLeft);
    game.moneyTransfer(transferWith, game.activePlayer, moneyRight);
    propertiesLeft.forEach(i=>game.propertyTransfer(game.activePlayer, transferWith, i));
    propertiesRight.forEach(i=>game.propertyTransfer(transferWith, game.activePlayer, i));
    this.closeTransfer();
  }
  render(){
    return(
      <div id="table">
        <div id="menu-left" className="menu">
          <Dices
            diceCounter={this.state.diceCounter}
            dice1={this.state.dice1}
            dice2={this.state.dice2}
            isDicesVisible={this.state.isDicesVisible}
          />
          {this.state.playersVisible && // todo: is game exists
            <Players
              setTransferTo={this.setTransferTo.bind(this)}
              nextPlayer={this.nextPlayer.bind(this)}
              activePlayer={this.state.activePlayer}
              isBankruptVisible={game && game.players[game.activePlayer].money<0}
              bankrupt={this.bankrupt.bind(this)}
              isRollVisible={this.state.isRollVisible}
              setRollVisible={this.setRollVisible.bind(this)}
              diceRoll={this.diceRoll.bind(this)}
              isEndTurnVisible={this.state.isEndTurnVisible}
              setEndTurnVisible={this.setEndTurnVisible.bind(this)}
              endTurn={this.endTurn.bind(this)}
              isWaitDoubleVisible={this.state.isWaitDoubleVisible}
              setWaitDoubleVisible={this.setWaitDoubleVisible.bind(this)}
              waitDouble={this.waitDouble.bind(this)}
              isPay50Visible={this.state.isPay50Visible}
              setPay50Visible={this.setPay50Visible.bind(this)}
              pay50={this.pay50.bind(this)}
              isGameOver={this.state.isGameOver}
            />}
          {game && <HotelsAndHouses hotels={game.hotels} houses={game.houses}/>}
        </div>
        <div id="map">
          <TopOfTheMap
            showInfo={this.showInfo.bind(this)}
            hideInfo={this.hideInfo.bind(this)}
            hideInfoTimer={this.hideInfoTimer.bind(this)}
            cellsOwners={this.state.cellsOwners}
            isPledged={this.state.isPledged}
            isBuilds={this.state.builds}
          />
          <div id="mid-of-the-map">
            <LeftOfTheMap
              showInfo={this.showInfo.bind(this)}
              hideInfo={this.hideInfo.bind(this)}
              hideInfoTimer={this.hideInfoTimer.bind(this)}
              cellsOwners={this.state.cellsOwners}
              isPledged={this.state.isPledged}
              isBuilds={this.state.builds}
            />
            <CentralSquare
              showInfoId={this.state.infoVisible}
              showInfo={this.showInfo.bind(this)}
              hideInfo={this.hideInfo.bind(this)}
              hideInfoTimer={this.hideInfoTimer.bind(this)}
              isBuyDeeds={this.state.isBuyDeeds}
              buyDeeds={this.buyDeeds.bind(this)}
              hideBuyDeeds={this.hideBuyDeeds.bind(this)}
              isWinterVisible={this.state.isWinterVisible}
              isValariVisible={this.state.isValariVisible}
              showWinter={this.showWinter.bind(this)}
              hideWinter={this.hideWinter.bind(this)}
              winterAction={this.winterAction.bind(this)}
              showValari={this.showValari.bind(this)}
              hideValari={this.hideValari.bind(this)}
              valariAction={this.valariAction.bind(this)}
              pledge={this.pledge.bind(this)}
              unpledge={this.unpledge.bind(this)}
              isBuilds={this.state.builds}
              build={this.build.bind(this)}
              remove={this.remove.bind(this)}
            />
            <RightOfTheMap
              showInfo={this.showInfo.bind(this)}
              hideInfo={this.hideInfo.bind(this)}
              hideInfoTimer={this.hideInfoTimer.bind(this)}
              cellsOwners={this.state.cellsOwners}
              isPledged={this.state.isPledged}
              isBuilds={this.state.builds}
            />
          </div>
          <BottomOfTheMap
            showInfo={this.showInfo.bind(this)}
            hideInfo={this.hideInfo.bind(this)}
            hideInfoTimer={this.hideInfoTimer.bind(this)}
            cellsOwners={this.state.cellsOwners}
            isPledged={this.state.isPledged}
            isBuilds={this.state.builds}
          />
        </div>
        <MenuRight
          showPlayers={this.showPlayers.bind(this)}
          hidePlayers={this.hidePlayers.bind(this)}
          nextPlayer={this.nextPlayer.bind(this)}
          activePlayer={this.state.activePlayer}
          setRollVisible={this.setRollVisible.bind(this)}
          closeTransfer={this.closeTransfer.bind(this)}
          transfer={this.transfer.bind(this)}
          transferWith={this.state.transferWith}
        />
      </div>
    );
  }
}

ReactDOM.render(<Table/>, document.getElementById("root"));
