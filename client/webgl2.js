
 var Bird = function () {

    var scope = this;

    THREE.Geometry.call( this );

    v(   0.5,   0.0,   0.0 );
    v( - 0.5, - 0.2,   0.1 );
    v( - 0.5,   0.0,   0.0 );
    v( - 0.5, - 0.2, - 0.1 );

    v(   0.0,   0.2, - 0.6 );
    v(   0.0,   0.2,   0.6 );
    v(   0.2,   0.0,   0.0 );
    v( - 0.3,   0.0,   0.0 );

    f3( 0, 2, 1 );
    // f3( 0, 3, 2 );

    f3( 4, 7, 6 );
    f3( 5, 6, 7 );

    this.computeCentroids();
    this.computeFaceNormals();

    function v( x, y, z ) {

        scope.vertices.push( new THREE.Vector3( x, y, z ) );

    }

    function f3( a, b, c ) {

        scope.faces.push( new THREE.Face3( a, b, c ) );

    }

}

Bird.prototype = new THREE.Geometry();
Bird.prototype.constructor = Bird;

var Boid = function() {

                var vector = new THREE.Vector3(),
                _acceleration, _width = 500, _height = 500, _depth = 200, _goal, _neighborhoodRadius = 100,
                _maxSpeed = 4, _maxSteerForce = 0.1, _avoidWalls = false;

                this.position = new THREE.Vector3();
                this.velocity = new THREE.Vector3();
                _acceleration = new THREE.Vector3();

                this.setGoal = function ( target ) {

                    _goal = target;

                }

                this.setAvoidWalls = function ( value ) {

                    _avoidWalls = value;

                }

                this.setWorldSize = function ( width, height, depth ) {

                    _width = width;
                    _height = height;
                    _depth = depth;

                }

                this.run = function ( boids ) {

                    if ( _avoidWalls ) {

                        vector.set( - _width, this.position.y, this.position.z );
                        vector = this.avoid( vector );
                        vector.multiplyScalar( 5 );
                        _acceleration.addSelf( vector );

                        vector.set( _width, this.position.y, this.position.z );
                        vector = this.avoid( vector );
                        vector.multiplyScalar( 5 );
                        _acceleration.addSelf( vector );

                        vector.set( this.position.x, - _height, this.position.z );
                        vector = this.avoid( vector );
                        vector.multiplyScalar( 5 );
                        _acceleration.addSelf( vector );

                        vector.set( this.position.x, _height, this.position.z );
                        vector = this.avoid( vector );
                        vector.multiplyScalar( 5 );
                        _acceleration.addSelf( vector );

                        vector.set( this.position.x, this.position.y, - _depth );
                        vector = this.avoid( vector );
                        vector.multiplyScalar( 5 );
                        _acceleration.addSelf( vector );

                        vector.set( this.position.x, this.position.y, _depth );
                        vector = this.avoid( vector );
                        vector.multiplyScalar( 5 );
                        _acceleration.addSelf( vector );

                    }/* else {

                        this.checkBounds();

                    }
                    */

                    if ( Math.random() > 0.5 ) {

                        this.flock( boids );

                    }

                    this.move();

                }

                this.flock = function ( boids ) {

                    if ( _goal ) {

                        _acceleration.addSelf( this.reach( _goal, 0.005 ) );

                    }

                    _acceleration.addSelf( this.alignment( boids ) );
                    _acceleration.addSelf( this.cohesion( boids ) );
                    _acceleration.addSelf( this.separation( boids ) );

                }

                this.move = function () {

                    this.velocity.addSelf( _acceleration );

                    var l = this.velocity.length();

                    if ( l > _maxSpeed ) {

                        this.velocity.divideScalar( l / _maxSpeed );

                    }

                    this.position.addSelf( this.velocity );
                    _acceleration.set( 0, 0, 0 );

                }

                this.checkBounds = function () {

                    if ( this.position.x >   _width ) this.position.x = - _width;
                    if ( this.position.x < - _width ) this.position.x =   _width;
                    if ( this.position.y >   _height ) this.position.y = - _height;
                    if ( this.position.y < - _height ) this.position.y =  _height;
                    if ( this.position.z >  _depth ) this.position.z = - _depth;
                    if ( this.position.z < - _depth ) this.position.z =  _depth;

                }

                //

                this.avoid = function ( target ) {

                    var steer = new THREE.Vector3();

                    steer.copy( this.position );
                    steer.subVectors( this.position, target );

                    steer.multiplyScalar( 1 / this.position.distanceToSquared( target ) );

                    return steer;

                }

                this.repulse = function ( target ) {

                    var distance = this.position.distanceTo( target );

                    if ( distance < 150 ) {

                        var steer = new THREE.Vector3();

                        steer.subVectors( this.position, target );
                        steer.multiplyScalar( 0.5 / distance );

                        _acceleration.addSelf( steer );

                    }

                }

                this.reach = function ( target, amount ) {

                    var steer = new THREE.Vector3();

                    steer.subVectors( target, this.position );
                    steer.multiplyScalar( amount );

                    return steer;

                }

                this.alignment = function ( boids ) {

                    var boid, velSum = new THREE.Vector3(),
                    count = 0;

                    for ( var i = 0, il = boids.length; i < il; i++ ) {

                        if ( Math.random() > 0.6 ) continue;

                        boid = boids[ i ];

                        distance = boid.position.distanceTo( this.position );

                        if ( distance > 0 && distance <= _neighborhoodRadius ) {

                            velSum.add( this.position,boid.velocity );
                            count++;

                        }

                    }

                    if ( count > 0 ) {

                        velSum.divideScalar( count );

                        var l = velSum.length();

                        if ( l > _maxSteerForce ) {

                            velSum.divideScalar( l / _maxSteerForce );

                        }

                    }

                    return velSum;

                }

                this.cohesion = function ( boids ) {

                    var boid, distance,
                    posSum = new THREE.Vector3(),
                    steer = new THREE.Vector3(),
                    count = 0;

                    for ( var i = 0, il = boids.length; i < il; i ++ ) {

                        if ( Math.random() > 0.6 ) continue;

                        boid = boids[ i ];
                        distance = boid.position.distanceTo( this.position );

                        if ( distance > 0 && distance <= _neighborhoodRadius ) {

                            posSum.addSelf( boid.position );
                            count++;

                        }

                    }

                    if ( count > 0 ) {

                        posSum.divideScalar( count );

                    }

                    steer.subVectors( posSum, this.position );

                    var l = steer.length();

                    if ( l > _maxSteerForce ) {

                        steer.divideScalar( l / _maxSteerForce );

                    }

                    return steer;

                }

                this.separation = function ( boids ) {

                    var boid, distance,
                    posSum = new THREE.Vector3(),
                    repulse = new THREE.Vector3();

                    for ( var i = 0, il = boids.length; i < il; i ++ ) {

                        if ( Math.random() > 0.6 ) continue;

                        boid = boids[ i ];
                        distance = boid.position.distanceTo( this.position );

                        if ( distance > 0 && distance <= _neighborhoodRadius ) {

                            repulse.subVectors( this.position, boid.position );
                            repulse.normalize();
                            repulse.divideScalar( distance );
                            posSum.addSelf( repulse );

                        }

                    }

                    return posSum;

                }

            }
                   var ImprovedNoise = function () {

            var p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,
                 23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,
                 174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,
                 133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,
                 89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,
                 202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,
                 248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,
                 178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,
                 14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,
                 93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];

            for (var i=0; i < 256 ; i++) {

                p[256+i] = p[i];

            }

            function fade(t) {

                return t * t * t * (t * (t * 6 - 15) + 10);

            }

            function lerp(t, a, b) {

                return a + t * (b - a);

            }

            function grad(hash, x, y, z) {

                var h = hash & 15;
                var u = h < 8 ? x : y, v = h < 4 ? y : h == 12 || h == 14 ? x : z;
                return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);

            }

            return {

                noise: function (x, y, z) {

                    var floorX = ~~x, floorY = ~~y, floorZ = ~~z;

                    var X = floorX & 255, Y = floorY & 255, Z = floorZ & 255;

                    x -= floorX;
                    y -= floorY;
                    z -= floorZ;

                    var xMinus1 = x -1, yMinus1 = y - 1, zMinus1 = z - 1;

                    var u = fade(x), v = fade(y), w = fade(z);

                    var A = p[X]+Y, AA = p[A]+Z, AB = p[A+1]+Z, B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;

                    return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z), 
                                    grad(p[BA], xMinus1, y, z)),
                                lerp(u, grad(p[AB], x, yMinus1, z),
                                    grad(p[BB], xMinus1, yMinus1, z))),
                            lerp(v, lerp(u, grad(p[AA+1], x, y, zMinus1),
                                    grad(p[BA+1], xMinus1, y, z-1)),
                                lerp(u, grad(p[AB+1], x, yMinus1, zMinus1),
                                    grad(p[BB+1], xMinus1, yMinus1, zMinus1))));

                }
            }
        }

        var moveForward,moveLeft,moveBackward,moveRight,moveUp,moveDown = false;

        var onKeyDown = function ( event ) {

            //event.preventDefault();
            switch ( event.keyCode ) {

                case 38: /*up*/
                case 87: /*W*/ moveForward = true; break;

                case 37: /*left*/
                case 65: /*A*/ moveLeft = true; break;

                case 40: /*down*/
                case 83: /*S*/ moveBackward = true; break;

                case 39: /*right*/
                case 68: /*D*/ moveRight = true; break;

                case 82: /*R*/ this.moveUp = true; break;
                case 70: /*F*/ this.moveDown = true; break;

                case 81: /*Q*/ freeze = !this.freeze; break;

            }

        };

        var onKeyUp = function ( event ) {

            switch( event.keyCode ) {

                case 38: /*up*/
                case 87: /*W*/ moveForward = false; break;

                case 37: /*left*/
                case 65: /*A*/ moveLeft = false; break;

                case 40: /*down*/
                case 83: /*S*/ moveBackward = false; break;

                case 39: /*right*/
                case 68: /*D*/ moveRight = false; break;

                case 82: /*R*/ moveUp = false; break;
                case 70: /*F*/ moveDown = false; break;

            }

        };
        
        document.addEventListener( 'keydown', onKeyDown , false );
        document.addEventListener( 'keyup', onKeyUp , false );

        var attributesS6 = {
            displacement: {
                type: 'f', // a float
                value: [] // an empty array
            }
        };
        var attributesS7 = {
            displacement2: {
                type: 'f', // a float
                value: [] // an empty array
            }
        };
            
        // now populate the array of attributes
        var valuesS6 = attributesS6.displacement.value;
        // now populate the array of attributes
        var valuesS7 = attributesS7.displacement2.value;
        
        for(var v = 0; v < 128; v++) {
            valuesS6.push(Math.random() * 30);
        }
        for(var v = 0; v < 128; v++) {
            valuesS7.push(Math.random() * 30);
        }
        
        var uniformsS6 = {
            amplitude: {
                type: 'f', // a float
                value: 0
            }
        };
        var uniformsS7 = {
            amplitude2: {
                type: 'f', // a float
                value: 0
            }
        };
        
        var heights = {};

        function getH(x,y){
            x=Math.floor(x);
            y=Math.floor(y);
            if (heights[x] != undefined)
                if (heights[x][y] != undefined)
                    return heights[x][y];
            return 0;
        }
        var container;
        var ground;
        var camera, scene, renderer, objects;
        var particleLight, pointLight,birds, bird;

            var boid, boids;


        var clock = new THREE.Clock();
        var morphs = [];

        var sprite1,uniforms=null;
        var sprite2=null;
        var myPos = { 'x':2,'y':4,'z':5};

var posX= new Array();
var posY= new Array();
        var sphere = null;
    
        init();
        animate();

function loadtrees(loader,branchfactor,levels,leafsprite,iduni,idxstart,idxend,amplitude,previousRender,attributes,displacement,seed,segments,vMultiplier,twigScale,initalBranchLength,lengthFalloffFactor,lengthFalloffPower,clumpMax,clumpMin){
url = 'http://localhost:8080/tree?leaves=0&levels='+levels+'&branchfactor='+branchfactor
if (seed != undefined)
url+='&seed='+seed+'&segments='+segments+'&vMultiplier='+vMultiplier+'&twigScale='+twigScale
//+'&initalBranchLength='+initalBranchLength+'&lengthFalloffFactor='+lengthFalloffFactor+'&lengthFalloffPower='+lengthFalloffPower+'&clumpMax='+clumpMax+'&clumpMin='+clumpMin

loader.load( url, function ( geometry, materials ) {


                var material = materials[ 0 ];
                material.color.setHex( 0xffffff );
                material.ambient.setHex( 0xffffff );

                var faceMaterial = new THREE.MeshFaceMaterial( materials );

                for ( var i = idxstart; i < idxend; i ++ ) {

                    var x = posX[i];
                    var z = posY[i];

                    morph = new THREE.Mesh( geometry, faceMaterial );

                    morph.duration = 1000;

                    morph.time = 1000 * Math.random();

                    var s = THREE.Math.randFloat( 0.00075, 0.001 );
                    morph.scale.set( s, s, s );
                    morph.name="tree"
                    morph.position.set( x, getH(x,z)-0.5, z );
                    morph.rotation.y = THREE.Math.randFloat( -0.25, 0.25 );

                    scene.add( morph );

                    morphs.push( morph );

                }

            });
url = 'http://localhost:8080/tree?leaves=1&levels='+levels+'&branchfactor='+branchfactor
if (seed != undefined)
url+='&seed='+seed+'&segments='+segments+'&vMultiplier='+vMultiplier+'&twigScale='+twigScale
//+'&initalBranchLength='+initalBranchLength+'&lengthFalloffFactor='+lengthFalloffFactor+'&lengthFalloffPower='+lengthFalloffPower+'&clumpMax='+clumpMax+'&clumpMin='+clumpMin

            loader.load( url, function ( geometry, materials ) {


                var material = materials[ 0 ];
                material.color.setHex( 0xffffff );
                material.ambient.setHex( 0xffffff );
                material.alphaTest = 0.5;

                var faceMaterial = new THREE.MeshFaceMaterial( materials );

                for ( var i = idxstart; i < idxend; i ++ ) {

                    var x = posX[i];
                    var z = posY[i];

                    Shaders = {
                        LitAttributeAnimated: {
                            'vertex': ["varying vec2 glTexCoord;",
                    "uniform float "+amplitude+";",
                                       "attribute float "+displacement+";", 
                                       "varying vec3 vNormal;",
                                "void main() {",
                                 "  glTexCoord = uv;",
                                        "vNormal = normal;",
                                        "vec3 newPosition = position + normal * vec3( "+amplitude+" );",
                                  "  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );",
                                "}"



                                ].join("\n"),
                                       
                            'fragment': [           "varying vec2 glTexCoord;",

                               "uniform sampler2D "+leafsprite+";",
                               "uniform sampler2D "+previousRender+";",

                               "void main() {",

                               "    vec3 color = texture2D( "+previousRender+", glTexCoord ).rgb;",

                               "    color += texture2D( "+leafsprite+", glTexCoord ).rgb;",

                               "    gl_FragColor.rgb = color;",
                               "    gl_FragColor.a = 1.0;",

                                "if (gl_FragColor.r < 0.05)",
                               "    discard;",
                                "if (gl_FragColor.g < 0.05)",
                               "    discard;",
                                "if (gl_FragColor.b < 0.05)",
                               "   discard;",
                               
                                "if ((gl_FragColor.r < 0.12)&&(gl_FragColor.r >= 0.1))",
                               "    gl_FragColor.a = 0.5;",
                                "if ((gl_FragColor.g < 0.12)&&(gl_FragColor.g >= 0.1))",
                               "    gl_FragColor.a = 0.5;",
                                "if ((gl_FragColor.b < 0.12)&&(gl_FragColor.b >= 0.1))",
                               "    gl_FragColor.a = 0.5;",

                                       "}"].join("\n")
                        }
                    };

                    var shaderMaterial = new THREE.ShaderMaterial({
                        attributes:     attributes,
                                uniforms: camera.uniforms[iduni],
                        vertexShader:   Shaders.LitAttributeAnimated.vertex,
                        fragmentShader: Shaders.LitAttributeAnimated.fragment
                    });
                    

                    morph2 = new THREE.Mesh( geometry, shaderMaterial );



                    morph2.duration = 1000;

                    morph2.time = 1000 * Math.random();

                    var s = THREE.Math.randFloat( 0.00075, 0.001 );
                    morph2.scale.set( s, s, s );
                    morph2.name="tree"
                    
                    morph2.position.set( x, getH(x,z)-0.5, z );
                    morph2.rotation.y = THREE.Math.randFloat( -0.25, 0.25 );


                    scene.add( morph2 );

                    morphs.push( morph2 );

                }

            } );
}

        function init() {

            sprite1 = THREE.ImageUtils.loadTexture( "branch1.png", null );
            sprite2 = THREE.ImageUtils.loadTexture( "branch2.png", null );
           
            container = document.createElement( 'div' );
            document.body.appendChild( container );

            camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );

            camera.position.set( myPos.x,myPos.y,myPos.z);
            camera.uniforms=new Array();
          camera.uniforms[1]=  {
                        sprite1: { type: "t", value: sprite1 },
                        previousRender: { type: "t", value: null },
                        amplitude: {
                            type: 'f', // a float
                            value: 0
                        }
                    };
          camera.uniforms[2]=  {
                        sprite2: { type: "t", value: sprite2 },
                        previousRender2: { type: "t", value: null },
                        amplitude2: {
                            type: 'f', // a float
                            value: 0
                        }
                    };
            scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2( 0xB4E4F4, 0.0025 );


                birds = [];
                boids = [];

                for ( var i = 0; i < 1; i ++ ) {

                    boid = boids[ i ] = new Boid();
                    boid.position.x = Math.random() * 400 - 200;
                    boid.position.y = 0;
                    boid.position.z = Math.random() * 400 - 200;
                    boid.velocity.x = Math.random() * 2 - 1;
                    boid.velocity.y = Math.random() * 2 - 1;
                    boid.velocity.z = Math.random() * 2 - 1;
                    boid.setAvoidWalls( true );
                    boid.setWorldSize( 30, 30, 30 );

                    bird = birds[ i ] = new THREE.Mesh( new Bird(), new THREE.MeshBasicMaterial( { color:Math.random() * 0xffffff } ) );
                    bird.phase = Math.floor( Math.random() * 62.83 );
                    bird.position = boids[ i ].position;
                    bird.doubleSided = true;
                    // bird.scale.x = bird.scale.y = bird.scale.z = 10;
                    scene.add( bird );


                }
// set up the sphere vars
var radius = 5,
    segments = 16,
    rings = 16;
var sungeo =new THREE.SphereGeometry(
    radius,
    segments,
    rings);

sungeo.x=0;
sungeo.y=0;
sungeo.z=0;
// create the sphere's material
var sphereMaterial =
  new THREE.MeshLambertMaterial(
    {
      color: 0xCC0000
    });
// create a new mesh with
// sphere geometry - we will cover
// the sphereMaterial next!
sphere = new THREE.Mesh(

  sungeo,

  sphereMaterial);

// add the sphere to the scene
scene.add(sphere);


            var loader = new THREE.JSONLoader();
            for ( var i = 0; i <500; i ++ ) {

                // random placement in a grid

                posX[i] = THREE.Math.randFloatSpread( 256 );
                posY[i] = THREE.Math.randFloatSpread( 256 );
            }

            var waterWidth = 1024, waterDepth = 1024;
            var worldWidth = 512, worldDepth = 512,
            data = generateHeight( worldWidth, worldDepth );
            data2 = generateHeight( waterWidth, waterDepth );

            var geometry = new THREE.PlaneGeometry( 512, 512, worldWidth - 1, worldDepth - 1 );
            geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

            for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {

                geometry.vertices[ i ].x =geometry.vertices[ i ].x;
                geometry.vertices[ i ].z =geometry.vertices[ i ].z;
                geometry.vertices[ i ].y = data[ i ]/10-10;
                
                if (heights[Math.floor(geometry.vertices[ i ].x)] == undefined)
                heights[""+Math.floor(geometry.vertices[ i ].x)] = {};
                heights[""+Math.floor(geometry.vertices[ i ].x)][""+Math.floor(geometry.vertices[ i ].z)]=geometry.vertices[ i ].y;
            
            }

            var floorTexture = new THREE.ImageUtils.loadTexture( 'texture.jpg' );
            floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
            floorTexture.repeat.set( 10, 10 );


            texture = new THREE.Texture( generateTexture( data, worldWidth, worldDepth ), new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping );
            texture.needsUpdate = true;

            ground = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial(
                                                                            {
                                                                            "map": floorTexture
                                                                            }));
            scene.add( ground );
            loadtrees(loader,3.4,5,'sprite1',1,0,49,"amplitude","previousRender",attributesS6,"displacement"   );
            loadtrees(loader,6,20,'sprite2',2,50,99,"amplitude2","previousRender2",attributesS7,"displacement2");
            loadtrees(loader,7,10,'sprite2',2,100,199,"amplitude2","previousRender2",attributesS7,"displacement2",267,8,0.6,0.7,0.26,0.94,0.7,0.556,0.404);
            loadtrees(loader,5,30,'sprite2',2,200,399,"amplitude2","previousRender2",attributesS7,"displacement2",300,4,0.3,0.7,0.26,0.9,0.3,0.15,0.404);
            loadtrees(loader,8,60,'sprite2',2,400,500,"amplitude2","previousRender2",attributesS7,"displacement2",540,10,0.9,0.7,0.2,0.4,0.7,0.556,0.404);
/*
            loader.load( 'http://localhost:8080/tree?leaves=0', function ( geometry, materials ) {


                var material = materials[ 0 ];
                material.color.setHex( 0xffffff );
                material.ambient.setHex( 0xffffff );

                var faceMaterial = new THREE.MeshFaceMaterial( materials );

                for ( var i = 0; i < 50; i ++ ) {

                    var x = posX[i];
                    var z = posY[i];

                    morph = new THREE.Mesh( geometry, faceMaterial );

                    morph.duration = 1000;

                    morph.time = 1000 * Math.random();

                    var s = THREE.Math.randFloat( 0.00075, 0.001 );
                    morph.scale.set( s, s, s );
                    morph.name="tree"
                    morph.position.set( x, getH(x,z)-0.5, z );
                    morph.rotation.y = THREE.Math.randFloat( -0.25, 0.25 );

                    scene.add( morph );

                    morphs.push( morph );

                }

            });
            loader.load( 'http://localhost:8080/tree?leaves=1', function ( geometry, materials ) {


                var material = materials[ 0 ];
                material.color.setHex( 0xffffff );
                material.ambient.setHex( 0xffffff );
                material.alphaTest = 0.5;

                var faceMaterial = new THREE.MeshFaceMaterial( materials );

                for ( var i = 0; i < 50; i ++ ) {

                    var x = posX[i];
                    var z = posY[i];

                    Shaders = {
                        LitAttributeAnimated: {
                            'vertex': ["varying vec2 glTexCoord;",
                    "uniform float amplitude;",
                                       "attribute float displacement;", 
                                       "varying vec3 vNormal;",
                                "void main() {",
                                 "  glTexCoord = uv;",
                                        "vNormal = normal;",
                                        "vec3 newPosition = position + normal * vec3( amplitude );",
                                  "  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );",
                                "}"



                                ].join("\n"),
                                       
                            'fragment': [           "varying vec2 glTexCoord;",

                               "uniform sampler2D sprite1;",
                               "uniform sampler2D previousRender;",

                               "void main() {",

                               "    vec3 color = texture2D( previousRender, glTexCoord ).rgb;",

                               "    color += texture2D( sprite1, glTexCoord ).rgb;",

                               "    gl_FragColor.rgb = color;",
                               "    gl_FragColor.a = 1.0;",

                                "if (gl_FragColor.r < 0.1)",
                               "    discard;",
                                "if (gl_FragColor.g < 0.1)",
                               "    discard;",
                                "if (gl_FragColor.b < 0.1)",
                               "   discard;",
                               
                                "if ((gl_FragColor.r < 0.12)&&(gl_FragColor.r >= 0.1))",
                               "    gl_FragColor.a = 0.5;",
                                "if ((gl_FragColor.g < 0.12)&&(gl_FragColor.g >= 0.1))",
                               "    gl_FragColor.a = 0.5;",
                                "if ((gl_FragColor.b < 0.12)&&(gl_FragColor.b >= 0.1))",
                               "    gl_FragColor.a = 0.5;",

                                       "}"].join("\n")
                        }
                    };
           

                    var shaderMaterial = new THREE.ShaderMaterial({
                        attributes:     attributesS6,
                                uniforms: camera.uniforms1,
                        vertexShader:   Shaders.LitAttributeAnimated.vertex,
                        fragmentShader: Shaders.LitAttributeAnimated.fragment
                    });
                    

                    morph2 = new THREE.Mesh( geometry, shaderMaterial );



                    morph2.duration = 1000;

                    morph2.time = 1000 * Math.random();

                    var s = THREE.Math.randFloat( 0.00075, 0.001 );
                    morph2.scale.set( s, s, s );
                    morph2.name="tree"
                    
                    morph2.position.set( x, getH(x,z)-0.5, z );
                    morph2.rotation.y = THREE.Math.randFloat( -0.25, 0.25 );


                    scene.add( morph2 );

                    morphs.push( morph2 );

                }

            } );
*/
            scene.add( new THREE.AmbientLight( 0xffffff ) );
            var directionalLight = new THREE.DirectionalLight(0xffffff);
            directionalLight.position.set(1, 1, 1).normalize();
            scene.add(directionalLight);

            renderer = new THREE.WebGLRenderer();
            renderer.setSize( window.innerWidth, window.innerHeight );
            renderer.setClearColor(new THREE.Color(0xB4E4F4));
            container.appendChild( renderer.domElement );

            window.addEventListener( 'resize', onWindowResize, false );

        }

        function generateHeight( width, height ) {

            var size = width * height, data = new Float32Array( size ),
            perlin = new ImprovedNoise(), quality = 1, z = Math.random() * 100;

            for ( var i = 0; i < size; i ++ ) {

                data[ i ] = 0

            }

            for ( var j = 0; j < 4; j ++ ) {

                for ( var i = 0; i < size; i ++ ) {

                    var x = i % width, y = ~~ ( i / width );
                    data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );


                }

                quality *= 5;

            }

            return data;

        }

        function generateTexture( data, width, height ) {

            var canvas, canvasScaled, context, image, imageData,
            level, diff, vector3, sun, shade;

            vector3 = new THREE.Vector3( 0, 0, 0 );

            sun = new THREE.Vector3( 1, 1, 1 );
            sun.normalize();

            canvas = document.createElement( 'canvas' );
            canvas.width = width;
            canvas.height = height;

            context = canvas.getContext( '2d' );
            context.fillStyle = '#000';
            context.fillRect( 0, 0, width, height );

            image = context.getImageData( 0, 0, canvas.width, canvas.height );
            imageData = image.data;

            for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {

                vector3.x = data[ j - 2 ] - data[ j + 2 ];
                vector3.y = 2;
                vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
                vector3.normalize();

                shade = vector3.dot( sun );

                imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
                imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
                imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
            }
        }

            //

        function onWindowResize( event ) {

            renderer.setSize( window.innerWidth, window.innerHeight );

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

        }

        //

        var t = 0;
        function animate() {

            requestAnimationFrame( animate );

            if ( t > 30 ) t = 0;

            var delta = clock.getDelta();

            if (don==false && morphs.length>0) dod();
            render();
            
        }
        function dod(){

        //    RAYCASTS (to the ground)
        /*
            for (var i = 0 ; i<scene.children.length;i++){
        if(scene.children[i].name=="tree") {
              var raycaster = new THREE.Raycaster(scene.children[i].position,new THREE.Vector3( 0, -100000, 0 ));
                var intersects = raycaster.intersectObjects(scene.children);
        //        console.log(intersects[0].distance)
                if (intersects.length>0)
                scene.children[i].position.y= -intersects[0].distance;
        }
            }
        */

                don=true;
        }
        var don=false;
        var movementSpeed = 0.3;
        var frame=0;
function replacer(key, value) {
    if (typeof value === 'number' && !isFinite(value)) {
        return String(value);
    }
    return value;
}


function checkPos(){
    var willsend=false;
    if ((Math.floor(camera.position.x)<myPos.x) || (Math.floor(camera.position.x)>myPos.x)){
        myPos.x=Math.floor(camera.position.x);
        willsend=true;
}
    if ((Math.floor(camera.position.y)<myPos.y) || (Math.floor(camera.position.y)>myPos.y)){
        myPos.y=Math.floor(camera.position.y);
        willsend=true;
}
    if ((Math.floor(camera.position.z)<myPos.z) || (Math.floor(camera.position.z)>myPos.z)){
        myPos.z=Math.floor(camera.position.z);
        willsend=true;
}
//var js = JSON.parse(myPos);
if (willsend == true)
    //alert(JSON.stringify(myPos))
    send(JSON.stringify(myPos,replacer));
}
var lastpos=null
        function render() {
var xc,yc,zc=0;
for (var prop in myJSONUserPosArray2) {
        var tt = JSON.parse(myJSONUserPosArray2[prop])
if ((    lastpos!=myJSONUserPosArray2[prop]) && (prop !=CONFIG.nick))
    {
for (var prop2 in tt) {
if (prop2='x')
    xc=tt[prop2];
if (prop2='y')
    yc=tt[prop2];
if (prop2='z')
    zc=tt[prop2];
}
sphere.position.x=xc;
sphere.position.y=yc;
sphere.position.z=zc;
 console.log   (sphere.geometry.x);
 }
       lastpos=myJSONUserPosArray2[prop]

}
            for ( var i = 0, il = birds.length; i < il; i++ ) {

                    boid = boids[ i ];
                    boid.run( boids );

                    bird = birds[ i ];

                    color = bird.material.color;
                    color.r = color.g = color.b = ( 500 - bird.position.z ) / 1000;

                    bird.rotation.y = Math.atan2( - boid.velocity.z, boid.velocity.x );
                    bird.rotation.z = Math.asin( boid.velocity.y / boid.velocity.length() );

                    bird.phase = ( bird.phase + ( Math.max( 0, bird.rotation.z ) + 0.1 )  ) % 62.83;
                    bird.geometry.vertices[ 5 ].x = bird.geometry.vertices[ 4 ].x = Math.sin( bird.phase ) * 5;

                }

            camera.uniforms[1].amplitude.value = 3*Math.sin(frame)+Math.cos(frame);
            camera.uniforms[2].amplitude2.value = 3*Math.sin(frame)+Math.cos(frame);
            frame += 0.04;
            var timer = Date.now() * 0.00005;
            var actualMoveSpeed =  movementSpeed;

            if (moveForward ) camera.translateZ( - ( actualMoveSpeed ) );
            if ( moveBackward ) camera.translateZ( actualMoveSpeed );

            if ( moveLeft ) camera.translateX( - actualMoveSpeed );
            if ( moveRight ) camera.translateX( actualMoveSpeed );

            if ( moveUp ) camera.translateY( actualMoveSpeed );
            if ( moveDown ) camera.translateY( - actualMoveSpeed );

            camera.position.y = getH(camera.position.x ,camera.position.z)+3;

            camera.lookAt( scene.position );
checkPos();
            renderer.render( scene, camera );

        }