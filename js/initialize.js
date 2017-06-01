

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload () {

    game.load.audio('funkaoneuvosor', 'assets/funkao.mp3');
    game.load.image('logo', 'assets/logo.png');
    game.load.image('win', 'assets/ganhou.png');
    game.load.image('lose', 'assets/perdeu.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('laser', 'assets/laser.png');
    game.load.image('fundo', 'assets/bacg.png');
    game.load.image('life', 'assets/life.png');
    game.load.image('firstaid', 'assets/firstaid.png');
    game.load.image('tati', 'assets/tatizaqui.png');
    game.load.spritesheet('star', 'assets/star.png', 13, 22, 4);
    game.load.spritesheet('avoa', 'assets/drone.png', 42, 40, 2);
    game.load.spritesheet('zeruela', 'assets/tanque.png', 68, 52, 2);
    game.load.spritesheet('kaboom', 'assets/explosion.png', 100, 100, 6);
    game.load.spritesheet('energybar', 'assets/energy.png', 150, 30, 3);
    game.load.spritesheet('torret', 'assets/torret.png', 39, 16, 2);
    game.load.spritesheet('torretbase', 'assets/torretbase.png', 36, 46, 6);
    game.load.spritesheet('corpo', 'assets/CORPO.png', 60, 36, 3);
    game.load.spritesheet('pernas', 'assets/PERNAS.png', 60, 36, 5);
    game.load.spritesheet('disco1', 'assets/disco1.png', 50, 50, 1);
    game.load.spritesheet('disco2', 'assets/disco2.png', 50, 50, 1);
    game.load.spritesheet('disco3', 'assets/disco3.png', 50, 50, 1);
    game.load.spritesheet('disco4', 'assets/disco4.png', 50, 50, 1);
    game.load.spritesheet('torneira', 'assets/torneiras.png', 64, 64, 2);
    game.load.spritesheet('pickups', 'assets/pickups.png', 34, 25, 8);

    game.load.image('div4V','assets/div4(1).png');
    game.load.image('div4H','assets/div4(2).png');

    //assets para a formação de barreiras para impedir o jogador de sair da tela
    game.load.image('paredesH' , 'assets/platform(1).png');
    game.load.image('paredesV' , 'assets/platform(2).png');

}

//variaveis da parede de primeira camada e hidden
var parede;
var paredeVisivel;

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
var score = 0;
var stars;
var discos;
var discoList = [];
var energy = 0;
var life = 10;
var torreta;
var tati;

var move = 0;

var currentSpeed = 0;
var cursors;

var bullets;
var fireRate = 200;
var nextFire = 0;




function create () {

  //paredes que não aparecem
  parede = game.add.group();
  parede.enableBody = true;
  var ledge = parede.create(-670, -685, 'paredesH');
  ledge.body.immovable = true;
  ledge = parede.create(-670, 648, 'paredesH');
  ledge.body.immovable = true;
  ledge = parede.create(-665, -685, 'paredesV');
  ledge.body.immovable = true;
  ledge = parede.create(720, -685, 'paredesV');
  ledge.body.immovable = true;

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
    pickups.scale.setTo(1);

var pickup = pickups.create(-120, 150, 'pickups',0);
pickup.body.immovable = true;
var pickup = pickups.create(175, 155, 'pickups',1);
pickup.body.immovable = true;
var pickup = pickups.create(175, -131, 'pickups',2);
pickup.body.immovable = true;
var pickup = pickups.create(-120, -128, 'pickups',3);
pickup.body.immovable = true;

    /*if (pickupok[0] == 1){
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
*/

firstaids = game.add.group();
firstaids.enableBody = true;

  var firstaid = firstaids.create(629, -18, 'firstaid');

    var firstaid = firstaids.create(81, -576, 'firstaid');

      var firstaid = firstaids.create(-534, 12, 'firstaid');

        var firstaid = firstaids.create(42, 600, 'firstaid');

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 3; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 50, 200, 'star');
        star.animations.add('walk');
        star.animations.play('walk', 5, true);
    }

    for (var i = 0; i < 3; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(-10 + i * 50, -150, 'star');
        star.animations.add('walk');
        star.animations.play('walk', 5, true);
    }

    for (var i = 0; i < 3; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create( 200 , -48 + i * 50, 'star');
        star.animations.add('walk');
        star.animations.play('walk', 5, true);
    }

    for (var i = 0; i < 3; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create( -100 , -48 + i * 50, 'star');
        star.animations.add('walk');
        star.animations.play('walk', 5, true);
    }


    can = star.animations.add('can', [0,1,2,3], 10, true);
    star.play('can');



  //DISCOS INICIO
        discos1 = game.add.group();
        discos1.enableBody = true;
        discos2 = game.add.group();
        discos2.enableBody = true;
        discos3 = game.add.group();
        discos3.enableBody = true;
        discos4 = game.add.group();
        discos4.enableBody = true;

        var disco1 = discos1.create(-586, 627, 'disco1',1);
        var disco2 = discos2.create(-586, -615, 'disco2',2);
        var disco3 = discos3.create(684, -615, 'disco3',3);
        var disco4 = discos4.create(660, 520, 'disco4',4);

  //DISCOS FIM

  //Labirinto
  paredeVisivel = game.add.group();
  paredeVisivel.enableBody = true;
  var Labirinto = paredeVisivel.create(120, 345, 'div4H');
  Labirinto.body.immovable = true;
  Labirinto = paredeVisivel.create(240, 345, 'div4V');
  Labirinto.body.immovable = true;
  Labirinto = paredeVisivel.create(120, 460, 'div4H');
  Labirinto.body.immovable = true;
  Labirinto = paredeVisivel.create(120, 460, 'div4V');
  Labirinto.body.immovable = true;
  Labirinto = paredeVisivel.create(240, 225, 'div4H');
  Labirinto.body.immovable = true;
  Labirinto = paredeVisivel.create(355, 110, 'div4V');
  Labirinto.body.immovable = true;
  Labirinto = paredeVisivel.create(355, 110, 'div4H');
  Labirinto.body.immovable = true;
  Labirinto = paredeVisivel.create(360, 345, 'div4V');
  Labirinto.body.immovable = true;
  Labirinto = paredeVisivel.create(360, 465, 'div4H');
  Labirinto.body.immovable = true;
  Labirinto = paredeVisivel.create(480, 465, 'div4V');
  Labirinto.body.immovable = true;
  Labirinto = paredeVisivel.create(480, 585, 'div4H');
  Labirinto.body.immovable = true;
  Labirinto = paredeVisivel.create(595, 465, 'div4V');
  Labirinto.body.immovable = true;
  Labirinto = paredeVisivel.create(595, 465, 'div4H');
  Labirinto.body.immovable = true;
  Labirinto = paredeVisivel.create(480, 225, 'div4V');
  Labirinto.body.immovable = true;
  Labirinto = paredeVisivel.create(480, 345, 'div4H');
  Labirinto.body.immovable = true;
  Labirinto = paredeVisivel.create(592, 225, 'div4V');
  Labirinto.body.immovable = true;
  Labirinto = paredeVisivel.create(360, 465, 'div4V');
  Labirinto.body.immovable = true;
  Labirinto = paredeVisivel.create(245, 580, 'div4H');
  Labirinto.body.immovable = true;

//HUD

    energybar = game.add.sprite(550, 540, 'energybar');
    energybar.fixedToCamera = true;

    lifebars = game.add.group();

    tati = game.add.sprite(10,20,'tati');
    tati.fixedToCamera = true;


        logo = game.add.sprite(0, 0, 'logo');
        logo.fixedToCamera = true;
        game.time.events.add(Phaser.Timer.SECOND * 1, fadePicture, this);




}

function start() {

    sounds.shift();

    funkao.loopFull(0.6);

}

function fadePicture() {

    game.add.tween(logo).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);

}



function update () {


      var hitParede = game.physics.arcade.collide(tank, parede);
      var hitLab = game.physics.arcade.collide(tank, paredeVisivel);
      var hitEnemy = game.physics.arcade.collide(tank, enemies[3]);


      game.physics.arcade.overlap(parede, bullets, killBullet, null, this);
      game.physics.arcade.overlap(paredeVisivel, bullets, killBullet2, null, this);


  updateEnemies();

  //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
  game.physics.arcade.overlap(tank, stars, collectStar, null, this);
  game.physics.arcade.overlap(tank, firstaids, collectLife, null, this);

  game.physics.arcade.collide(tank,pickups);


  //DISCOS INICIO
  if (game.physics.arcade.overlap(tank, discos1, collectDisco, null, this)) {
	  verificaDisco('disco1',1);
    pickupok[0] = 1;
  }

  if (game.physics.arcade.overlap(tank, discos2, collectDisco, null, this)) {
	  verificaDisco('disco2',2);
    pickupok[1] = 1;
  }

  if (game.physics.arcade.overlap(tank, discos3, collectDisco, null, this)) {
	  verificaDisco('disco3',3);
    pickupok[2] = 1;
  }

  if (game.physics.arcade.overlap(tank, discos4, collectDisco, null, this)) {
	  verificaDisco('disco4',4);
    pickupok[3] = 1;
  }



  function verificaDisco(paramValue, paramNum){
	  discosbar = game.add.sprite(20+(paramNum*40),550,paramValue,paramNum);
	  discosbar.scale.setTo(0.5,0.5);
      discosbar.fixedToCamera = true;
  	}
  //DISCOS FIM

  pickups.callAll('kill');
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

    if (pickupok[0] == 1 && pickupok[1] == 1 && pickupok[2] == 1 && pickupok[3] == 1){
    ganhou = game.add.sprite(0,0,'win');
    ganhou.fixedToCamera = true;
}

if (life <= 0){
  ganhou = game.add.sprite(0,0,'lose');
  ganhou.fixedToCamera = true;
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

  game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length + ' Enemy bullets: ' + enemyBullets.countLiving() + ' / ' + enemyBullets.length, 32, 32);
 //game.debug.text( 'Life:' + life + ' / Score: ' + score + ' / Speed: ' + currentSpeed + ' / X: ' + tank.x + 'Y: ' + tank.y, 32, 32);

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


// Coleta os Discos
function collectDisco(tank, discos) {
    // Removes the disco from the screen
	discoList.push(discos)
	discos.kill();
}


function collectLife (tank, firstaid) {

    // Removes the star from the screen
    firstaid.kill();

    //  Add and update the score
    //score += 10;
    if (life < 10){
      life = life+2;
    }



}

function killBullet(bullets, parede){

    parede.kill();

}


function killBullet2(bullets, paredeVisivel){

    paredeVisivel.kill();

}
