/*global module*/

var roleHarvester = {
  /** @param {Creep} creep **/
  run: function(creep) {
    // If in dropoff and empty, return to source
    if ((!creep.memory.harvesting && creep.isEmpty) || creep.memory.target == undefined) {
      creep.memory.target = creep.memory.source;
      creep.memory.action = "harvest";
      creep.memory.harvesting = true;
    }

    if (creep.memory.harvesting && creep.isFull) {
      var target;
      // Find either a nearby container, else prioritize other containers.
      if (target == undefined) {
        target = creep.pos.findClosestByPath(creep.room.containers, {
          filter: structure => {
            return structure.store[RESOURCE_ENERGY] < 2000;
          }
        });
      }
      if (target == undefined) {
        target = creep.pos.findClosestByPath(creep.room.extensions, {
          filter: function(structure) {
            if (structure.energy < structure.energyCapacity) {
              return true;
            }
            return false;
          }
        });
      }
      if (target == undefined) {
        target = creep.pos.findClosestByPath(creep.room.towers, {
          filter: function(structure) {
            if (structure.energy < structure.energyCapacity) {
              return true;
            }
            return false;
          }
        });
      }
      if (target == undefined) {
        if (_.sum(creep.room.storage.store) < creep.room.storage.storeCapacity) {
          target = creep.room.storage;
        }
      }
      if (target == undefined) {
        target = creep.pos.findClosestByPath(creep.room.spawns);
      }
      if (target == undefined) {
        return;
      }
      creep.memory.action = "transfer";
      creep.memory.target = target.id;
      creep.memory.resourceType = RESOURCE_ENERGY;
      creep.memory.harvesting = false;
    }

    var result = creep.moveAndDo();
    if (result != OK) {
      //TODO this works but misses a full round - dynamic re-target?
      delete creep.memory.target;
    }
  }
};

module.exports = roleHarvester;
