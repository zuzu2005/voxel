/**
 * 实现一个简单世界漫游视角控制
 * wsad控制上下左右，鼠标控制方向。
 */
var kb = require("kb-controls");
var interact = require("interact");
var control = require("./control");
var physical = require("./physical");

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
        'A': 'left',
        'S': 'backward',
        'D': 'right',
        '<space>':'jump',
        '<mouse 1>': 'fire'});
    this.interact = interact( game.renderer.domElement )
    .on('attain',this.onControlChange.bind(this,true))
    .on('release',this.onControlChange.bind(this,false))
    .on('release',this.onControlChange.bind(this));
    this.controls = control(this.kb,{seep:0});
    var obj = physical(game.camera,[]);
    game.on('update',dt=>obj.tick(dt));
    this.controls.target(obj);
    /**
     * 根据当前状态更新摄像机
     */
    game.on('update',(function(dt){
        this.controls.tick(dt);
    }).bind(this));
}

Observer.prototype.onControlChange = function(gained,stream){
    if(!gained && !this.optout){
        this.kb.disable();
        return;
    }
    this.kb.enable();
    stream.pipe(this.controls.createWriteRotationStream());
}

Observer.prototype.onControlOptOut = function() {
  this.optout = true
}
