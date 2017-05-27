Tornera = function (index, game, player, bullets, x, y) {
  
    this.game = game;
    this.health = 3;
    this.player = player;
    this.bullets = bullets;
    this.fireRate = 1000;
    this.nextFire = 0;
    this.alive = true;

    this.baseTorreta = game.add.sprite(x, y, 'torret'); //Configurar
    this.torreta = game.add.sprite(x, y, 'torret'); //Configurar

    this.torreta.anchor.set(0.3, 0.5); //Configurar

    this.torreta.name = index.toString();
    game.physics.enable(this.baseTorreta, Phaser.Physics.ARCADE);
    this.baseTorreta.body.immovable = true;
    this.baseTorreta.body.collideWorldBounds = true;

    this.torreta.angle = game.rnd.angle(); //Angulo inicial random (eu acho)
}

Torreta = function (index, game, player, bullets, x, y) {

    this.game = game;
    this.health = 3;
    this.player = player;
    this.bullets = bullets;
    this.fireRate = 1000;
    this.nextFire = 0;
    this.alive = true;

    this.baseTorreta = game.add.sprite(x-17, y-20, 'torretbase'); //Configurar
    this.torreta = game.add.sprite(x, y, 'torret'); //Configurar
    this.torreta.scale.setTo(1.2, 1.2);
    this.torreta.anchor.set(0.3, 0.4); //Configurar

    this.torreta.name = index.toString();
    game.physics.enable(this.baseTorreta, Phaser.Physics.ARCADE);
    this.baseTorreta.body.immovable = true;
    this.baseTorreta.body.collideWorldBounds = true;

    this.torreta.angle = game.rnd.angle(); //Angulo inicial random (eu acho)
}

Torreta.prototype.damage = function() {

    this.health -= 1;

    if (this.health <= 0)
    {
        this.alive = false;

        // this.baseTorreta.kill();
        this.torreta.kill();

        return true;
    }

    return false;

}

Torreta.prototype.update = function() {

    this.torreta.rotation = this.game.physics.arcade.angleBetween(this.torreta, this.player);

    if (this.game.physics.arcade.distanceBetween(this.torreta, this.player) < 500)
    {
        if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
        {
            this.nextFire = this.game.time.now + this.fireRate;

            var bullet = this.bullets.getFirstDead();

            bullet.reset(this.torreta.x, this.torreta.y);

            bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 500);
        }
    }

};

function createEnemies () {

    //  The enemies bullet group
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(100, 'bullet');

    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 0.5);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    //Torretas
    torreta1 = new Torreta(1, game, tank, enemyBullets, 100, 100);
}

function updateEnemies () {

  // Torretas
  game.physics.arcade.overlap(enemyBullets, tank, bulletHitPlayer, null, this);

  if (torreta1.alive) {
    game.physics.arcade.collide(tank, torreta1.baseTorreta);
    game.physics.arcade.overlap(bullets, torreta1.baseTorreta, bulletHitEnemy, null, this);
    torreta1.update();
  }

}