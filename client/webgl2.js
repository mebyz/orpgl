'use strict';

var Config = {
    imgTilePaths    : [],                           // Terrain tiles paths
    run             : initScene,                    // run app based on config
    myPos           : { 'x': 0, 'y': 2, 'z': 0},
    lastPosition    : [],
    heightScale     : 400.0,
    currentTile     : -1,
    frustum         : null,
    renderer        : null,
    scene           : null,
    camera          : null,
    yawObject       : null,
    pitchObject     : null,
    clock           : new THREE.Clock(),
    controls        : null,
    nature          : {
        trees       : []
    },
    artefacts       : [],
    avatars         : [],
    skyUniforms     : null,
    Sea             : null,
    SeaMesh         : null,
    Sun             : null, 
    Sunlight        : null, 
    lensFlare       : null,
    lastheight      : -1,
    underwaterInterval : false,
    raven           : false,
    tr              : false,
    sounds          : [],
    die             : false,
    nature_models         : [],
    wep             : null,
    attack          : false,
    sky             : null,
    ctext           : null,
    collectedItems  : 0,
    lazyloaded      : 0,
    emitter         : null, 
    particleGroup   : null,
    character       : null,
    sound1          : null,
    soundattack1    : null
}
var interval;
function Application(conf){
    this.Config = conf;         // load configuration
    this.run = this.Config.run; // app method routing
    this.run();                 // start app !
}

window.onkeydown = function(e) { 
    return !(e.keyCode == 32);
};

var app = new Application(Config);

