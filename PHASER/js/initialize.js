

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload () {

    game.load.audio('funkaoneuvosor', 'assets/funkao.mp3');
    game.load.image('logo', 'assets/logo.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('laser', 'assets/laser.png');
    game.load.image('fundo', 'assets/bacg.png');
    game.load.image('life', 'assets/life.png');
    game.load.image('firstaid', 'assets/firstaid.png');
    game.load.image('tati', 'assets/tatizaqui.png');
    game.load.spritesheet('star', 'assets/star.png', 13, 22, 4);
    game.load.spritesheet('zeruela', 'assets/tanque.png', 70, 52, 2);
    game.load.spritesheet('kaboom', 'assets/explosion.png', 100, 100, 6);
    game.load.spritesheet('energybar', 'assets/energy.png', 150, 30, 3);
    game.load.spritesheet('torret', 'assets/torret.png', 39, 16, 2);
    game.load.spritesheet('torretbase', 'assets/torretbase.png', 36, 46, 6);
    game.load.spritesheet('corpo', 'assets/CORPO.png', 60, 36, 3);
    game.load.spritesheet('pernas', 'assets/PERNAS.png', 60, 36, 5);
    game.load.spritesheet('torneira', 'assets/torneiras.png', 64, 64, 2);
    game.load.spritesheet('pickups', 'assets/pickups.png', 34, 25, 8);

}
var funkao;

var land;

var arma = 0;

var shadow;
var tank;
var turret;

var enemies;
var enemyBullets;
var enemiesTotal = 0;
var enemiesAlive = 0;
var explosions;

var pickupok = [];
var logo;
var stars;
var score = 0;
var energy = 0;
var life = 20;
var torreta;
var tati;

var move = 0;

var currentSpeed = 0;
var cursors;

var bullets;
var fireRate = 200;
var nextFire = 0;

function create () {

  funkao = game.add.audio('funkaoneuvosor');
  upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
  downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
  leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
  rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
  space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  explo = game.input.keyboard.addKey(Phaser.Keyboard.E);

pickupok[0] = 0;
pickupok[1] = 0;
pickupok[2] = 0;
pickupok[3] = 0;

sounds = [ funkao ];

game.sound.setDecodedCallback(sounds, start, this);

    //  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(-1000, -1000, 2000, 2000);


    fundo = game.add.sprite(-1000, -1000, 'fundo');

    //  The base of our tank
    tank = game.add.sprite(40, 30, 'pernas', 1);
    tank.anchor.setTo(0.40, 0.43);


    //  This will force it to decelerate and limit its speed
    game.physics.enable(tank, Phaser.Physics.ARCADE);
    tank.body.drag.set(0.2);
    tank.body.maxVelocity.setTo(400, 400);
    tank.body.collideWorldBounds = true;


    //  We will enable physics for any star that is created in this group
    tank.enableBody = true;

    //  Finally the turret that we place on-top of the tank body
    turret = game.add.sprite(60, 36, 'corpo', 0);
    turret.anchor.setTo(0.45, 0.45);

    walk = turret.animations.add('walk', [1,2], 10, true);
    walke = tank.animations.add('walk', [1,2,3,4], 5, true);




    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet', 0, false);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    createEnemies();

    //  Explosion pool
    explosions = game.add.group();

    for (var i = 0; i < 10; i++)
    {
        var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
        explosionAnimation.anchor.setTo(0.5, 0.5);
        explosionAnimation.animations.add('kaboom');
    }

    tank.bringToTop();
    turret.bringToTop();


    logo = game.add.sprite(0, 0, 'logo');
    logo.fixedToCamera = true;
    game.time.events.add(Phaser.Timer.SECOND * 1, fadePicture, this);

    //game.input.onDown.add(removeLogo, this);

    game.camera.follow(tank);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);

    cursors = game.input.keyboard.createCursorKeys();

    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    pickups = game.add.group();
    pickups.enableBody = true;


    if (pickupok[0] == 1){
      var pickup = pickups.create(-120, 150, 'pickups',0);
    } else {
      var pickup = pickups.create(-120, 150, 'pickups',4);
    }
      pickup.body.immovable = true;

  if (pickupok[1] == 1){
    var pickup = pickups.create(175, 155, 'pickups',1);
  } else {
    var pickup = pickups.create(175, 155, 'pickups',5);
  }
    pickup.body.immovable = true;

  if (pickupok[2] == 1){
    var pickup = pickups.create(175, -131, 'pickups',2);
  } else {
    var pickup = pickups.create(175, -131, 'pickups',6);
  }
    pickup.body.immovable = true;

  if (pickupok[3] == 1){
    var pickup = pickups.create(-120, -128, 'pickups',3);
  } else {
    var pickup = pickups.create(-120, -128, 'pickups',7);
  }
    pickup.body.immovable = true;

firstaids = game.add.group();
firstaids.enableBody = true;

for (var i = 0; i < 12; i++)
{
  var firstaid = firstaids.create(i * 70, 400, 'firstaid');

}
    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 200, 'star');
        star.animations.add('walk');
        star.animations.play('walk', 5, true);
    }

    can = star.animations.add('can', [0,1,2,3], 10, true);
    star.play('can');




//HUD

    energybar = game.add.sprite(550, 540, 'energybar');
    energybar.fixedToCamera = true;

    lifebars = game.add.group();

    tati = game.add.sprite(10,20,'tati');
    tati.fixedToCamera = true;

}

function start() {

    sounds.shift();

    funkao.loopFull(0.6);

}

function fadePicture() {

    game.add.tween(logo).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);

}



function update () {

  updateEnemies();

  //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
  game.physics.arcade.overlap(tank, stars, collectStar, null, this);
  game.physics.arcade.overlap(tank, firstaids, collectLife, null, this);
  game.physics.arcade.collide(tank,pickups);

    if (leftKey.isDown)
    {
        tank.angle = 180;
        if(currentSpeed <= 300){
          currentSpeed = 300;
        }
    }
    if (rightKey.isDown)
    {
      tank.angle = 0;
      if(currentSpeed <= 300){
        currentSpeed = 300;
      }
    }

    if (upKey.isDown)
    {
      if (leftKey.isDown){
        tank.angle = -135;
      } else if (rightKey.isDown){
        tank.angle = -45;
      } else {
        tank.angle = -90;
      }
      if(currentSpeed <= 300){
        currentSpeed = 300;
      }
    } else if (downKey.isDown){
      if (leftKey.isDown){
        tank.angle = 135;
      } else if (rightKey.isDown){
        tank.angle = 45;
      } else {
        tank.angle = 90;

      }
      if(currentSpeed <= 300){
        currentSpeed = 300;
      }
    }



    if(upKey.isDown || downKey.isDown || leftKey.isDown || rightKey.isDown){
      tank.play('walk');
      turret.play('walk');
      move = 1;
    } else {
      tank.animations.stop();
      turret.animations.stop();
      tank.frame = 0;
      turret.frame = 0;
      move = 0;
    }

    if (explo.isDown){
      var explosionAnimation = explosions.getFirstExists(false);
        explosionAnimation.reset(tank.x, tank.y);
        explosionAnimation.play('kaboom', 30, false, true);
        life--;
    }

    if(energy == 1){
      energybar.visible = true;
      energybar.frame = 0;
    }
    else if(energy == 2){
      energybar.frame = 1;
    }
    else if(energy == 3){
      energybar.frame = 2;
    } else {
      energybar.visible = false;
    }

    if (space.isDown){
      if (energy == 3){
        currentSpeed = 10000;
      } else if (energy == 2) {
        currentSpeed = 7500;
      } else if (energy == 1){
        currentSpeed = 5000;
      }
      energy = 0;
    }

    if (currentSpeed > 500){
      currentSpeed -= 50;
    } else if (currentSpeed > 0){
      currentSpeed -= 20;
    }



if (move == 1){
  game.physics.arcade.velocityFromRotation(tank.rotation, currentSpeed, tank.body.velocity);
} else {
  game.physics.arcade.velocityFromRotation(tank.rotation, 0, tank.body.velocity);
}



    turret.x = tank.x;
    turret.y = tank.y;

    turret.rotation = game.physics.arcade.angleToPointer(turret);

    if (game.input.activePointer.isDown)
    {
        //  Boom!
        fire();
    }

    lifebars.callAll('kill');

    for (var i = 1; i <= life; i++){
      lifebar = lifebars.create(60+i*30,40,'life');
      lifebar.scale.setTo(0.3,0.3);
      lifebar.fixedToCamera = true;
    }

}

function fire () {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstExists(false);



if (arma == 0){
  bullet.reset(turret.x-10, turret.y-10);
  arma = 1;
} else {
  bullet.reset(turret.x+10, turret.y+10);
  arma = 0;
}


        bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer);
    }

}

function render () {

    // game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
  //  game.debug.text( 'Life:' + life + ' / Score: ' + score + ' / Speed: ' + currentSpeed + ' / X: ' + tank.x + 'Y: ' + tank.y, 32, 32);

}

function collectStar (tank, star) {

    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    //score += 10;
    if (energy < 3){
      energy++;
    }



}

function collectLife (tank, firstaid) {

    // Removes the star from the screen
    firstaid.kill();

    //  Add and update the score
    //score += 10;
    if (life < 20){
      life++;
    }



}
