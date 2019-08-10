"use strict";

/**
 * Determine if creep is full
 * @returns {boolean}
 */
Object.defineProperty(Creep.prototype, "isFull", {
  get: function() {
    if (!this._isFull) {
      this._isFull = _.sum(this.carry) === this.carryCapacity;
    }
    return this._isFull;
  },
  enumerable: false,
  configurable: true
});

/**
 * Determine if creep is empty
 * @returns {boolean}
 */
Object.defineProperty(Creep.prototype, "isEmpty", {
  get: function() {
    if (!this._isEmpty) {
      this._isEmpty = _.sum(this.carry) == 0;
    }
    return this._isEmpty;
  },
  enumerable: false,
  configurable: true
});

/**
 * Move toward the creeps target and execute its action
 * @returns {boolean}
 */
Creep.prototype.moveAndDo = function() {
  // Move to targeted location and execute action
  // Input:
  // creep.memory.target = target ID to move to
  // creep.memory.action = action to perform on target ID

  //TODO: change ranges based on target action

  if (this.memory.target == undefined) {
    console.log("ERROR: " + this.name + " has a invalid target:" + this.target);
  }
  if (this.pos.isNearTo(Game.getObjectById(this.memory.target))) {
    return this[this.memory.action](Game.getObjectById(this.memory.target), this.memory.resourceType);
  } else {
    return this.moveTo(Game.getObjectById(this.memory.target));
  }
};
