var Game = require("./game");
var kb = require("kb-controls");
require("whatwg-fetch");

var voxparser = require("./vox").Parser;

var game = new Game({enableStats:true});
/*
fetch('vox/3x3x3.vox').then(function(response){
    return response.arrayBuffer();
}).then(function(req){
    var vox = voxparser(req);
    console.log(vox);
}).catch(function(err){
    console.log(err);
});
*/
game.on('init',function(){
});

game.run();
