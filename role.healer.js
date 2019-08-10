/* eslint-disable lodash/prefer-lodash-method */
"use strict";

var roleHealer = {
  /** @param {Creep} creep **/
  run: function(creep) {
    if (creep.memory.healing && creep.carry.energy == 0) {
      creep.memory.healing = false;
      creep.say("🔄 recharge");
    }
    if (!creep.memory.healing && creep.carry.energy == creep.carryCapacity) {
      creep.memory.healing = true;
      creep.say("🚧 heal");
    }
    if (creep.memory.healing == undefined) {
      creep.memory.healing = false;
    }

    if (creep.memory.healing) {
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: function(structure) {
          return structure.hits < structure.hitsMax;
        }
      });
      if (targets.length) {
        target = creep.pos.findClosestByRange(targets);
        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        } else {
          //TODO Add drop-through role
          //creep.memory.roletemp = "upgrader";
        }
      }
    } else {
      //Recharge
      if (creep.room.energyAvailable / creep.room.energyCapacityAvailable < 0.7) {
        // TODO add waiting state
        //creep.memory.roletemp = "harvester";

        return;
      }
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: structure => {
          return (
            (structure.structureType == STRUCTURE_EXTENSION && structure.energy == structure.energyCapacity) ||
            (structure.structureType == STRUCTURE_SPAWN && structure.energy > 250) ||
            (structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) > 0)
          );
        }
      });
      if (targets.length > 0) {
        targets.sort(function(a, b) {
          if (a.structureType == STRUCTURE_SPAWN) {
            return 1;
          } else {
            if (a.structureType == STRUCTURE_CONTAINER || a.structureType == STRUCTURE_EXTENSION) {
              return -1;
            } else {
              return 0;
            }
          }
        });

        if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0]);
        }
      }
    }
  }
};

module.exports = roleHealer;
