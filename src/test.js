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
    mesh.add( mesh2 );/*
    var mesh3 = new THREE.Mesh(
        new THREE.SphereBufferGeometry( 5, 16, 8 ),
        new THREE.MeshBasicMaterial( { color: 0x0000ff, wireframe: true } )
    );
    mesh3.position.z = 150;
    cameraRig.add( mesh3 );*/
                                                
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 100;
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
    var gui = new dat.GUI();
    var camera = gui.addFolder("camera");
    camera.add(this.camera.rotation,'x',-10,10).step(0.1);
    camera.add(this.camera.rotation,'y',-10,10).step(0.1);
    camera.add(this.camera.rotation,'z',-10,10).step(0.1);
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
