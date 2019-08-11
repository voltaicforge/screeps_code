/*global module*/
var roleHealer = require("role.healer");

var roleBuilder = {
  /** @param {Creep} creep **/
  run: function(creep) {
    //Set creep job

    //TODO what to do when no spare energy
    if (creep.room.energy / creep.room.energyCapacity < 0.7) {
      return;
    }

    if (creep.room.constructionSites == false) {
      roleHealer.run(creep);
      return;
    }

    // If in drop-off and empty, return to source
    if (creep.isFull || creep.memory.target == undefined) {
      creep.memory.target = creep.pos.findClosestByPath(creep.room.constructionSites).id;
      creep.memory.action = "build";
      creep.memory.building = true;
      // console.log(creep.name + " build " + creep.memory.target);
    }

    if (creep.isEmpty || creep.memory.target == undefined) {
      // Find either a nearby container, else prioritize other containers.
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
      if (target == undefined) {
        target = creep.pos.findClosestByPath(creep.room.spawns);
      }
      if (target == undefined) {
        // console.log("ERROR: No target to return to for " + creep.name);
        return;
      }
      creep.memory.action = "withdraw";
      creep.memory.target = target.id;
      creep.memory.resourceType = RESOURCE_ENERGY;
      creep.memory.building = false;
      // console.log(creep.name + " withdraw from " + target.id + " using " + creep.memory.resourceType);
    }

    //check constructionSite still needs working on

    var result = creep.moveAndDo();
    if (result != OK) {
      console.log("ERROR", result, creep.name + "trying to", creep.memory.action, "at", creep.memory.target);
      delete creep.memory.target;
    }
  }
};

module.exports = roleBuilder;
