'use strict';


var Config = {
    imgTilePaths    : new Array(),                  // Terrain tiles paths
    run             : initScene,                    // run app based on config
    myPos           : { 'x': 0, 'y': 2, 'z': 0},
    lastPosition    : new Array(),
    heightScale     : 400.0,
    currentTile     : -1,
    frustum         : null,
    renderer        : null,
    scene           : null,
    camera          : null,
    yawObject       : null,
    pitchObject     : null,
    direct          : null,
    clock           : new THREE.Clock(),
    morphs          : [],
    sprite1         : null,
    sprite2         : null,
    sprite3         : null,
    sprite4         : null,
    sprite5         : null,
    sprite6         : null,
    controls        : null,
    time            : Date.now(),
    objects         : [],
    _leaves         : new Array(),
    _trees          : new Array(),
    _gems           : new Array(),
    _grass          : new Array(),
    skyUniforms     : null,
    Sea             : null,
    SeaMesh         : null,
    Sun             : null, 
    Sunlight        : null, 
    lensFlare       : null,
    grassMeshes     : [], 
    grassMaterial   : null,
    grassHeight     : 5, 
    grassWidth      : 2,
    grassCount      : 6,
    divisor         : 2,
    worldWidth      : 512,
    worldDepth      : 512,
    rendererStats   : null,
    lastheight      : -1,
    underwaterInterval : false,
    moveForward     : null, 
    moveLeft        : null,
    moveBackward    : null,
    moveRight       : null,
    go              : null,
    raven           : false,
    tr              : false,
    interval        : false,
    soundsea1       : null,
    soundsea2       : null,
    soundsea3       : null,
    soundsea4       : null,
    die             : false,
    pos             : new Array(),
    Tmodels         : [],
    wep             : null,
    attack          : false,
    d               : true,
    sky             : null,
    FizzyText       : null,
    ctext           : null,
    collectedGems   : 0,
    lt              : 0,
    loadI           : null,
    daes            : [],
    loaded          : [],
    skins           : [],
    mesh1s          : [],
    t               : 0,
    emitter         : null, 
    particleGroup   : null,
    character       : null,
    sound1          : null,
    soundattack1    : null
}

var yawObject = null;
var pitchObject = null;
var direct = null;
var objects = null;
var clock = new THREE.Clock();
var morphs = [];
var sprite1 = null;
var sprite2 = null;
var sprite3 = null;
var sprite4 = null;
var sprite5 = null;
var sprite6 = null;
var controls = null;
var time = Date.now();
var objects = [];
var _leaves = new Array();
var _trees = new Array();
var _gems = new Array();
var _grass = new Array();
var skyUniforms = null;
var Sea, SeaMesh, Sun, Sunlight, lensFlare;
var grassMeshes = [], grassMaterial;
var grassHeight = 5, grassWidth = 2;
var grassCount = 6;
var divisor = 2;
var worldWidth = 512, worldDepth = 512;
var rendererStats;
var lastheight=-1;
var underwaterInterval =false;
var moveForward, moveLeft, moveBackward, moveRight, moveUp, moveDown = false;
var go = null;
var raven=false;
var tr=false;
var interval = false;
var soundsea1;
var soundsea2;
var soundsea3;
var soundsea4;
var die = false;
var pos = new Array();
var Tmodels =[];
var wep = null;
var attack = false;
var d = true;
var sky;
var FizzyText,ctext =null
var collectedGems=0;
var lt=0;
var loadI=null;
var daes=[];
var loaded=[];
var skins= [];
var mesh1s = [];
var t=0;
var emitter, particleGroup;
var character;
var sound1,soundattack1=null;


function Application(conf){
    this.Config = conf;         // load configuration
    this.run = this.Config.run; // app method routing
    this.run();                 // start app !
}

// PREVENT KEYDOWN PROPAGATION
window.onkeydown = function(e) { 
    return !(e.keyCode == 32);
};

var app = new Application(Config);

