/*global module*/

var roleHauler = {
  /** @param {Creep} creep **/
  run: function(creep) {
    // if in drop-off and empty, swap to hauling and find new target
    if ((!creep.memory.hauling && creep.isEmpty) || creep.memory.target == undefined) {
      var target = creep.pos.findClosestByPath(creep.room.containers, {
        filter: structure => {
          return structure.store[RESOURCE_ENERGY] > 0;
        }
      });

      if (target == undefined) {
        target = creep.pos.findClosestByPath(creep.room.extensions, {
          filter: structure => {
            return structure.energy > 0;
          }
        });
      }

      creep.memory.target = target.id;
      creep.memory.action = "withdraw";
      creep.memory.resourceType = RESOURCE_ENERGY;
      creep.memory.hauling = true;
      console.log(creep.name + " transfer " + creep.memory.target);
    }

    if (creep.memory.hauling && creep.isFull) {
      // Find either a nearby extension, tower or spawn

      var target = creep.pos.findClosestByPath(creep.room.extensions, {
        filter: structure => {
          return structure.energy < structure.energyCapacity;
        }
      });

      if (target == undefined) {
        target = creep.pos.findClosestByPath(creep.room.towers, {
          filter: structure => {
            return structure.energy < structure.energyCapacity * 0.9;
          }
        });
      }
      if (target == undefined) {
        target = creep.pos.findClosestByPath(creep.room.spawns);
      }
      if (target == undefined) {
        console.log("ERROR: No target to drop off energy for " + creep.name);
        return;
      }
      creep.memory.action = "transfer";
      creep.memory.target = target.id;
      creep.memory.resourceType = RESOURCE_ENERGY;
      creep.memory.hauling = false;
      console.log(creep.name + " deposit energy to " + target.id + " using " + creep.memory.resourceType);
    }

    var result = creep.moveAndDo();
    if (result != OK) {
      console.log("TCL: result", result, creep.name, "doing", creep.memory.action);
      // Something went wrong, target probably at full.  Deleting the target forces a re-target.
      //TODO Flesh out error reasons
      //TODO Misses a tick while re-targeting

      delete creep.memory.target;
    }
  }
};

module.exports = roleHauler;
