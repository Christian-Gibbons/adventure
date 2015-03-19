var BasicGame = {};
BasicGame.Boot = function (game) {
};
BasicGame.Boot.prototype = {
	init: function () {
	},
	preload: function () {
		// Here we load the assets required for our preloader (in this case a background and a loading bar)
//		this.load.image('preloaderBackground', 'images/preloader_background.jpg');
//		this.load.image('preloaderBar', 'images/preloadr_bar.png');
	},
	create: function () {
		// By this point the preloader assets have loaded to the cache, we've set the game settings
		// So now let's start the real preloader going
		this.state.start('Preloader');
	}
};
