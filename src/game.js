/**
 * 初始化一个THREE环境，包括创建场景，摄像机，灯光等等...
 */
var EventEmitter = require("events");
var inherits = require("inherits");
var Observer = require("./observer");

module.exports = Game;

/**
 * 构造函数
 * @param {*} opts 
 * canvas : 使用给定的节点
 * width,height : 固定的宽高，如果不提供
 * maxFrameSize : 最大的帧尺寸，帧尺寸指的是渲染真的尺寸，过大的尺寸导致低帧率
 * enableStats  : 打开帧率检测小窗口
 * enableLight  : 打开默认灯
 * enableShaodw : 打开阴影
 */
function Game(opts){
    this.opts = opts || {};
    this.scene = new THREE.Scene();    
    if(this.opts.canvas){
        this.renderer = new THREE.WebGLRenderer({canvas:opts.canvas});
    }else{
        this.renderer = new THREE.WebGLRenderer();
        document.body.appendChild( this.renderer.domElement );
    }
    //如果指定了尺寸就是用，否则和屏幕尺寸保持一致
    var width;
    var height;    
    if(this.opts.width && this.opts.height){
        width = opts.width;
        height = opts.height;
    }else{
        width = window.innerWidth;
        height = window.innerHeight;
        window.onresize = function(){
            this.setSize(window.innerWidth,window.innerHeight);
        }.bind(this);
    }
    this.camera = new THREE.PerspectiveCamera( 30, width / height, 0.1, 1000 );
    this.setSize(width,height);
    //这里加入帧率检测
    if(this.opts.enableStats){
        this.stats = new Stats();
        document.body.appendChild( this.stats.dom );
    }
    //初始化灯
    if(this.opts&&opts.enableLight){
        this.ambient = new THREE.AmbientLight( 0x444444 );
        this.scene.add(this.ambient);    
        var light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 2 );
        this.light = light;
        light.position.set( 150, 150, 200 );
        light.target.position.set( 0, 0, 0 );
        light.castShadow = true;
        light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 120, 2500 ) );
        light.shadow.bias = 0.0001;
        light.shadow.mapSize.width = opts.SHADOW_MAP_WIDTH || 1024;
        light.shadow.mapSize.height = opts.SHADOW_MAP_HEIGHT || 1024;
        this.scene.add( light );
    }
    //打开阴影
    if(this.opts&&opts.enableShaodw){
        this.renderer.shadowMap.enabled = true;
        this.renderer.autoClear = false;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
    }
}

inherits(Game,EventEmitter);

/**
 * 改变尺寸
 */
Game.prototype.setSize = function(w,h){
    this.renderer.domElement.style.width = w+'px';
    this.renderer.domElement.style.height = h+'px';
    this.camera.aspect = w/h;
    this.camera.updateProjectionMatrix();
    if(this.opts.maxFrameSize && w > this.opts.maxFrameSize){
        this.renderer.setSize( this.opts.maxFrameSize,this.opts.maxFrameSize*h/w,false );
    }else{
        this.renderer.setSize( w,h,false );
    }
    this.emit('resize',w,h);
};

/**
 * 渲染循环
 */
Game.prototype.run=function(){
    this.emit('init');
    //如果用户没提供控制镜头的对象，这里创建默认的
    if(!this.observer){
        this.observer = new Observer(this);        
    }
    var t = Date.now()-1;
    var animate = function(){
        requestAnimationFrame( animate );
        if(this.stats)this.stats.update();
        var nt = Date.now();
        if(!this.paused){
            this.emit('update',nt - t);
            this.renderer.render( this.scene, this.camera );
            if(this.lightShadowMapViewer){
                this.lightShadowMapViewer.render(this.renderer);
            }
        }
        t = nt;
    }.bind(this);
    animate();    
};

/**
 * 暂停主循环
 */
Game.prototype.pause=function(){
    this.paused = true;
}

/**
 * 恢复主循环
 */
Game.prototype.resume=function(){
    this.paused = false;
}