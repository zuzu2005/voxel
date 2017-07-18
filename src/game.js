/**
 * 初始化一个THREE环境，包括创建场景，摄像机，灯光等等...
 */
module.exports = Game;

/**
 * 构造函数
 * @param {*} opts 
 * canvas : 使用给定的节点
 * width,height : 固定的宽高，如果不提供
 * maxFrameSize : 最大的帧尺寸，帧尺寸指的是渲染真的尺寸，过大的尺寸导致低帧率
 */
function Game(opts){
    this.opts = opts;
    this.scene = new THREE.Scene();    
    if(opts.canvas){
        this.renderer = new THREE.WebGLRenderer({canvas:opts.canvas});
    }else{
        this.renderer = new THREE.WebGLRenderer();
        document.body.appendChild( this.renderer.domElement );
    }
    //如果指定了尺寸就是用，否则和屏幕尺寸保持一致
    var width;
    var height;    
    if(opts.width && opts.height){
        width = opts.width;
        height = opts.height;
    }else{
        width = window.innerWidth;
        height = window.innerHeight;
        window.onresize = function(){
            this.setSize(window.innerWidth,window.innerHeight);
        }.bind(this);
    }
    this.camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
    this.setSize(width,height);
}

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
};

/**
 * 渲染循环
 */
Game.prototype.run=function(){
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    this.scene.add( cube );

    this.camera.position.z = 5;
    console.log('run...');
    var self = this;
    var animate = function(){
        requestAnimationFrame( animate );
        if(self==this)
            this.renderer.render( this.scene, this.camera );
    }.bind(this);
    animate();    
};

/**
 * 加入事件
 */
Game.prototype.on=function(){

};