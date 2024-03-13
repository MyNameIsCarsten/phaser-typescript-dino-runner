import * as Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
    
    private platforms?: Phaser.Physics.Arcade.StaticGroup
    private dinosaur?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private obstacle?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    private background? : Phaser.GameObjects.TileSprite;
    private gameRunning: boolean = false;
    private shouldScheduleNextObstacle: boolean = true;

    private scheduleNextObstacle() {
        console.log("Scheduling next obstacle");

        const delay = Phaser.Math.Between(1000, 3000); // Random delay between 1 and 5 seconds

        this.time.delayedCall(delay, () => {
            this.resetObstacle();
        });
    }

    private resetObstacle() {
        console.log("Starting object reset");
        if (this.obstacle) {
            this.obstacle.x = 800; // Reset x position to reappear on the screen
            this.obstacle.y = 310;
            this.shouldScheduleNextObstacle = true;
            console.log("Object is reset");
        }
    }

    private endGame() {
        if (this.dinosaur) {
            // Optional: change the dinosaur's frame or animation to indicate game over
            // this.dinosaur.setFrame(2); // Example if you have a specific frame for game over
    
            // Stop the dinosaur's animation (if it's animated)
            this.dinosaur.anims.stop();
    
            // Stop the dinosaur's movement
            this.dinosaur.setVelocity(0);
    
            // Set the gameRunning flag to false to stop updating the game elements
            this.gameRunning = false;

            this.dinosaur.play('over');
    
            // Optional: display a game over text
            const gameOverText = this.add.text(400, 250, 'Game Over', { fontSize: '32px', color: '#000' });
            gameOverText.setOrigin(0.5, 0.5); // Center the text
    
            // Additional game over logic here (e.g., restart button, score display)
        }
    }
    
    constructor() {
        super('MainScene');
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.spritesheet('dino', 'assets/dino.png', { 
            frameWidth: 307, 
            frameHeight: 271 
        });
        this.load.image('obstacle', 'assets/obstacle.png');
        this.load.image('ground', 'assets/ground.png');
    }

    create() {
        this.gameRunning = true;

        this.background = this.add.tileSprite(0, 0, 800, 500, 'background').setOrigin(0, 0);

        // plattforms
		this.platforms = this.physics.add.staticGroup();
		const ground = this.platforms.create(250, 418, 'ground') as Phaser.Physics.Arcade.Sprite;
		
		ground
			.setScale(1)
			.refreshBody();

        this.platforms.create(600, 418, 'ground');

        // Animation for walking
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('dino', { start: 0, end: 1 }), // Assuming frames 0 and 1 are for walking
            frameRate: 10,
            repeat: -1 // Looping the animation
        });

        // Animation for wagame overlking
        this.anims.create({
			key: 'over',
			frames: [ { key: 'dino', frame: 2 } ],
			frameRate: 10
		});

        this.dinosaur = this.physics.add.sprite(150, 30, 'dino');
        this.dinosaur.setGravityY(600);
        this.dinosaur.setCollideWorldBounds(true);
        this.dinosaur.setScale(0.5);

         // Play the walking animation
        this.dinosaur.play('walk');

        // make player collide with platforms
		this.physics.add.collider(this.dinosaur, this.platforms);

        // cursor
		this.cursors = this.input.keyboard?.createCursorKeys();

        // Directly create the obstacle as a static sprite
        this.obstacle = this.physics.add.sprite(900, 310, 'obstacle');
        this.physics.add.collider(this.obstacle, this.platforms);
        this.obstacle.setScale(0.5).refreshBody();


        if (this.dinosaur && this.obstacle) {
            this.physics.add.collider(this.dinosaur, this.obstacle, () => {
                this.endGame();
            });
        }
    }

    update() {
        if (this.gameRunning) {
            this.background!.tilePositionX += 5;
        
            // Assuming the game width is 800 pixels
            if (this.obstacle && this.obstacle.x > -50) {  // -50 is just before the obstacle completely goes off-screen
                this.obstacle.x -= 5;
            } else if (this.shouldScheduleNextObstacle) {
                this.scheduleNextObstacle();
                this.shouldScheduleNextObstacle = false;
            }
        
            // Jump logic
            if (this.cursors?.up.isDown && this.dinosaur?.body.touching.down) {
                this.dinosaur.setVelocityY(-550);
            }
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
      debug: true
    }
  },
  scene: MainScene
};

const game = new Phaser.Game(config);
