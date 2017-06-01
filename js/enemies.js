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

    this.baseTorreta = game.add.sprite(x, y, 'torretbase');
    this.torreta = game.add.sprite(x, y, 'torret');
    this.torreta.scale.setTo(1.2, 1.2);
    this.baseTorreta.anchor.set(0.5);
    this.torreta.anchor.set(0.3, 0.4);

    this.baseTorreta.name = index.toString();
    game.physics.enable(this.baseTorreta, Phaser.Physics.ARCADE);
    this.baseTorreta.body.immovable = true;
    this.baseTorreta.body.collideWorldBounds = true;

    this.torreta.angle = game.rnd.angle();
}

Tornera = function (index, game, player, bullets, x, y) {

    this.game = game;
    this.health = 3;
    this.player = player;
    this.bullets = bullets;
    this.fireRate = 200;
    this.nextFire = 0;
    this.alive = true;

    this.baseTorreta = game.add.sprite(x, y, 'torretbase');
    this.torreta = game.add.sprite(x, y, 'torneira');
    this.torreta.scale.setTo(1.2, 1.2);
    this.baseTorreta.anchor.set(0.5);
    this.torreta.anchor.set(0.5);

    this.baseTorreta.name = index.toString();
    game.physics.enable(this.baseTorreta, Phaser.Physics.ARCADE);
    this.baseTorreta.body.immovable = true;
    this.baseTorreta.body.collideWorldBounds = true;

    this.torreta.angle = game.rnd.angle();
}

Zeruela = function (index, game, player, bullets, x, y) {

    this.game = game;
    this.health = 3;
    this.player = player;
    this.bullets = bullets;
    this.fireRate = 1000;
    this.nextFire = 0;
    this.alive = true;

    this.torreta = game.add.sprite(x, y, 'zeruela', 0);
    this.torreta.anchor.set(0.5);
    this.torreta.scale.setTo(1, 1);

    this.torreta.name = index.toString();
    game.physics.enable(this.torreta, Phaser.Physics.ARCADE);
    this.torreta.body.immovable = false;
    // this.torreta.body.collideWorldBounds = true;

    this.torreta.angle = game.rnd.angle();

    this.baseTorreta = this.torreta;
}

Avoa = function (index, game, player, x, y) {

    this.game = game;
    this.health = 3;
    this.player = player;
    this.alive = true;

    this.torreta = game.add.sprite(x, y, 'avoa', 0);
    this.torreta.anchor.set(0.5);
    this.torreta.scale.setTo(1, 1);

    this.torreta.name = index.toString();
    game.physics.enable(this.torreta, Phaser.Physics.ARCADE);
    this.torreta.body.immovable = false;
    // this.torreta.body.collideWorldBounds = true;

    this.torreta.angle = game.rnd.angle();

    this.baseTorreta = this.torreta;
}

Enemy = function () {}

Enemy.prototype.damage = function() {

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


Enemy.prototype.update = function() {

    this.baseTorreta.x = this.torreta.x;
    this.baseTorreta.y = this.torreta.y;

    if (this.game.physics.arcade.distanceBetween(this.torreta, this.player) < 500)
    {
        this.torreta.rotation = this.game.physics.arcade.angleBetween(this.torreta, this.player);

        if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
        {
            this.nextFire = this.game.time.now + this.fireRate;

            var bullet = this.bullets.getFirstDead();

            bullet.reset(this.torreta.x, this.torreta.y);

            bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 500);
        }
    }

}

inheritsFrom(Torreta, Enemy);
inheritsFrom(Tornera, Enemy);
inheritsFrom(Zeruela, Enemy);
inheritsFrom(Avoa, Enemy);
//
Tornera.prototype.update = function() {

    this.baseTorreta.x = this.torreta.x
    this.baseTorreta.y = this.torreta.y

    this.torreta.rotation -= 0.1;

    if (this.game.physics.arcade.distanceBetween(this.torreta, this.player) < 500)
    {
        this.torreta.rotation -= 0.1;

        if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
        {
            this.nextFire = this.game.time.now + this.fireRate;

            var bullet = this.bullets.getFirstDead();

            bullet.reset(this.torreta.x, this.torreta.y);

            bullet.rotation = this.torreta.rotation;

            game.physics.arcade.velocityFromRotation(bullet.rotation, 100, bullet.body.velocity);
        }
    }
}

Zeruela.prototype.update = function () {

    if (this.game.physics.arcade.distanceBetween(this.torreta, this.player) < 500)
    {
        this.torreta.rotation = this.game.physics.arcade.angleBetween(this.torreta, this.player);

        if (this.game.physics.arcade.distanceBetween(this.torreta, this.player) > 100)
            game.physics.arcade.velocityFromRotation(this.torreta.rotation, 80, this.torreta.body.velocity);

        if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
        {
            this.nextFire = this.game.time.now + this.fireRate;

            var bullet = this.bullets.getFirstDead();

            bullet.reset(this.torreta.x, this.torreta.y);

            bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 500);
        }
    }
}

Avoa.prototype.update = function () {

    if (this.game.physics.arcade.distanceBetween(this.torreta, this.player) < 500)
    {
        this.torreta.rotation = this.game.physics.arcade.angleBetween(this.torreta, this.player);
        game.physics.arcade.velocityFromRotation(this.torreta.rotation, 200, this.torreta.body.velocity);
    }
}

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

    //  The torneras bullet group
    tornerasBullets = game.add.group();
    tornerasBullets.enableBody = true;
    tornerasBullets.physicsBodyType = Phaser.Physics.ARCADE;
    tornerasBullets.createMultiple(100, 'laser');

    tornerasBullets.setAll('anchor.x', 0.5);
    tornerasBullets.setAll('anchor.y', 0.5);
    tornerasBullets.setAll('outOfBoundsKill', true);
    tornerasBullets.setAll('checkWorldBounds', true);

    // Posiciona inimigos
    enemies.push(new Torreta(0, game, tank, enemyBullets, -60, 1500));
    enemies.push(new Torreta(1, game, tank, enemyBullets, 500, -500));
    enemies.push(new Tornera(2, game, tank, enemyBullets, -250, 530));
    enemies.push(new Zeruela(3, game, tank, enemyBullets, 700, -202));
    enemies.push(new Avoa(4, game, tank, 800, -100));
    enemies.push(new Torreta(5, game, tank, enemyBullets, 427, 524));
    enemies.push(new Torreta(6, game, tank, enemyBullets, 170, 408));
    enemies.push(new Zeruela(7, game, tank, enemyBullets, -500, 528));
    enemies.push(new Tornera(8, game, tank, enemyBullets, -110, -520));
    enemies.push(new Tornera(9, game, tank, enemyBullets, -586, -232));
    enemies.push(new Avoa(10, game, tank, 500, 500));
}

function updateEnemies () {

  // Torretas
  game.physics.arcade.overlap(enemyBullets, tank, bulletHitPlayer, null, this);
  game.physics.arcade.overlap(tornerasBullets, tank, bulletHitPlayer, null, this);
  game.physics.arcade.overlap(enemyBullets, paredeVisivel, bulletKill, null, this);
  game.physics.arcade.overlap(tornerasBullets, paredeVisivel, bulletKill, null, this);

  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].alive) {
      game.physics.arcade.collide(tank, enemies[i].baseTorreta, colisao, null, this);
      game.physics.arcade.collide(paredeVisivel, enemies[i].baseTorreta);
      game.physics.arcade.overlap(bullets, enemies[i].baseTorreta, bulletHitEnemy, null, this);
      enemies[i].update();
    }
  }


}

function bulletHitPlayer (player, bullet) {

    bullet.kill();

    var explosionAnimation = explosions.getFirstExists(false);
        explosionAnimation.reset(player.x, player.y);
        explosionAnimation.scale.setTo(1);
        explosionAnimation.play('kaboom', 30, false, true);

    life--;

}

function bulletHitEnemy (enemy, bullet) {

    if (bullet)
        bullet.kill();

    var destroyed = enemies[enemy.name].damage();

    if (destroyed)
    {
        var explosionAnimation = explosions.getFirstExists(false);
        explosionAnimation.reset(enemy.x, enemy.y);
        explosionAnimation.scale.setTo(2);
        explosionAnimation.play('kaboom', 30, false, true);
    }
}

function bulletKill (bullet, wall) {

    bullet.kill();

    var explosionAnimation = explosions.getFirstExists(false);
        explosionAnimation.reset(wall.x, wall.y);
        explosionAnimation.scale.setTo(1);
        explosionAnimation.play('kaboom', 30, false, true);
}

function colisao (player, enemy) {

    if (enemy.key == 'avoa') {
        bulletHitEnemy(enemy);
        life = life -1;
    }
}
