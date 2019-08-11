/* eslint-disable lodash/prefer-immutable-method */
/* eslint-disable lodash/prefer-lodash-method */
/*global module*/
const _ = require("lodash");

var roleHealer = require("role.healer");

/// <reference path="./Screeps-Typescript-Declarations/dist/screeps.d.ts"/>
("use strict");
// TODO Change all roles to job based functions
// TODO Have creeps fall through to miner if they must1
var roles = {
  builder: require("role.builder"),
  harvester: require("role.harvester"),
  upgrader: require("role.upgrader"),
  healer: require("role.healer"),
  hauler: require("role.hauler")
};

require("debug").populate(global);
require("prototype.room");

//import
require("prototype.creep");

module.exports.loop = function() {
  //TODO Debug verbosity levels
  //Variables
  var verbose = false;

  if (verbose) {
    console.log("Start game tick " + Game.time);
  }

  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      if (verbose) {
        console.log("Clearing non-existing creep memory:", name);
      }
    }
  }

  var harvesters = _.filter(Game.creeps, creep => creep.memory.role == "harvester");
  var builders = _.filter(Game.creeps, creep => creep.memory.role == "builder");
  var upgraders = _.filter(Game.creeps, creep => creep.memory.role == "upgrader");
  var healers = _.filter(Game.creeps, creep => creep.memory.role == "healer");
  var haulers = _.filter(Game.creeps, creep => creep.memory.role == "hauler");

  // console.log('Harvesters: ' + harvesters.length);
  if (verbose) {
    console.log(
      "Harvesters:" +
        harvesters.length +
        " Builders:" +
        builders.length +
        " upgraders:" +
        upgraders.length +
        " healers:" +
        healers.length +
        " haulers:" +
        haulers.length
    );
  }

  //Move 50
  //Work 100
  //Carry 50
  //Attack 80
  //Ranged attack 150
  //Heal 250
  //Claim 600
  //Tough 10

  //Check if we have a spawn, and get room name of spawn
  if (Game.spawns.Spawn1 == undefined) {
    console.log("No Spawn detected, exiting");
    return;
    //Oh Noes
  } else {
    var thisRoom = Game.spawns.Spawn1.room;
    if (verbose) {
      console.log("This room is " + thisRoom.name);
    }
  }
  if (verbose) {
    console.log(
      thisRoom.name +
        " Energy:" +
        thisRoom.energyAvailable +
        " of " +
        thisRoom.energyCapacityAvailable +
        "(" +
        Math.round((thisRoom.energyAvailable / thisRoom.energyCapacityAvailable) * 100) +
        "%)"
    );
  }

  // Get numbers
  var constructTargets = thisRoom.find(FIND_CONSTRUCTION_SITES);
  var healTargets = thisRoom.find(FIND_STRUCTURES, {
    filter: function(structure) {
      return structure.hits < structure.hitsMax;
    }
  });
  if (verbose) {
    console.log(
      "Construct sites:" + constructTargets.length + " and Decayed objects " + healTargets.length + " detected"
    );
  }

  // Calc optimal numbers
  var builderOptimal = Math.max(2, constructTargets % 2);

  //Create UI
  thisRoom.visual.text("Game tick " + Game.time + " | Room: " + thisRoom, 1, 1, { align: "left" });
  thisRoom.visual.text("Harvesters " + harvesters.length + " / 6", 1, 2, { align: "left" });
  thisRoom.visual.text("Haulers " + haulers.length + " / 2", 1, 3, { align: "left" });
  thisRoom.visual.text("Builders " + builders.length + " / " + builderOptimal, 1, 4, { align: "left" });
  thisRoom.visual.text("Upgraders " + upgraders.length + " / 2", 1, 5, { align: "left" });

  //Shall we spawn a creep?
  if (
    (!Game.spawns["Spawn1"].spawning && thisRoom.energyAvailable / thisRoom.energyCapacityAvailable > 0.7) ||
    harvesters.length < 6
  ) {
    //Check builders

    if (builders.length < 6 && (constructTargets.length || healTargets.length)) {
      var newName = "Builder" + Game.time;
      console.log("Spawning new builder: " + newName);
      Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
        memory: { role: "builder" }
      });
    }

    //Check upgraders
    if (upgraders.length < 2) {
      var newName = "Upgrader" + Game.time;
      console.log("Spawning new upgrader: " + newName);
      Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
        memory: { role: "upgrader" }
      });
    }

    //Check upgraders
    if (haulers.length < 2) {
      var newName = "Hauler" + Game.time;
      console.log("Spawning new hauler: " + newName);
      Game.spawns["Spawn1"].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE], newName, {
        memory: { role: "hauler" }
      });
    }

    //Check harvesters
    if (harvesters.length < 6) {
      var newName = "Harvester" + Game.time;

      for (var sourceId in thisRoom.sources) {
        // thisMiners = _.filter(Game.creeps, i => i.memory.source === sourceId);
        var thisMiners = _.filter(
          Game.creeps,
          creep => creep.memory.role == "harvester" && creep.memory.source == thisRoom.sources[sourceId].id
        );

        if (thisMiners.length < 3) {
          Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: "harvester", harvesting: true, source: thisRoom.sources[sourceId].id }
          });
        }
      }

      // for (var sourceIndex in thisRoom.find(FIND_SOURCES)) {
      //   thisMiners = _.filter(Game.creeps, i => i.memory.source === sourceIndex);
      //   console.log(sourceIndex + " " + thisMiners.length);
      //   if (thisMiners.length < 3) {
      //     Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
      //       memory: { role: "harvester", source: sourceIndex }
      //     });
      //   }
    }
    // TODO: what to do at max energy?
    //   // If at max spawn more upgraders
    //   if (thisRoom.energyAvailable == thisRoom.energyCapacityAvailable) {
    //     var newName = "Upgrader" + Game.time;
    //     console.log("Spawning new upgrader: " + newName);
    //     Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
    //       memory: { role: "upgrader" }
    //     });
    //   }
  }

  // UI for spawning
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
    if (creep.memory.role) {
      if (creep.memory.roletemp == undefined || creep.memory.roletemp == "") {
        roles[creep.memory.role].run(creep);
      } else {
        roles[creep.memory.roletemp].run(creep);
        console.log("Running temp role " + creep.name + " " + creep.memory.roletemp);
      }
    } else {
      console.log(creep + " has no role!");
    }
  }

  //Check tower should/can heal
  if (healTargets.length > 0 && thisRoom.towers[0].energy > thisRoom.towers[0].energyCapacity * 0.8) {
    thisRoom.towers[0].repair(Game.getObjectById(healTargets[0].id));
  }

  // pew pew
  if (!(thisRoom.hostileCreeps == undefined) && thisRoom.hostileCreeps.length > 0) {
    thisRoom.towers[0].attack(Game.getObjectById(thisRoom.hostileCreeps[0].id));
  }
};
