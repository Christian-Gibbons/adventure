


var cursors;
var jumpButton;

var player;
var playerDirection;
var playerStart;

var coins;

var levelID =1;
function initPlayer(game){
	playerStart = findObjectsByType('playerStart', map, 'Objects');
	player = game.add.sprite(playerStart[0].x + 8, playerStart[0].y+9, 'player');
	player.anchor.setTo(0.5,0.5);

	game.physics.arcade.enable(player);
	player.body.bounce.y = 0.0;
	player.body.gravity.y = 400;
	player.body.collideWorldBounds = true;
	player.body.height = 16;
	player.body.width = 16;
	player.body.maxVelocity.x = 200;

	//add animation here
	player.animations.add('walk_right', [9, 10, 11], 10, true);
	player.animations.add('walk_left', [27, 28, 29], 10, true);
	player.animations.add('walk_up', [0, 1, 2], 10, true);
	player.animations.add('walk_down', [18, 19, 20], 10, true);

	playerDirection = 'right';
}

function initCoins(game){
	coins = populateGroup('coin', game);
	coins.setAll('enableBody', true);
	coins.setAll('physicsBodyType', Phaser.Physics.ARCADE);
	coins.callAll('animations.add', 'animations', 'spin', [0,1,2,3,4,5], 10, true);
	coins.setAll('anchor.x', 0.5);
	coins.setAll('anchor.y', 0.5);
	coins.setAll('height', 10);
	coins.setAll('width', 9);
}

function killCoin(player, coin){
	coin.kill();
}
function updatePlatformer(game){
	game.physics.arcade.collide(player, collisionLayer);

	game.physics.arcade.overlap(player, death, killPlayer, null, game);
	game.physics.arcade.overlap(player, coins, killCoin, null, game);
	coins.callAll('play', null, 'spin');

	var drag = new Phaser.Point(1000,0);
	player.body.acceleration.y = 0;
	player.body.acceleration.x = 0;
	if (cursors.left.isDown)
	{
		//  Move to the left
		playerDirection = 'left';
		if(player.body.velocity.x > 0){
			player.body.acceleration.x = -400;
		}
		else{
			player.body.acceleration.x = -200;
		}
		player.animations.play('walk_left');

	}
	else if (cursors.right.isDown)
	{
		//  Move to the right
		if(player.body.velocity.x < 0){
			player.body.acceleration.x = 400;
		}
		else{
			player.body.acceleration.x = 200;
		}
		playerDirection = 'right';
		player.animations.play('walk_right');
	}
	else{
		 if(player.body.onFloor()){
			player.body.drag.x = 300;
		}
		else{
			player.body.drag.x = 150;
		}
	}
	if(player.body.velocity.x ===0){
		player.animations.stop();
		player.frame = 27;
		if(playerDirection === 'right'){
			player.frame = 9;
		}
	}

	// Allow player to jump if they are touching the ground.
	if (jumpButton.isDown)
	{
 		if(player.body.onFloor()){
			player.body.velocity.y = -300;
		}
//		player.body.drag.y = 0;	
	}
	else if(player.body.velocity.y < 0){
		player.body.acceleration.y = 200;
	}
}

function setAdvancedCollision(collision){
	collision.layer.data.forEach(function(i){
		i.forEach(function(entry){
			entry.setCollision(entry.properties.collideLeft==='true', entry.properties.collideRight==='true', entry.properties.collideUp==='true', entry.properties.collideDown==='true');
		});
	});
}

function findObjectsByType(type, map, layer) {
	var result = new Array();
	map.objects[layer].forEach(function(element){
		if(element.properties.type === type){
			element.y -= map.tileHeight;
			result.push(element);
		}
	});
	return result;
}

function createFromTiledObject(element, group){
	var sprite = group.create(element.x, element.y, element.properties.sprite);
	Object.keys(element.properties).forEach(function(key){
		sprite[key] = element.properties[key];
	});
	sprite.height = element.height;
	sprite.width = element.width;
}

	/* 
	 * type is a string that contains the properties.type to be searched for, state should receive "this"
	 * Function returns the newly populated group.
	 */
function populateGroup(type, state){
	var thisGroup = state.add.group();
	thisGroup.enableBody = true;

	var result = findObjectsByType(type, map, 'Objects');
	result.forEach(function(element){
		createFromTiledObject(element, thisGroup);
	}, this);
	return thisGroup;
}

function killPlayer(player, death){
	console.log("dead");
	player.kill();
	map.destroy();
	this.state.start('MainMenu');
}
