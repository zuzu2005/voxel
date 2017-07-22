/**
 * parser vox format ArrayBuffer
 */
module.exports.Parser = VoxParser;

function VoxParser(vox){
    var int32buf = new Int32Array(vox);
    if(int32buf[0]!==tag2int('VOX ')){ 
        throw 'invalid .vox format';
    }
    var vox = new Vox(int32buf[1]);
    var mainchunk = new Chunk(int32buf,8);
    if(mainchunk.name==='MAIN'){
        var chunk;
        var module;
        while(chunk = mainchunk.readSubChunk()){
            switch(chunk.name){
                case 'PACK':
                    vox.numModels = chunk.data[0];
                    break;
                case 'SIZE':
                    module = {};
                    module.size_x = chunk.data[0];
                    module.size_y = chunk.data[1];
                    module.size_z = chunk.data[2];
                    break;
                case 'XYZI':{
                    var data = chunk.data; 
                    var num = data[0];
                    var xyzi = [];
                    for(let i = 0;i<num;i++){
                        xyzi.push(data[i+1]);
                    }
                    module.xyzi = xyzi;
                    vox.modules.push(module);
                }
                    break;
                case 'RGBA':{
                    for(let i=0;i<256;i++){
                        vox.pals.push(chunk.data[i]);
                    }
                }
                    break;
                case 'MATT':{
                    vox.matts = vox.matts || new Array(256);
                    var dv = new DataView(chunk.buf,0);
                    var matt = {
                        id : chunk.data[0],
                        materialType : chunk.data[1],
                        materialWeght : dv.getFloat32(2*4),
                        propertyBits : chunk.data[3],
                        normalizedValues : []
                    };
                    if(matt.id >=0 && matt.id < 256)
                        vox.matts[matt.id] = matt;
                    else
                        throw '';
                    var n = chunk.size/4 - 4*4;
                    for(let i=0;i<n;i++){
                        matt.normalizedValues.push(dv.getFloat32((4+i)*4));
                    }
                }
                    break;
                default: throw `Unrecognized tag '${chunk.name}'`;
            }    
        }
    }else{
        throw 'not to exist "MAIN"';
    }
    if(vox.pals.length == 0){
        vox.pals = default_pals;
    }
    return vox;
}

function tag2int(name){
    var v = name.charCodeAt(0);
    v += name.charCodeAt(1)<<8;
    v += name.charCodeAt(2)<<16;
    v += name.charCodeAt(3)<<24;
    return v;
}

function int2tag(i){
    return String.fromCharCode(i&0xff,(i&0xff00)>>8,(i&0xff0000)>>16,i>>24);
}

function Chunk(cbuf,offset){
    var buf = new Int32Array(cbuf.buffer,offset+cbuf.byteOffset);
    this.buf = buf;
    this.name = int2tag(buf[0]);
    this.size = buf[1];
    this.childrenSize = buf[2];
    this.readSubOffset = 0;
    if(this.size>0)
        this.data = new Int32Array(buf.buffer,buf.byteOffset+12,this.size/4);
    if(this.childrenSize>0)
        this.childrenBuf = new Int32Array(buf.buffer,buf.byteOffset+12+this.size,this.childrenSize/4);
}

Chunk.prototype.readSubChunk = function(){
    if(this.childrenSize > this.readSubOffset){
        var chunk = new Chunk(this.childrenBuf,this.readSubOffset);
        this.readSubOffset +=(chunk.size+chunk.childrenSize+12);
        return chunk;
    }else return null;
}

function Vox(version){
    this.version = version;
    this.modules = [];
    this.pals = [];
}

Object.assign(Vox.prototype,{
    getModelNum : function(){
        return this.modules.length;
    },

    getModelSize : function(i){
        return [this.modules[i].size_x,this.modules[i].size_y,this.modules[i].size_z];
    },

    getModelMesh : function(i){
        if(!THREE)throw 'You must import three.js';

    }
});

var default_pals = [
    0x00000000, 0xffffffff, 0xffccffff, 0xff99ffff, 0xff66ffff, 0xff33ffff, 0xff00ffff, 0xffffccff, 0xffccccff, 0xff99ccff, 0xff66ccff, 0xff33ccff, 0xff00ccff, 0xffff99ff, 0xffcc99ff, 0xff9999ff,
	0xff6699ff, 0xff3399ff, 0xff0099ff, 0xffff66ff, 0xffcc66ff, 0xff9966ff, 0xff6666ff, 0xff3366ff, 0xff0066ff, 0xffff33ff, 0xffcc33ff, 0xff9933ff, 0xff6633ff, 0xff3333ff, 0xff0033ff, 0xffff00ff,
	0xffcc00ff, 0xff9900ff, 0xff6600ff, 0xff3300ff, 0xff0000ff, 0xffffffcc, 0xffccffcc, 0xff99ffcc, 0xff66ffcc, 0xff33ffcc, 0xff00ffcc, 0xffffcccc, 0xffcccccc, 0xff99cccc, 0xff66cccc, 0xff33cccc,
	0xff00cccc, 0xffff99cc, 0xffcc99cc, 0xff9999cc, 0xff6699cc, 0xff3399cc, 0xff0099cc, 0xffff66cc, 0xffcc66cc, 0xff9966cc, 0xff6666cc, 0xff3366cc, 0xff0066cc, 0xffff33cc, 0xffcc33cc, 0xff9933cc,
	0xff6633cc, 0xff3333cc, 0xff0033cc, 0xffff00cc, 0xffcc00cc, 0xff9900cc, 0xff6600cc, 0xff3300cc, 0xff0000cc, 0xffffff99, 0xffccff99, 0xff99ff99, 0xff66ff99, 0xff33ff99, 0xff00ff99, 0xffffcc99,
	0xffcccc99, 0xff99cc99, 0xff66cc99, 0xff33cc99, 0xff00cc99, 0xffff9999, 0xffcc9999, 0xff999999, 0xff669999, 0xff339999, 0xff009999, 0xffff6699, 0xffcc6699, 0xff996699, 0xff666699, 0xff336699,
	0xff006699, 0xffff3399, 0xffcc3399, 0xff993399, 0xff663399, 0xff333399, 0xff003399, 0xffff0099, 0xffcc0099, 0xff990099, 0xff660099, 0xff330099, 0xff000099, 0xffffff66, 0xffccff66, 0xff99ff66,
	0xff66ff66, 0xff33ff66, 0xff00ff66, 0xffffcc66, 0xffcccc66, 0xff99cc66, 0xff66cc66, 0xff33cc66, 0xff00cc66, 0xffff9966, 0xffcc9966, 0xff999966, 0xff669966, 0xff339966, 0xff009966, 0xffff6666,
	0xffcc6666, 0xff996666, 0xff666666, 0xff336666, 0xff006666, 0xffff3366, 0xffcc3366, 0xff993366, 0xff663366, 0xff333366, 0xff003366, 0xffff0066, 0xffcc0066, 0xff990066, 0xff660066, 0xff330066,
	0xff000066, 0xffffff33, 0xffccff33, 0xff99ff33, 0xff66ff33, 0xff33ff33, 0xff00ff33, 0xffffcc33, 0xffcccc33, 0xff99cc33, 0xff66cc33, 0xff33cc33, 0xff00cc33, 0xffff9933, 0xffcc9933, 0xff999933,
	0xff669933, 0xff339933, 0xff009933, 0xffff6633, 0xffcc6633, 0xff996633, 0xff666633, 0xff336633, 0xff006633, 0xffff3333, 0xffcc3333, 0xff993333, 0xff663333, 0xff333333, 0xff003333, 0xffff0033,
	0xffcc0033, 0xff990033, 0xff660033, 0xff330033, 0xff000033, 0xffffff00, 0xffccff00, 0xff99ff00, 0xff66ff00, 0xff33ff00, 0xff00ff00, 0xffffcc00, 0xffcccc00, 0xff99cc00, 0xff66cc00, 0xff33cc00,
	0xff00cc00, 0xffff9900, 0xffcc9900, 0xff999900, 0xff669900, 0xff339900, 0xff009900, 0xffff6600, 0xffcc6600, 0xff996600, 0xff666600, 0xff336600, 0xff006600, 0xffff3300, 0xffcc3300, 0xff993300,
	0xff663300, 0xff333300, 0xff003300, 0xffff0000, 0xffcc0000, 0xff990000, 0xff660000, 0xff330000, 0xff0000ee, 0xff0000dd, 0xff0000bb, 0xff0000aa, 0xff000088, 0xff000077, 0xff000055, 0xff000044,
	0xff000022, 0xff000011, 0xff00ee00, 0xff00dd00, 0xff00bb00, 0xff00aa00, 0xff008800, 0xff007700, 0xff005500, 0xff004400, 0xff002200, 0xff001100, 0xffee0000, 0xffdd0000, 0xffbb0000, 0xffaa0000,
	0xff880000, 0xff770000, 0xff550000, 0xff440000, 0xff220000, 0xff110000, 0xffeeeeee, 0xffdddddd, 0xffbbbbbb, 0xffaaaaaa, 0xff888888, 0xff777777, 0xff555555, 0xff444444, 0xff222222, 0xff111111
];