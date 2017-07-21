var Game = require("./game");
var kb = require("kb-controls");

var game = new Game({enableStats:true});

var cube;
game.on('init',function(){
    var geometry = new THREE.BoxGeometry( 10, 10, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
    cube = new THREE.Mesh( geometry, material );
    this.scene.add( cube );

    var mesh = new THREE.Mesh(
        new THREE.SphereBufferGeometry( 50, 16, 8 ),
        new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } )
    );
    this.scene.add( mesh );
    var mesh2 = new THREE.Mesh(
        new THREE.SphereBufferGeometry( 10, 32, 16 ),
        new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } )
    );
    mesh2.position.y = 150;
    mesh.add( mesh2 );
});

game.run();
