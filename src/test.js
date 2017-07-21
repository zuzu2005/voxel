var Game = require("./game");
var kb = require("kb-controls");
require("whatwg-fetch");

var voxparser = require("./vox").Parser;

var game = new Game({enableStats:true});

fetch('vox/3x3x3.vox').then(function(response){
    return response.arrayBuffer();
}).then(function(req){
    var vox = voxparser(req);
    console.log(vox);
}).catch(function(err){
    console.log(err);
});

game.on('init',function(){
    var geometry = new THREE.BoxGeometry( 10, 10, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
    var cube = new THREE.Mesh( geometry, material );
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
