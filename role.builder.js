/*global module*/

var roleBuilder = {
  /** @param {Creep} creep **/
  run: function(creep) {
    //Set creep job

    if (creep.room.constructionSites == undefined) {
      return;
    }

    // If in drop-off and empty, return to source
    if ((!creep.memory.building && creep.isFull) || creep.memory.target == undefined) {
      creep.memory.target = creep.room.constructionSites[0].id;
      creep.memory.action = "build";
      creep.memory.building = true;
      console.log(creep.name + " build " + creep.memory.target);
    }

    if (creep.memory.building && creep.isEmpty) {
      // Find either a nearby container, else prioritize other containers.
      var target = creep.pos.findClosestByPath(creep.room.containers);
      if (target == undefined) {
        target = creep.pos.findClosestByPath(creep.room.extensions);
      }
      if (target == undefined) {
        target = creep.pos.findClosestByPath(creep.room.spawns);
      }
      if (target == undefined) {
        console.log("ERROR: No target to return to for " + creep.name);
        return;
      }
      creep.memory.action = "withdraw";
      creep.memory.target = target.id;
      creep.memory.resourceType = RESOURCE_ENERGY;
      creep.memory.building = false;
      console.log(creep.name + " withdraw from " + target.id + " using " + creep.memory.resourceType);
    }

    creep.moveAndDo();
  }
};

module.exports = roleBuilder;
