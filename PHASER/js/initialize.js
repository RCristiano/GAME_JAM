

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload () {

    game.load.image('logo', 'assets/logo.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('room', 'assets/room.jpg');
    game.load.image('fundo', 'assets/fundo.jpg');
    game.load.image('life', 'assets/life.png');
    game.load.spritesheet('star', 'assets/star.png', 13, 22, 4);
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
    
}

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

var logo;
var score = 0;
var stars;
var discos;
var discoList = [];
var energy = 0;
var life = 20;
var torreta;

var move = 0;

var currentSpeed = 0;
var cursors;

var bullets;
var fireRate = 200;
var nextFire = 0;




function create () {

  upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
  downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
  leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
  rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
  space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  explo = game.input.keyboard.addKey(Phaser.Keyboard.E);



    //  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(-1000, -1000, 2000, 2000);

    
    //ROOM!!!!
    room = game.add.sprite(200,200, 'room')
    fundo = game.add.sprite(-1000, -1000, 'fundo');

    //  The base of our tank
    tank = game.add.sprite(50, 27, 'pernas', 1);
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

    game.input.onDown.add(removeLogo, this);

    game.camera.follow(tank);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);

    cursors = game.input.keyboard.createCursorKeys();

    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;





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



  //DISCOS INICIO
        discos1 = game.add.group();
        discos1.enableBody = true;
        discos2 = game.add.group();
        discos2.enableBody = true;
        discos3 = game.add.group();
        discos3.enableBody = true;
        discos4 = game.add.group();
        discos4.enableBody = true;
        
        var disco1 = discos1.create(150, 200, 'disco1',1);
        var disco2 = discos2.create(150, 250, 'disco2',2);
        var disco3 = discos3.create(150, 300, 'disco3',3);
        var disco4 = discos4.create(150, 350, 'disco4',4);
        
  //DISCOS FIM
    
        
    
    
    
//HUD

    energybar = game.add.sprite(550, 540, 'energybar');
    energybar.fixedToCamera = true;

    for (var i = 0; i <= life; i++){
      lifebar = game.add.sprite(30+i*30,40,'life');
      lifebar.scale.setTo(0.3,0.3);
      lifebar.fixedToCamera = true;
    }



}

function removeLogo () {

    game.input.onDown.remove(removeLogo, this);
    logo.kill();

}

function update () {

  updateEnemies();

  //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
  game.physics.arcade.overlap(tank, stars, collectStar, null, this);

  
  //DISCOS INICIO
  if (game.physics.arcade.overlap(tank, discos1, collectDisco, null, this)) {
	  verificaDisco('disco1',1);
  }
 
  if (game.physics.arcade.overlap(tank, discos2, collectDisco, null, this)) {
	  verificaDisco('disco2',2);
  }
  
  if (game.physics.arcade.overlap(tank, discos3, collectDisco, null, this)) {
	  verificaDisco('disco3',3);
  }
  
  if (game.physics.arcade.overlap(tank, discos4, collectDisco, null, this)) {
	  verificaDisco('disco4',4);
  }
  

  function verificaDisco(paramValue, paramNum){
	  discosbar = game.add.sprite(20+(paramNum*20),470,paramValue,paramNum);
	  discosbar.scale.setTo(0.3,0.3);
      discosbar.fixedToCamera = true;
  	}
  //DISCOS FIM
  
  
    if (leftKey.isDown)
    {
        tank.angle = 180;
        if(currentSpeed <= 200){
          currentSpeed = 200;
        }
    }
    if (rightKey.isDown)
    {
      tank.angle = 0;
      if(currentSpeed <= 200){
        currentSpeed = 200;
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
      if(currentSpeed <= 200){
        currentSpeed = 200;
      }
    } else if (downKey.isDown){
      if (leftKey.isDown){
        tank.angle = 135;
      } else if (rightKey.isDown){
        tank.angle = 45;
      } else {
        tank.angle = 90;

      }
      if(currentSpeed <= 200){
        currentSpeed = 200;
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
      currentSpeed -= 100;
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
    game.debug.text( 'Life:' + life + ' / Score: ' + score + ' / Speed: ' + currentSpeed, 32, 32);

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


