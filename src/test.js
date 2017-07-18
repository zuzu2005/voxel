var Game = require("./game");

var game = new Game({canvas:document.getElementById('3d'),maxFrameSize:320});
game.run();
console.log('hello world!');
