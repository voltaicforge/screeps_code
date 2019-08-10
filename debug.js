/**
 * Debug functions for screeps.com console
 *
 * ## How to use?
 *
 * In main.js:
 * require('debug').populate(global);
 *
 * In screeps.com console:
 *     o(name_of_your_creep | spawn_name | room_name | flag_name | id_of_some_object | role_of_creep)
 *
 * gives you the object which represents creep | spawn | structure | room | flag | object | creeps with that value of memory.role.
 *
 *     s(what)
 *
 * gives you json representation of o(what) || what.
 *
 *     m(what)
 *
 * gives you json representation of specified objects memory
 *
 * ## Usage sample:
 *
 *     o('creep_john').memory.role = 'harvester';
 *
 *     o('creep_john').transferEnergy(o('5606b62e2d246b9e31100fb1'))
 */
function pretty(k, v) {
  if (k == "body") return _.map(v, "type").join(",");
  if (v && v.x != undefined && v.y != undefined && v.roomName != undefined)
    return v === undefined ? "undefined" : v.toString();
  return v;
}
function o(what) {
  if (what == "") return _.values(Game.creeps)[0];
  return (
    Game.getObjectById(what) ||
    Game.creeps[what] ||
    Game.spawns[what] ||
    Game.flags[what] ||
    Game.rooms[what] ||
    _.filter(Game.creeps, function(c) {
      return c.memory.role == what;
    })
  );
}
function s(what) {
  var object = typeof what == "string" ? o(what) : what;
  if (object === undefined) return "null";
  return JSON.stringify(object, pretty, " ");
}
function m(what, index) {
  var obj = o(what);
  if (_.isArray(obj)) obj = obj[index || 0];
  return s(obj["memory"]);
}

function killall(role) {
  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (role == undefined) {
      creep.suicide();
    } else {
      if (creep.memory.role == role || creep.memory.role == "" || creep.memory.role == undefined) {
        creep.suicide();
        console.log("Killing " + name);
      }
    }
  }
}

function numcreeps() {
  var harvesters = _.filter(Game.creeps, creep => creep.memory.role == "harvester");
  var builders = _.filter(Game.creeps, creep => creep.memory.role == "builder");
  var upgraders = _.filter(Game.creeps, creep => creep.memory.role == "upgrader");
  var healers = _.filter(Game.creeps, creep => creep.memory.role == "healer");

  console.log(
    "Hrv: " + harvesters.length + " Bld: " + builders.length + " Upg: " + upgraders.length + " Hlr: " + healers.length
  );
}

function populate(g) {
  g.o = o;
  g.s = s;
  g.m = m;
  g.killall = killall;
  g.numcreeps = numcreeps;
}

exports.populate = populate;
