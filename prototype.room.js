/* eslint-disable lodash/prefer-lodash-method */
"use strict";

Object.defineProperty(Room.prototype, "sources", {
  get: function() {
    // If we dont have the value stored locally
    if (!this._sources) {
      // If we dont have the value stored in memory
      if (!this.memory.sourceIds) {
        // Find the sources and store their id's in memory,
        // NOT the full objects
        this.memory.sourceIds = this.find(FIND_SOURCES).map(source => source.id);
      }
      // Get the source objects from the id's in memory and store them locally
      this._sources = this.memory.sourceIds.map(id => Game.getObjectById(id));
    }
    // return the locally stored value
    return this._sources;
  },
  set: function(newValue) {
    // when storing in memory you will want to change the setter
    // to set the memory value as well as the local value
    this.memory.sources = newValue.map(source => source.id);
    this._sources = newValue;
  },
  enumerable: false,
  configurable: true
});

Object.defineProperty(Room.prototype, "containers", {
  // Single-tick cache extension list
  get: function() {
    if (!this._containers) {
      this._containers = this.find(FIND_STRUCTURES, {
        filter: structure => {
          return structure.structureType == STRUCTURE_CONTAINER;
        }
      });
    }

    return this._containers;
  }
});

Object.defineProperty(Room.prototype, "spawns", {
  // Single-tick cache extension list
  get: function() {
    if (!this._spawns) {
      this._spawns = this.find(FIND_STRUCTURES, {
        filter: structure => {
          return structure.structureType == STRUCTURE_SPAWN;
        }
      });
      //Check if anything present;
    }

    return this._spawns;
  }
});

Object.defineProperty(Room.prototype, "extensions", {
  // Single-tick cache extension list
  get: function() {
    if (!this._extensions) {
      this._extensions = this.find(FIND_STRUCTURES, {
        filter: structure => {
          return structure.structureType == STRUCTURE_EXTENSION;
        }
      });
      //Check if anything present;
    }

    return this._extensions;
  }
});
