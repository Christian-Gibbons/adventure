
BasicGame.Game = function (game) {
/*
	// When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:
	this.game; // a reference to the currently running game (Phaser.Game)
	this.add; // used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
	this.camera; // a reference to the game camera (Phaser.Camera)
	this.cache; // the game cache (Phaser.Cache)
	this.input; // the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
	this.load; // for preloading assets (Phaser.Loader)
	this.math; // lots of useful common math operations (Phaser.Math)
	this.sound; // the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
	this.stage; // the game stage (Phaser.Stage)
	this.time; // the clock (Phaser.Time)
	this.tweens; // the tween manager (Phaser.TweenManager)
	this.state; // the state manager (Phaser.StateManager)
	this.world; // the game world (Phaser.World)
	this.particles; // the particle manager (Phaser.Particles)
	this.physics; // the physics manager (Phaser.Physics)
	this.rnd; // the repeatable random number generator (Phaser.RandomDataGenerator)
	// You can use any of these from any function within this State.
	// But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
*/
};

	var map;
	var backgroundLayer;
	var fringeLayer;
	var collisionLayer;

	var items;
	var doors;
	var door;
	var destination = {};

	var testCircle;

BasicGame.Game.prototype = {
	create: function () {
		map = this.add.tilemap('overworld');

		map.addTilesetImage('tileset_8', 'happylandTiles');
		map.addTilesetImage('PostSovietTile', 'sovietTiles');
		map.addTilesetImage('collision', 'collisionTile');

		backgroundLayer = map.createLayer('Background');
		fringeLayer = map.createLayer('Fringe');
		collisionLayer = map.createLayer('Collision');
		collisionLayer.visible = false;
		collisionLayer.renderable = false;

		this.physics.arcade.enable(collisionLayer);
		map.setCollisionByExclusion([],true,collisionLayer);
		backgroundLayer.resizeWorld();

//		createDoors();

		doors = populateGroup('door', this);
		playerStart = findObjectsByType('playerStart', map, 'Objects');
		player = this.add.sprite(playerStart[0].x, playerStart[0].y, 'player');
		player.anchor.setTo(0.5,0.5);

		this.physics.arcade.enable(player);
		player.body.bounce.y = 0.0;
		player.body.gravity.y = 0;
		player.body.collideWorldBounds = true;

		player.body.height = 16;
		player.body.width = 16;

		player.obstacleDetector = {};
		player.obstacleDetector.ray = [];


		player.animations.add('walk_right', [9, 10, 11], 10, true);
		player.animations.add('walk_left', [27, 28, 29], 10, true);
		player.animations.add('walk_up', [0, 1, 2], 10, true);
		player.animations.add('walk_down', [18, 19, 20], 10, true);

		playerDirection = 'down';
		cursors = this.input.keyboard.createCursorKeys();

		this.camera.follow(player);
		this.camera.deadzone = new Phaser.Rectangle(100,100,250,400);

		destination.abs = {};
		destination.cart = {};
		destination.cart.x = 0;
		destination.cart.y = 0;
		destination.pol = {};
	},
	update: function () {
		// Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
		this.physics.arcade.collide(player, collisionLayer);

		this.physics.arcade.collide(player.obstacleDetector, collisionLayer, obstacleDetected, null, this);

		this.physics.arcade.overlap(player, doors, enterDoor, null, this);
		var walkSpeed = 75;

		if(this.input.mouse.button === LEFT_BUTTON){
			destination.abs.x = this.input.mousePointer.x + this.camera.x;
			destination.abs.y = this.input.mousePointer.y + this.camera.y;
		}

		var U = [{}];
		var F = {};
		U[0] = getPotential({x:player.body.x+7,y:player.body.y+9},destination.abs);
		U[1] = getPotential({x:player.body.x+8,y:player.body.y+9},destination.abs);
		U[2] = getPotential({x:player.body.x+7,y:player.body.y+10},destination.abs);

		F.x = U[1].x-U[0].x;
		F.y = U[2].y-U[0].y;
		player.body.acceleration.x = -F.x;
		player.body.acceleration.y = F.y;

	},

	quitGame: function (pointer) {
		// Here you should destroy anything you no longer need.
		// Stop music, delete sprites, purge caches, free resources, all that good stuff.
		// Then let's go back to the main menu.
	this.state.start('MainMenu');
	}
};
function enterDoor(player, door){
//	this.state.start(door.targetMap);
}

function obstacleDetected(obstacleDetector, obstacle){
	console.log("overlap detected");
}
/*
function getPolarDifference(object1, object2){
	var displacement = getCartesianDifference(polarToCartesian(object1),polarToCartesian(object2));
	var ret = {};
	ret.displacement = Math.sqrt((displacement.x*displacement.x)+(displacement.y*displacement.y));
	ret.angle = Math.atan2((displacement.y),(displacement.x));
	return ret;
}*/
function getCartesianDifference(object1, object2){
	var displacement = {};
	displacement.x = object2.x - object1.x;
	displacement.y = object2.y - object1.y;
	return displacement;
}
function polarToCartesian(object){
	var cartesian = {};
	cartesian.x = object.displacement*Math.cos(object.angle);
	cartesian.y = object.displacement*Math.sin(object.angle);
	return cartesian;
}
function cartesianToPolar(object){
	var polar = {};
	var temp = object.x*object.x + object.y*object.y;
	polar.displacement = Math.sqrt(object.x*object.x + object.y*object.y);
	polar.angle = Math.atan2((object.y),(object.x));
//	polar.angle = Math.atan2((object.x),(object.y));
	return polar;
}
function getPotential(start,end){//add 7,9
	var obstacleDetector = {};
	var ray = [];
	var F = {};
	var U = {};
	var temp = {};
	temp.cart = {};
	temp.pol = {}
	U.goal = {}; //Potential Goal
	U.goal.pol = {};
	U.goal.cart = {};
	U.obst = {};  //Potential Obstacles
	U.obst.pol = {};
	U.obst.cart = {};
	U.tot = {}; //Potential Total

	obstacleDetector.x = start.x;
	obstacleDetector.y = start.y;
	obstacleDetector.ray = [];
	var obstacles = [];
	for(var i = 0; i<8; i++){
		obstacleDetector.ray[i] = new Phaser.Line(obstacleDetector.x, obstacleDetector.y, obstacleDetector.x + 36*Math.cos(Math.PI*i/4), obstacleDetector.y + 36*Math.sin(Math.PI*i/4));
	obstacles = obstacles.concat(collisionLayer.getRayCastTiles(obstacleDetector.ray[i], 12, true, true));
	}
	temp.cart = getCartesianDifference(start,end);
	temp.pol = cartesianToPolar(temp.cart);
	U.goal.pol.displacement = temp.pol.displacement*temp.pol.displacement; //potential goal = displacement^2
	U.goal.pol.angle = temp.pol.angle;
	
	U.obst.cart.x = 0;
	U.obst.cart.y = 0;
	obstacles.forEach(function(obstacle){
		var temp = getCartesianDifference(start,obstacle);
		U.obst.cart.x += 1/temp.x;
		U.obst.cart.y += 1/temp.y;
	});
	U.goal.cart = polarToCartesian(U.goal.pol);
	U.tot.x = U.goal.cart.x - U.obst.cart.x*1000000;
	U.tot.y = U.goal.cart.y - U.obst.cart.y*1000000;
//	U.tot.x = U.goal.cart.x;
//	U.tot.y = U.goal.cart.y;
	return U.tot;
}
