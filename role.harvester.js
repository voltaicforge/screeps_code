/*global module*/

var roleHarvester = {
  /** @param {Creep} creep **/
  run: function(creep) {
    // If in dropoff and empty, return to source
    if ((!creep.memory.harvesting && creep.isEmpty) || creep.memory.target == undefined) {
      creep.memory.target = creep.memory.source;
      creep.memory.action = "harvest";
      creep.memory.harvesting = true;
      console.log(creep.name + " harvest " + creep.memory.target);
    }

    if (creep.memory.harvesting && creep.isFull) {
      // Find either a nearby container, else prioritize other containers.
      if (target == undefined) {
        var target = creep.pos.findClosestByPath(creep.room.containers, {
          filter: function(structure) {
            if (structure.structureType == STRUCTURE_STORAGE && _.sum(structure.store) < structure.storeCapacity) {
              return true;
            }
            return false;
          }
        });
      }
      if (target == undefined) {
        target = creep.pos.findClosestByPath(creep.room.extensions, {
          filter: function(structure) {
            if (structure.structureType == STRUCTURE_STORAGE && _.sum(structure.store) < structure.storeCapacity) {
              return true;
            }
            return false;
          }
        });
      }
      if (target == undefined) {
        target = creep.pos.findClosestByPath(creep.room.towers, {
          filter: function(structure) {
            if (structure.structureType == STRUCTURE_STORAGE && _.sum(structure.store) < structure.storeCapacity) {
              return true;
            }
            return false;
          }
        });
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
