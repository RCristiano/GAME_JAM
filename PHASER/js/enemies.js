var inheritsFrom = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
};

var enemies = [];

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
        score++;

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

    enemies.push(new Torreta(0, game, tank, enemyBullets, 100, 100));
}

function updateEnemies () {

  // Torretas
  game.physics.arcade.overlap(enemyBullets, tank, bulletHitPlayer, null, this);

    if (enemies[0].alive) {
      game.physics.arcade.collide(tank, enemies[0].baseTorreta);
      game.physics.arcade.overlap(bullets, enemies[0].baseTorreta, bulletHitEnemy, null, this);
      enemies[0].update();
    }


}

function bulletHitPlayer (player, bullet) {

    bullet.kill();
    life--;

}

function bulletHitEnemy (enemy, bullet) {

    bullet.kill();

    var destroyed = enemies[0].damage();

    if (destroyed)
    {
        var explosionAnimation = explosions.getFirstExists(false);
        explosionAnimation.reset(tank.x, tank.y);
        explosionAnimation.play('kaboom', 30, false, true);
    }

}