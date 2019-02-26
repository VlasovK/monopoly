
class DefinedDice {
  constructor(sequence) {
  this.pos = 0;
  this.sequence = sequence;
  }

  roll() {
    this.dice1 = this.sequence[this.pos++];
    this.dice2 = this.sequence[this.pos++];
    return this.dice1 + this.dice2;
  };

  isDouble() {
    return this.dice1 == this.dice2;
  };
}

exports.DefinedDice = DefinedDice;
