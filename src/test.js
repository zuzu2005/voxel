var Game = require("./game");
var kb = require("kb-controls");
var meshers = require("voxel").meshers;

require("whatwg-fetch");

var voxparser = require("./vox").Parser;

var game = new Game({enableStats:true,
    enableLight:true,
    enableShaodw:true});

var scene = game.scene;

game.on('init',function(){
    var geometry = new THREE.PlaneBufferGeometry( 100, 100, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    var planeMaterial = new THREE.MeshPhongMaterial( { color: 0xffdd99 } );
    var plane = new THREE.Mesh( geometry, planeMaterial );
    plane.receiveShadow = true;
    this.scene.add( plane );
    fetch('vox/3x3x3.vox').then(function(response){
        return response.arrayBuffer();
    }).then(function(req){
        var vox = voxparser(req);
        var dims = vox.getModelSize(0);
        var volume = vox.getVolume(0);
        var mesh = meshers.culled(volume,dims);
        var geo = new THREE.Geometry();
        for(let i = 0;i<mesh.vertices.length;i++){
            var v = mesh.vertices[i];
            geo.vertices.push(new THREE.Vector3(v[0],v[1],v[2]));
        }
        for(let i = 0;i<mesh.faces.length;i++){
            var f = mesh.faces[i];
            var c = new THREE.Color(0x0000ff);
            var n = undefined;
            geo.faces.push(new THREE.Face3(f[0],f[1],f[2]));
            geo.faces.push(new THREE.Face3(f[0],f[2],f[3]));
        }
        geo.computeFaceNormals ();
        var m = new THREE.Mesh(geo,planeMaterial);
        m.castShadow = true;
        scene.add(m);
    }).catch(function(err){
        console.log(err);
    });    
});

game.run();
