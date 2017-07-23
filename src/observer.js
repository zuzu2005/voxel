/**
 * 实现一个简单世界漫游视角控制
 * wsad控制上下左右，鼠标控制方向。
 */
var kb = require("kb-controls");
var interact = require("interact");
var Stream = require('stream').Stream;

module.exports = Observer;

function Observer(game){
    // 初始化输入
    this.game = game;
    this.kb = kb({
        '<left>': 'cam_left',
        '<right>': 'cam_right',
        '<up>': 'cam_up',
        '<down>': 'cam_down',
        'W': 'forward',
        'A': 'left',
        'S': 'backward',
        'D': 'right',
        '<space>':'jump',
        '<mouse 1>': 'fire'});
    this.interact = interact( game.renderer.domElement )
    .on('attain',this.onControlChange.bind(this,true))
    .on('release',this.onControlChange.bind(this,false))
    .on('release',this.onControlChange.bind(this));

    /**
     * 默认摄像机的上是Y轴,右边是X轴。将Euler序该成ZXY,这样rotation.z就表示面向
     * rotation.x代表俯仰，Y不使用。并且将俯仰角限制在[-PI/4,PI/4]
     */
    this.pos = game.camera.position;
    this.euler = game.camera.rotation;
    this.euler.order = 'ZXY';
    var STEP = (1)/1;
    var M = (Math.PI/180);
    /**
     * 根据当前状态更新摄像机
     */
    game.on('update',(function(dt){
        var k = this.kb;
        var step = 0;
        var xstep = 0;
        var zstep = 0;
        if(k.forward){
            step = STEP;
        }
        if(k.backward){
            step = -STEP;
        }
        if(k.left){
            xstep = -STEP;
        }
        if(k.right){
            xstep = STEP;
        }
        if(k.jump){
            zstep = STEP;
        }
        if(k.cam_left){
            this.euler.z += M;
        }
        if(k.cam_right){
            this.euler.z -= M;
        }
        if(k.cam_up){
            this.euler.x += M;
        }
        if(k.cam_down){
            this.euler.x -= M;
        }
        var xyStep = step*Math.sin(this.euler.x);
        this.pos.x -= xyStep*Math.sin(this.euler.z);
        this.pos.y += xyStep*Math.cos(this.euler.z);
        this.pos.z -= step*Math.cos(this.euler.x);
        //左右平移
        this.pos.x += xstep*Math.sin(this.euler.z+Math.PI/2);
        this.pos.y -= xstep*Math.cos(this.euler.z+Math.PI/2);
        //向上
        this.pos.z += zstep;

        this.euler.x = Math.min(this.euler.x,Math.PI);
        this.euler.x = Math.max(this.euler.x,0);
    }).bind(this));
}

Observer.prototype.onControlChange = function(gained,stream){
    if(!gained && !this.optout){
        this.kb.disable();
        return;
    }
    this.kb.enable();
    stream.pipe(this.createWriteRotationStream());
};

Observer.prototype.onControlOptOut = function() {
  this.optout = true
};

Observer.prototype.createWriteRotationStream = function(){
    var stream = new Stream();
    var M = (Math.PI/180)/30;
    stream.write = write.bind(this);
    stream.end = end.bind(this);
    stream.writable = true;
    return stream;

    function write(changes){ //dx,dy,dt
        this.euler.z -= changes.dx*M;
        this.euler.x -= changes.dy*M;
        this.euler.x = Math.min(this.euler.x,Math.PI);
        this.euler.x = Math.max(this.euler.x,0);
    }
    function end(deltas){
    }
};
