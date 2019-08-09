var roleUpgrader = {
  /** @param {Creep} creep **/
  run: function(creep) {
    //     var sources = creep.room.find(FIND_SOURCES);
    //     if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
    //         creep.moveTo(sources[0]);
    //     }

    if (
      (creep.carry.energy < creep.carryCapacity) &
      (Game.spawns["Spawn1"].energy > 200)
    ) {
      if (
        creep.withdraw(Game.spawns["Spawn1"], RESOURCE_ENERGY) ==
        ERR_NOT_IN_RANGE
      ) {
        creep.moveTo(Game.spawns["Spawn1"]);
      }
    } else {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
      }
    }
  }
};

module.exports = roleUpgrader;
