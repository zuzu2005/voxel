var Game = require("./game");
var kb = require("kb-controls");

var game = new Game();

var cube;
game.on('init',function(){
    var geometry = new THREE.BoxGeometry( 10, 10, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    cube = new THREE.Mesh( geometry, material );
    this.scene.add( cube );

    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 10;
    this.camera.rotation.x = 0;
    this.camera.rotation.y = 0;
    this.camera.rotation.z = 0;

    this.kb = kb({
        '<left>': 'strafe_left',
        '<right>': 'strafe_right',
        '<up>': 'up',
        '<down>': 'down',
        'W': 'forward',
        'A': 'left',
        'S': 'backward',
        'D': 'right',
        '<space>':'jump',
        '<mouse 1>': 'fire'});

    console.log('run...');
});

game.on('update',function(dt){
    var cam = this.camera.rotation;
    var pos = this.camera.position;
    var kb = this.kb;
    var da = Math.PI/180;
    if(kb.forward){
        cube.rotation.x += da;
    }
    if(kb.backward){
        cube.rotation.x -= da;
    }
    if(kb.left){
    }
    if(kb.right){
    }
    if(kb.strafe_left){
        cam.y += da;
    }
    if(kb.strafe_right){
        cam.y -= da;
    }
    if(kb.up){
        cam.x += da;
        cam.x = Math.min(cam.x,Math.PI);
    }
    if(kb.down){
        cam.x -= da;
        cam.x = Math.max(cam.x,0);
    }
});
game.run();

console.log('hello world!');
