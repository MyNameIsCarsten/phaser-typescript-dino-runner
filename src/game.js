"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var Phaser = require("phaser");
var MainScene = /** @class */ (function (_super) {
    __extends(MainScene, _super);
    function MainScene() {
        return _super.call(this, 'MainScene') || this;
    }
    MainScene.prototype.preload = function () {
        this.load.image('background', 'dist/assets/backround.png');
        // ... load other assets
    };
    MainScene.prototype.create = function () {
        this.add.image(400, 300, 'background');
        // ... add other game objects
    };
    MainScene.prototype.update = function () {
        // ... game loop logic
    };
    return MainScene;
}(Phaser.Scene));
exports.default = MainScene;
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
