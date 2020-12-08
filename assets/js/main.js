const config = {
  type: Phaser.AUTO,
  width: 900,
  height: 555,
  autoCenter: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

function preload() {
  game.paused = false;
  this.load.image('background', 'assets/img/background.png');
  this.load.image('kitchen-on-top', 'assets/img/kitchen-on-top.png');
  this.load.image('platform', 'assets/img/platform.png');

  this.load.spritesheet('kiki-sprite', 'assets/img/kiki-sprite.png', {
    frameWidth: 123,
    frameHeight: 200,
  });

  this.load.image('apple', 'assets/img/apple.png');
  this.load.image('cheese', 'assets/img/cheese.png');
  this.load.image('cupcake', 'assets/img/cupcake.png');
  this.load.image('pizza', 'assets/img/pizza.png');
  this.load.image('sushi', 'assets/img/sushi.png');
  this.load.image('moldybread', 'assets/img/moldybread.png');
  this.load.audio('music', ['assets/audio/music.mp3']);
  this.load.audio('getpoints', ['assets/audio/getpoints.mp3']);
  this.load.audio('leveldown', ['assets/audio/leveldown.mp3']);
}

let platforms;
let platformCollider;
let food;
let player;
let foodlist;
let score = 0;
let scoreText;
let moldyBread;
let gameOver;
let gameoverText;

function create() {
  platforms = this.physics.add.staticGroup();

  platforms.create(200, 340, 'platform');
  platforms.create(200, 180, 'platform');

  this.background1 = this.add
    .tileSprite(0, 0, 900, 900, 'background')
    .setOrigin(0, 0);

  this.background2 = this.add
    .tileSprite(0, 0, 900, 900, 'kitchen-on-top')
    .setOrigin(0, 0);

  player = this.physics.add.sprite(200, 50, 'kiki-sprite');

  player.setScale(0.75);
  player.setCollideWorldBounds(true);

  this.anims.create({
    key: 'run',
    frames: this.anims.generateFrameNumbers('kiki-sprite', {
      start: 0,
      end: 5,
    }),
    frameRate: 10,
    repeat: -1,
  });

  cursors = this.input.keyboard.createCursorKeys();

  scoreText = this.add.text(850, 16, '0', {
    fontSize: '30px',
    fill: '#88236D',
  });

  gameoverText = this.add.text(175, 200, '', {
    fontSize: '100px',
    fill: '#FF0000',
  });

  platformCollider = this.physics.add.collider(player, platforms);

  player.body.setGravityY(300);

  this.platformHeights = [130, 280, 500];

  this.foodlist = [
    this.physics.add.group({
      key: 'moldybread',
      setXY: {
        x: 2800,
        y: this.platformHeights[
          Math.floor(Math.random() * this.platformHeights.length)
        ],
        stepX: 70,
      },
    }),

    this.physics.add.group({
      key: 'pizza',
      setXY: {
        x: 800,
        y: this.platformHeights[
          Math.floor(Math.random() * this.platformHeights.length)
        ],
        stepX: 70,
      },
    }),

    this.physics.add.group({
      key: 'cupcake',
      setXY: {
        x: 2000,
        y: this.platformHeights[
          Math.floor(Math.random() * this.platformHeights.length)
        ],
        stepX: 70,
      },
    }),

    this.physics.add.group({
      key: 'sushi',
      setXY: {
        x: 1000,
        y: this.platformHeights[
          Math.floor(Math.random() * this.platformHeights.length)
        ],
        stepX: 70,
      },
    }),

    this.physics.add.group({
      key: 'apple',
      setXY: {
        x: 2500,
        y: this.platformHeights[
          Math.floor(Math.random() * this.platformHeights.length)
        ],
        stepX: 70,
      },
    }),

    this.physics.add.group({
      key: 'cheese',
      setXY: {
        x: 3000,
        y: this.platformHeights[
          Math.floor(Math.random() * this.platformHeights.length)
        ],
        stepX: 70,
      },
    }),
  ];

  getpoints = this.sound.add('getpoints');
  leveldown = this.sound.add('leveldown');
  music = this.sound.add('music');
  music.play();

  for (i = 0; i < this.foodlist.length; i++) {
    if (i == 0) {
      this.physics.add.overlap(
        player,
        this.foodlist[i],
        collectMold,
        null,
        this
      );
    }
    this.physics.add.overlap(player, this.foodlist[i], collectFood, null, this);
  }
}

function update() {
  if (gameOver) {
    return;
  }

  this.background1.tilePositionX += 5;
  this.background2.tilePositionX += 5;

  for (i = 0; i < this.foodlist.length; i++) {
    this.foodlist[i].incX(-5);
    var item = this.foodlist[i].children;

    if (item) {
      item.checkWorldBounds = true;
      item.outOfBoundsKill = true;
    }
  }

  if (cursors.up.isDown && player.body.onFloor()) {
    platformCollider.active = false;
    player.body.setVelocityY(-800); // jump up
    setTimeout(() => {
      platformCollider.active = true;
    }, 100);
  }
  if (cursors.down.isDown && player.body.onFloor()) {
    platformCollider.active = false;
    player.body.setVelocityY(600); // jump down
    setTimeout(() => {
      platformCollider.active = true;
    }, 100);
  }

  player.anims.play('run', true);
}

function collectFood(player, food) {
  getpoints.play();

  food.disableBody(true, true);

  score += 10;
  scoreText.setText(score);
}

function collectMold(player, food) {
  food.disableBody(true, true);

  gameoverText.setText('Game Over');

  game.paused = true;
  gameOver = true;

  leveldown.play();
}
