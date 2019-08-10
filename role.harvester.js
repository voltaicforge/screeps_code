var roleHarvester = {
  /** @param {Creep} creep **/
  run: function(creep) {
    // TODO: change source to id
    if (creep.carry.energy < creep.carryCapacity) {
      var sources = creep.room.find(FIND_SOURCES);
      if ((creep.memory.source == undefined, (creep.memory.source = _.random(1, sources.length))))
        if (creep.pos.isNearTo(sources[creep.memory.source])) {
          creep.harvest(sources[creep.memory.source]);
        } else {
          creep.moveTo(sources[creep.memory.source]);
        }
    } else {
      // Find either a nearby container, else prioritize other containers.
      var target = "";
      // Find close container
      var targets = creep.pos.findInRange(FIND_STRUCTURES, 2, {
        filter: function(structure) {
          return structure.structureType == STRUCTURE_CONTAINER;
        }
      });

      if (targets.length) {
        // Found container
        target = targets[0];
      } else {
        // Find other sources
        var targets = creep.room.find(FIND_STRUCTURES, {
          filter: structure => {
            return (
              ((structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_TOWER) &&
                structure.energy < structure.energyCapacity) ||
              (structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) < structure.storeCapacity)
            );
          }
        });

        if (targets.length > 0) {
          targets.sort(function(a, b) {
            if (a.structureType == STRUCTURE_SPAWN) {
              return -1;
            } else {
              if (a.structureType == STRUCTURE_CONTAINER) {
                return 1;
              } else {
                return 0;
              }
            }
          });
        }
        // TODO: change to location based
        if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0]);
        }
      }
    }

    // else if(Game.spawns['Spawn1'].energy < Game.spawns['Spawn1'].energyCapacity) {
    //     if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    //         creep.moveTo(Game.spawns['Spawn1']);
    //     }
    // }
  }
};

module.exports = roleHarvester;
