
module.exports.killall = function (role) {

    for(var name in Game.creeps){
        var creep = Game.creeps[name];
        if(role==undefined) {
        creep.suicide();
        } else{
            if(creep.memory.role==role) {creep.suicide()}
        }
        console.log('Killing '+name);
    }
}

module.exports.creepnumbers = function () {

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var healers = _.filter(Game.creeps, (creep) => creep.memory.role == 'healer');

    console.log('Hrv: '+harvesters.length+' Bld: '+builders.length+' Upg: '+upgraders.length+' Hlr: '+healers.length)
    
}