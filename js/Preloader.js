
BasicGame.Preloader = function (game) {
	this.background = null;
	this.preloadBar = null;
	this.ready = false;
};
BasicGame.Preloader.prototype = {
	preload: function () {
	// These are the assets we loaded in Boot.js
	// A nice sparkly background and a loading progress bar
//		this.background = this.add.sprite(0, 0, 'preloaderBackground');
//		this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');
	// This sets the preloadBar sprite as a loader sprite.
	// What that does is automatically crop the sprite from 0 to full-width
	// as the files below are loaded in.
//		this.load.setPreloadSprite(this.preloadBar);


		this.load.tilemap('overworld', 'assets/tilemaps/maps/overworld.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('buildingInterior', 'assets/tilemaps/maps/overworld.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('happylandTiles', 'assets/tilemaps/tilesets/happyland/tileset_8.png');
		this.load.image('sovietTiles', 'assets/tilemaps/tilesets/PST/PostSovietTile.png');
		this.load.image('indoorRPGTiles', 'assets/tilemaps/tilesets/indoor_RPG_baseline/tilesetformattedupdate1.png');
		this.load.image('collisionTile', 'assets/tilemaps/tilesets/tiles/collision.png');
		this.load.spritesheet('player', 'assets/spritesheets/sara/sara 16x18 source.png', 16, 18);
	},
	create: function () {
	// Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
//		this.preloadBar.cropEnabled = false;
	},
	update: function () {
	// You don't actually need to do this, but I find it gives a much smoother game experience.
	// Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
	// You can jump right into the menu if you want and still play the music, but you'll have a few
	// seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
	// it's best to wait for it to decode here first, then carry on.
	// If you don't have any music in your game then put the game.state.start line into the create function and delete
	// the update function completely.
/*		if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		{
			this.ready = true;
			this.state.start('MainMenu');
		}*/
		this.state.start('MainMenu');
	}
};
