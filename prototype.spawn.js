Spawn.prototype.createACreep = function() {
  /*
      This method will spawn pretty much anything you want. You have two options, exact or ratio
      
      Exact: An example of what's in the spawnQueue is my miner code, which in the beginning of a 
             new room builds up the body as the level allows:
      {
          exact: true,
          name: (unique name),
          body: {"work": 1, "carry": 1, "move": 1, "work": 4, "move": 2, "work": 1},
          memory: {role: 'miner', homeRoom: this.room.name, sourceId: opts.sourceId}
      }
      
      Ratio: This will take whatever ratio you give it and figure out the maximum amount your spawn                    
             can make.
             You can specify the maximum size of the creep or not.
             The body will create all the first body parts first, and then the next...like if you have 
             2 carrys and 1 moves in the ratio, it will create all the carrys first and then the moves 
      
          Example: Here is my refill cart spawnQueue code:
      {
          exact: false,
          maxBodyParts: 30,
          body: {"carry": 2, "move": 1},
          name: (unique name),
          memory: {role: 'refillCart', homeRoom: this.room.name, working: false}
      }   
  */

  //If we're spawning a creep or there is no creep to spawn, return early

  if (this.spawning || this.room.spawnQueue.length === 0) return;

  //We know the spawnQueue has at least 1 object, so we pull it
  let opts = this.room.spawnQueue[0];
  let body = [];
  let spawnResult;

  //Rooms can only spawn creeps with a max of 50, so this is our upper limit
  let maxBodyParts = 50;

  //Pull the maximum possible energy to be spent
  let maxEnergy = this.room.energyCapacityAvailable;

  //if the options for the creep are exact
  if (opts.exact) {
    //cycle through the body parts in options
    for (let bodyPart in opts.body) {
      //Need to break out of both for loops
      if (BODYPART_COST[bodyPart] > maxEnergy || maxBodyParts === 0) break;

      //cycle through the number of bodyparts for each body part
      for (let i = 0; i < opts.body[bodyPart]; i++) {
        //if the next body part costs too much or we've run into our 50 bodypart limit,
        //break
        if (BODYPART_COST[bodyPart] > maxEnergy || maxBodyParts === 0) {
          maxEnergy = 0;
          break;
        }

        //push this body part into the body array
        body.push(bodyPart);

        //decrement the maximum energy allowed for the next iteration
        maxEnergy -= BODYPART_COST[bodyPart];

        //decrement the 50 body part limit
        maxBodyParts--;
      }
    }
  }

  //if this is a ratio instead of exact
  else {
    //ratioCost will tell us how much each iteration of the ratio will cost
    let ratioCost = 0;
    for (let bodyPart in opts.body) {
      for (let i = 0; i < opts.body[bodyPart]; i++) {
        ratioCost += BODYPART_COST[bodyPart];
      }
    }

    //With our ratio cost, we now figure out the maximum amount of the ratio we can make. We
    //test three things, whether we run into the maximum energy for the room, the maximum
    //bodyparts allowed, or the specified bodypart limit we put into the options
    let maxUnits = Math.min(
      Math.floor(maxEnergy / ratioCost),
      Math.floor((opts.maxBodyParts || 50) / _.sum(opts.body)),
      Math.floor(maxBodyParts / _.sum(opts.body))
    );
    //Now we know how many of each bodypart we will make, we cycle through the order given to
    //create the body
    for (let bodyPart in opts.body) {
      for (let i = 0; i < maxUnits * opts.body[bodyPart]; i++) body.push(bodyPart);
    }
  }

  //attempt to spawn a creep with our passed memory and name options and our formed creep body
  spawnResult = this.spawnCreep(body, opts.name, { memory: opts.memory });

  //If we don't get an error code, pull the creep out of the spawnQueue so other spawns don't
  //spawn it as well
  // eslint-disable-next-line lodash/prefer-immutable-method
  if (!spawnResult) _.pullAt(this.room.spawnQueue, [0]);
};
