import * as Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
    
    private platforms?: Phaser.Physics.Arcade.StaticGroup
    private dinosaur?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private obstacle?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    private background? : Phaser.GameObjects.TileSprite;
    
    constructor() {
        super('MainScene');
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('dino', 'assets/dino.png');
        this.load.image('obstacle', 'assets/obstacle.png');
        this.load.image('ground', 'assets/ground.png');
    }

    create() {
        this.background = this.add.tileSprite(0, 0, 800, 500, 'background').setOrigin(0, 0);

        // plattforms
		this.platforms = this.physics.add.staticGroup();
		const ground = this.platforms.create(250, 418, 'ground') as Phaser.Physics.Arcade.Sprite;
		
		ground
			.setScale(1)
			.refreshBody();

        this.platforms.create(600, 418, 'ground');

        this.dinosaur = this.physics.add.sprite(150, 0, 'dino');
        this.dinosaur.setGravityY(600);
        this.dinosaur.setCollideWorldBounds(true);
        this.dinosaur.setScale(0.5);

        // make player collide with platforms
		this.physics.add.collider(this.dinosaur, this.platforms);

        // cursor
		this.cursors = this.input.keyboard?.createCursorKeys();

        
    }

    update() {

        this.background!.tilePositionX += 5; // Adjust the speed as needed

        if(this.cursors?.up.isDown && this.dinosaur?.body.touching.down){
            // Set how high sprite can jump
			this.dinosaur.setVelocityY(-500);
		}
    }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 500,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 300 },
      debug: false
    }
  },
  scene: MainScene
};

const game = new Phaser.Game(config);
