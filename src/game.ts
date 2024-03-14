import * as Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
    
    private platforms?: Phaser.Physics.Arcade.StaticGroup
    private dinosaur?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private obstacle?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    private background? : Phaser.GameObjects.TileSprite;
    private gameRunning: boolean = false;
    private shouldScheduleNextObstacle: boolean = true;
    private startTime: number = 0;
    private timerText?: Phaser.GameObjects.Text;
    private currentSpeed: number = 0;
    private speedIncreased: boolean = false;

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
            const gameOverText = this.add.text(400, 250, 'Game Over', { fontSize: '32px', color: '#fff' });
            gameOverText.setOrigin(0.5, 0.5); // Center the text

            // Grey out the scene
            const overlay = this.add.rectangle(0, 0, 800, 500, 0x000000, 0.01)
                .setOrigin(0, 0);  // Cover the entire game area
    
            // Create restart button text
            const restartText = this.add.text(400, 300, 'Restart', { fontSize: '24px', color: '#fff' })
                .setOrigin(0.5, 0.5)
                .setInteractive({ useHandCursor: true }) // makes the text interactive, so it can respond to pointer events.
                .on('pointerdown', () => this.scene.restart()) // adds an event listener to restart the scene when the text is clicked
                .on('pointerover', () => restartText.setStyle({ color: '#fff' })) // Change color on hover
            }
    }
    
    constructor() {
        super('MainScene');
        this.currentSpeed = 5; // Initial speed
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.spritesheet('dino', 'assets/dino.png', { 
            frameWidth: 330, 
            frameHeight: 270 
        });
        this.load.image('obstacle', 'assets/obstacle.png');
        this.load.image('ground', 'assets/ground.png');
    }

    create() {
        // Start Game
        this.gameRunning = true;

        // Create background
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

        // Initialize timer
        this.startTime = Date.now();
        this.timerText = this.add.text(580, 16, 'Time: 00:00', { fontSize: '30px', color: '#fff' });
    }

    update() {
        if (this.gameRunning) {
            // Calculate elapsed time in seconds
            const elapsed = Date.now() - this.startTime;
            const elapsedSeconds = Math.floor(elapsed / 1000);

            // Calculate minutes and seconds
            const minutes = Math.floor(elapsedSeconds / 60);
            const seconds = elapsedSeconds % 60;

            // Format minutes and seconds to always display two digits
            const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            // Update the timer text
            this.timerText?.setText(`Time: ${formattedTime}`);

            // Increase speed every 20 seconds
            if (elapsedSeconds % 10 === 0) {
                if (!this.speedIncreased && this.currentSpeed < 20) {
                    this.currentSpeed += 2;
                    this.speedIncreased = true;
                }
            } else {
                this.speedIncreased = false;
            }

            // Use currentSpeed for background movement
            this.background!.tilePositionX += this.currentSpeed;
            console.log(this.currentSpeed)
        
            // Assuming the game width is 800 pixels
            if (this.obstacle && this.obstacle.x > -50) {  // -50 is just before the obstacle completely goes off-screen
                // Use currentSpeed for obstacle movement
                this.obstacle.x -= this.currentSpeed;
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
      debug: false
    }
  },
  scene: MainScene
};

const game = new Phaser.Game(config);
