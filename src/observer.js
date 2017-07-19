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
        '<left>': 'strafe_left',
        '<right>': 'strafe_right',
        '<up>': 'forward',
        '<down>': 'backward',
        'W': 'forward',
        'A': 'strafe_left',
        'S': 'backward',
        'D': 'strafe_right',
        '<mouse 1>': 'fire'});
    this.interact = interact( game.renderer.domElement )
    .on('attain',this.onControlChange.bind(this,true))
    .on('release',this.onControlChange.bind(this,false))
    .on('release',this.onControlChange.bind(this));

    /**
     * 根据当前状态更新摄像机
     */
    game.on('update',function(){

    });
}

Observer.prototype.onControlChange = function(gained,stream){
    if(!gained && !this.optout){
        this.kb.disable();
        return;
    }
    this.kb.enable();
    stream.pipe(this.createControlStream());
}

Observer.prototype.onControlOptOut = function() {
  this.optout = true
}

/**
 * 创建一个写入流，用来控制摄像镜头
 */
Observer.prototype.createControlStream = function(){
    var stream = new Stream();
    stream.writable = true;
    stream.write = function(changes){
        console.log(changes);
    };
    stream.end = function(deltas){
        //鼠标切除
    };
    return stream;
}