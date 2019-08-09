/// <reference path="./Screeps-Typescript-Declarations/dist/screeps.d.ts"/>

var roles = {
  builder: require("role.builder"),
  harvester: require("role.harvester"),
  upgrader: require("role.upgrader"),
  healer: require("role.healer")
};
module.exports.loop = function() {
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("Clearing non-existing creep memory:", name);
    }
  }

  var harvesters = _.filter(
    Game.creeps,
    creep => creep.memory.role == "harvester"
  );
  var builders = _.filter(Game.creeps, creep => creep.memory.role == "builder");
  var upgraders = _.filter(
    Game.creeps,
    creep => creep.memory.role == "upgrader"
  );
  var healers = _.filter(Game.creeps, creep => creep.memory.role == "healer");
  // console.log('Harvesters: ' + harvesters.length);

  //Move 50
  //Work 100
  //Carry 50
  //Attack 80
  //Ranged attack 150
  //Heal 250
  //Claim 600
  //Tough 10

  var thisRoom = Game.spawns.Spawn1.room;

  var constructTargets = thisRoom.find(FIND_CONSTRUCTION_SITES);
  var healTargets = thisRoom.find(FIND_STRUCTURES, {
    filter: function(structure) {
      return structure.hits < structure.hitsMax;
    }
  });

  if (constructTargets.length && builders.length == 0) {
    for (var name in builders) {
      delete name.memory.roletemp;
    }
  }

  if (
    builders.length < 2 &&
    (constructTargets.length || healTargets) &&
    Game.spawns["Spawn1"].spawning == undefined &&
    thisRoom.energyAvailable > 200
  ) {
    var newName = "Builder" + Game.time;
    console.log("Spawning new builder: " + newName);
    Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: "builder" }
    });
  }

  if (
    upgraders.length < 2 &&
    Game.spawns["Spawn1"].spawning == undefined &&
    thisRoom.energyAvailable > 200
  ) {
    var newName = "Upgrader" + Game.time;
    console.log("Spawning new upgrader: " + newName);
    Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: "upgrader" }
    });
  }

  if (
    harvesters.length < 6 &&
    Game.spawns["Spawn1"].spawning == undefined &&
    thisRoom.energyAvailable > 200
  ) {
    var newName = "Harvester" + Game.time;
    console.log("Spawning new harvester: " + newName);
    Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: "harvester", source: _.random(0, 1) }
    });
  }

  if (Game.spawns["Spawn1"].spawning) {
    var spawningCreep = Game.creeps[Game.spawns["Spawn1"].spawning.name];
    Game.spawns["Spawn1"].room.visual.text(
      "🛠️" + spawningCreep.memory.role,
      Game.spawns["Spawn1"].pos.x + 1,
      Game.spawns["Spawn1"].pos.y,
      { align: "left", opacity: 0.8 }
    );
  }

  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (creep.memory.temprole == undefined) {
      roles[creep.memory.role].run(creep);
    } else {
      roles[creep.memory.roletemp].run(creep);
    }
  }
};
