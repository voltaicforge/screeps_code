"use strict";

var roleHarvester = {
  /** @param {Creep} creep **/
  run: function(creep) {
    // If in dropoff and empty, retun to source
    if ((!creep.memory.harvesting && creep.isEmpty) || creep.memory.target == undefined) {
      creep.memory.target = creep.memory.source;
      creep.memory.action = "harvest";
      creep.memory.harvesting = true;
      console.log(creep.name + " harvest " + creep.memory.target);
    }

    if (creep.memory.harvesting && creep.isFull) {
      // Find either a nearby container, else prioritize other containers.
      var target = creep.pos.findClosestByPath(creep.room.containers);
      if (target == undefined) {
        target = creep.pos.findClosestByPath(creep.room.extensions);
      }
      if (target == undefined) {
        target = creep.pos.findClosestByPath(creep.room.spawns);
      }
      if (target == undefined) {
        console.log("ERROR: No target to return to for " + creep.name);
        return;
      }
      creep.memory.action = "transfer";
      creep.memory.target = target.id;
      creep.memory.resourceType = RESOURCE_ENERGY;
      creep.memory.harvesting = false;
      console.log(creep.name + " return to " + target.id + " using " + creep.memory.resourceType);
    }

    creep.moveAndDo();
  }
};

module.exports = roleHarvester;
