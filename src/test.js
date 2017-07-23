var Game = require("./game");
var kb = require("kb-controls");
var meshers = require("voxel").meshers;

require("whatwg-fetch");

var voxparser = require("./vox").Parser;

var game = new Game({enableStats:true,
    enableAA:true,
    enableLight:true,
    enableShaodw:true});

var scene = game.scene;

function initTest(){
    var vox = {
        file : "3x3x3",
        open : function(){
    fetch(`vox/${this.file}.vox`).then(function(response){
        return response.arrayBuffer();
    }).then(function(req){
        if(this.cur)
            scene.remove(this.cur);
            this.cur = null;

            var vox = voxparser(req);
            var dims = vox.getModelSize(0);
            var volume = vox.getModelVolume(0);
            var pals = vox.pals;
            var mesh = meshers.culled(volume,dims);
            var geo = new THREE.Geometry();
            for(let i = 0;i<mesh.vertices.length;i++){
                var v = mesh.vertices[i];
                geo.vertices.push(new THREE.Vector3(v[0],v[1],v[2]));
            }
            for(let i = 0;i<mesh.faces.length;i++){
                var f = mesh.faces[i];
                var rgba = vox.getPalRGBA(f[4]);
                var c = new THREE.Color(rgba.r,rgba.g,rgba.b);
                var n = undefined;
                geo.faces.push(new THREE.Face3(f[0],f[1],f[2],n,c));
                geo.faces.push(new THREE.Face3(f[0],f[2],f[3],n,c));
            }
            geo.computeFaceNormals ();
            var material = new THREE.MeshLambertMaterial( { color: 0xffffff, morphTargets: true, vertexColors: THREE.FaceColors } );
            var m = new THREE.Mesh(geo,material);
            m.receiveShadow = true;
            m.castShadow = true;
            scene.add(m);
            this.cur = m;
            //将对象放置到屏幕中间
            m.position.x = -dims[0]/2;
            m.position.y = -dims[1]/2;
        }).catch(function(err){
            console.log(this.file+' '+err);
        }); 
        }
    };
    Object.defineProperties(vox,{
        "model":{
            get : function(){
                return this.file;
            },
            set : function(value){
                this.file = value;
                this.open();
            }
        }
    });
    var gui = new dat.GUI();
    var gui_light = gui.addFolder('Light');
    gui_light.add(game.light.position,'x',0,1000);
    gui_light.add(game.light.position,'y',0,1000);
    gui_light.add(game.light.position,'z',10,1000);

    var gui_vox = gui.addFolder('Vox');
    gui_vox.add(vox,'model',['3x3x3','8x8x8','castle',
    'chr_knight','chr_rain','chr_sword','doom','ephtrcy',
    'menger','monu1','monu9','monu10','nature','shelf','teapot',
    'anim/deer','anim/horse','anim/T-Rex','chr/chr_fox',
    'chr/chr_gumi','chr/chr_man','chr/chr_poem']);
    vox.open(vox.model);
}

game.on('init',function(){
    initTest();
    //创建地面
    var geometry = new THREE.PlaneBufferGeometry( 300, 300, 32 );
    //var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    //var material_v = new THREE.MeshLambertMaterial( { color: 0xffaa55, morphTargets: true, vertexColors: THREE.FaceColors } );
    var planeMaterial = new THREE.MeshPhongMaterial( { color: 0xffdd99 } );
    var plane = new THREE.Mesh( geometry, planeMaterial );
    plane.receiveShadow = true;
    this.scene.add( plane );    
    //初始化视角
    this.camera.position.y = -100;
    this.camera.position.z = 200;
    this.camera.rotation.x = Math.PI/6;
});

game.run();
