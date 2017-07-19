var Game = require("./game");

var game = new Game();

game.on('init',function(){
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    this.scene.add( cube );

    this.camera.position.z = 5;
    console.log('run...');
});

game.run();

console.log('hello world!');
