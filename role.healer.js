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
          creep.memory.roletemp = "upgrader";
        }
      }
    } else {
      if (
        creep.room.energyAvailable > 300 &&
        creep.withdraw(Game.spawns["Spawn1"], RESOURCE_ENERGY) ==
          ERR_NOT_IN_RANGE
      ) {
        creep.moveTo(Game.spawns["Spawn1"], {
          visualizePathStyle: { stroke: "#ffaa00" }
        });
      }
    }
  }
};

module.exports = roleHealer;
