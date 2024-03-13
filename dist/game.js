var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as Phaser from 'phaser';
var MainScene = /** @class */ (function (_super) {
    __extends(MainScene, _super);
    function MainScene() {
        return _super.call(this, 'MainScene') || this;
    }
    MainScene.prototype.preload = function () {
        this.load.image('background', 'assets/background.png');
        this.load.image('dino', 'assets/dino.png');
        this.load.image('obstacle', 'assets/obstacle.png');
        this.load.image('ground', 'assets/ground.png');
    };
    MainScene.prototype.create = function () {
        var _this = this;
        var _a;
        this.background = this.add.tileSprite(0, 0, 800, 500, 'background').setOrigin(0, 0);
        // plattforms
        this.platforms = this.physics.add.staticGroup();
        var ground = this.platforms.create(250, 418, 'ground');
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
        this.cursors = (_a = this.input.keyboard) === null || _a === void 0 ? void 0 : _a.createCursorKeys();
        // obstacle
        this.obstacle = this.physics.add.sprite(700, 300, 'obstacle');
        this.obstacle.setScale(0.5);
        this.physics.add.collider(this.obstacle, this.platforms);
        this.physics.add.collider(this.dinosaur, this.obstacle, function () {
            _this.scene.restart(); // Restart the scene on collision
        });
    };
    MainScene.prototype.update = function () {
        var _a, _b;
        this.background.tilePositionX += 5; // Adjust the speed as needed
        if (((_a = this.cursors) === null || _a === void 0 ? void 0 : _a.up.isDown) && ((_b = this.dinosaur) === null || _b === void 0 ? void 0 : _b.body.touching.down)) {
            // Set how high sprite can jump
            this.dinosaur.setVelocityY(-500);
        }
        this.obstacle.x -= 5; // Move the obstacle left; adjust speed as needed
        if (this.obstacle.x < 0) { // Reset obstacle position when it goes off screen
            this.obstacle.x = 600;
        }
    };
    return MainScene;
}(Phaser.Scene));
export default MainScene;
var config = {
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
var game = new Phaser.Game(config);
//# sourceMappingURL=game.js.map