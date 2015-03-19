
BasicGame.Level2 = function (game) {
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

	var death;
BasicGame.Level2.prototype = {
	create: function () {
		this.stage.backgroundColor = '#8000F0';
		map = this.add.tilemap('map2');
		map.addTilesetImage('scraps_bricks', 'bricks');

		fringeLayer = map.createLayer('Fringe');
		collisionLayer = map.createLayer('Collision');
		collisionLayer.visible = false;

		this.physics.arcade.enable(collisionLayer);
		setAdvancedCollision(collisionLayer);

//		backgroundLayer.resizeWorld();
		fringeLayer.resizeWorld();

		death = populateGroup('death', this);
		initCoins(this);
		initPlayer(this);

		cursors = this.input.keyboard.createCursorKeys();
		jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		this.camera.follow(player);
		this.camera.deadzone = new Phaser.Rectangle(100,100,250,400);

	},
	update: function () {
		// Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
		updatePlatformer(this);
		if(coins.total === 0){
			var leprechaun = this.add.sprite(player.x, player.y, 'leprechaun');
			leprechaun.anchor.x=player.anchor.x;
			leprechaun.anchor.y=player.anchor.y;
			player.kill();
		//	this.state.start('');
		}
	},
	quitGame: function (pointer) {
		// Here you should destroy anything you no longer need.
		// Stop music, delete sprites, purge caches, free resources, all that good stuff.
		// Then let's go back to the main menu.
	this.state.start('MainMenu');
	}
};
