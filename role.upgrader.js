/* eslint-disable lodash/prefer-lodash-method */
/*global module*/

var roleUpgrader = {
  /** @param {Creep} creep **/
  run: function(creep) {
    //     var sources = creep.room.find(FIND_SOURCES);
    //     if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
    //         creep.moveTo(sources[0]);
    //     }
    if (creep.memory.upgrading && creep.carry.energy == 0) {
      creep.memory.upgrading = false;
      creep.say("🔄 recharge");
    }
    if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
      creep.memory.upgrading = true;
      creep.say("🚧 upgrade");
    }
    if (creep.memory.upgrading == undefined) {
      creep.memory.upgrading = false;
    }

    if (creep.memory.upgrading) {
      //Upgrade
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
      }
    } else {
      //Recharge
      if (creep.room.energyAvailable / creep.room.energyCapacityAvailable < 0.7) {
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

module.exports = roleUpgrader;
