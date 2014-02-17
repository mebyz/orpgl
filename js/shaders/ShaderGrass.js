
var WindMeshShader = (function() {

    function WindMeshShader() {}

    WindMeshShader.prototype.attributes = {
      "windFactor": {
        type: "f",
        value: []
      }
    };

    WindMeshShader.prototype.uniforms = THREE.UniformsUtils.merge([
      THREE.UniformsLib["common"], THREE.UniformsLib["bump"], THREE.UniformsLib["normalmap"], THREE.UniformsLib["fog"], THREE.UniformsLib["lights"], THREE.UniformsLib["shadowmap"], {
        "ambient": {
          type: "c",
          value: new THREE.Color(0X000000)
        },
        "emissive": {
          type: "c",
          value: new THREE.Color(0x000000)
        },
        "specular": {
          type: "c",
          value: new THREE.Color(0x000000)
        },
        "shininess": {
          type: "f",
          value: 0.0
        },
        "wrapRGB": {
          type: "v3",
          value: new THREE.Vector3(1, 1, 1)
        },
        "windMin": {
          type: "v2",
          value: new THREE.Vector2()
        },
        "windSize": {
          type: "v2",
          value: new THREE.Vector2()
        },
        "windDirection": {
          type: "v3",
          value: new THREE.Vector3(1, 0, 0)
        },
        "tWindForce": {
          type: "t",
          value: null
        },
        "windScale": {
          type: "f",
          value: 1.0
        }
      }
    ]);

    WindMeshShader.prototype.vertexShader = ["#define PHONG", "varying vec3 vViewPosition;", "varying vec3 vNormal;", THREE.ShaderChunk["map_pars_vertex"], THREE.ShaderChunk["lightmap_pars_vertex"], THREE.ShaderChunk["envmap_pars_vertex"], "attribute float windFactor;", "uniform vec2 windMin;", "uniform vec2 windSize;", "uniform vec3 windDirection;", "uniform sampler2D tWindForce;", "uniform float windScale;", "varying vec3 vWorldPosition;", "varying float vWindForce;", THREE.ShaderChunk["lights_phong_pars_vertex"], THREE.ShaderChunk["color_pars_vertex"], THREE.ShaderChunk["morphtarget_pars_vertex"], THREE.ShaderChunk["skinning_pars_vertex"], THREE.ShaderChunk["shadowmap_pars_vertex"], "void main() {", THREE.ShaderChunk["map_vertex"], THREE.ShaderChunk["lightmap_vertex"], THREE.ShaderChunk["color_vertex"], THREE.ShaderChunk["morphnormal_vertex"], THREE.ShaderChunk["skinbase_vertex"], THREE.ShaderChunk["skinnormal_vertex"], THREE.ShaderChunk["defaultnormal_vertex"], "vNormal = transformedNormal;", THREE.ShaderChunk["morphtarget_vertex"], THREE.ShaderChunk["skinning_vertex"], "vec4 mvPosition;", "#ifdef USE_SKINNING", "mvPosition = modelViewMatrix * skinned;", "#endif", "#if !defined( USE_SKINNING ) && defined( USE_MORPHTARGETS )", "mvPosition = modelViewMatrix * vec4( morphed, 1.0 );", "#endif", "#if !defined( USE_SKINNING ) && ! defined( USE_MORPHTARGETS )", "vec4 wpos = modelMatrix * vec4( position, 1.0 );", "wpos.z = -wpos.z;", "vec2 totPos = wpos.xz - windMin;", "vec2 windUV = totPos / windSize;", "vWindForce = texture2D(tWindForce,windUV).x;", "float windMod = ((1.0 - vWindForce)* windFactor ) * windScale;", "vec4 pos = vec4(position , 1.0);", "pos.x += windMod * windDirection.x;", "pos.y += windMod * windDirection.y;", "pos.z += windMod * windDirection.z;", "mvPosition = modelViewMatrix *  pos;", "#endif", "gl_Position = projectionMatrix * mvPosition;", "vViewPosition = -mvPosition.xyz;", THREE.ShaderChunk["worldpos_vertex"], THREE.ShaderChunk["envmap_vertex"], THREE.ShaderChunk["lights_phong_vertex"], THREE.ShaderChunk["shadowmap_vertex"], "}"].join("\n");

    WindMeshShader.prototype.fragmentShader = [/*"uniform vec3 fogColor;","uniform float fogNear;","uniform float fogFar;",*/"uniform vec3 diffuse;", "uniform float opacity;", "uniform vec3 ambient;", "uniform vec3 emissive;", "uniform vec3 specular;", "uniform float shininess;", THREE.ShaderChunk["color_pars_fragment"], THREE.ShaderChunk["map_pars_fragment"], THREE.ShaderChunk["lightmap_pars_fragment"], THREE.ShaderChunk["envmap_pars_fragment"], THREE.ShaderChunk["fog_pars_fragment"], THREE.ShaderChunk["lights_phong_pars_fragment"], THREE.ShaderChunk["shadowmap_pars_fragment"], THREE.ShaderChunk["bumpmap_pars_fragment"], THREE.ShaderChunk["normalmap_pars_fragment"], THREE.ShaderChunk["specularmap_pars_fragment"], "void main() {", "gl_FragColor = vec4( vec3 ( 1.0 ), opacity );", THREE.ShaderChunk["map_fragment"], THREE.ShaderChunk["alphatest_fragment"], THREE.ShaderChunk["specularmap_fragment"], THREE.ShaderChunk["lights_phong_fragment"], THREE.ShaderChunk["lightmap_fragment"], THREE.ShaderChunk["color_fragment"], THREE.ShaderChunk["envmap_fragment"], THREE.ShaderChunk["shadowmap_fragment"], THREE.ShaderChunk["linear_to_gamma_fragment"], THREE.ShaderChunk["fog_fragment"], "}"].join("\n");

    return WindMeshShader;

  })();


  var NoiseShader = (function() {

    function NoiseShader() {}

    NoiseShader.prototype.uniforms = {
      "fTime": {
        type: "f",
        value: 1
      },
      "vScale": {
        type: "v2",
        value: new THREE.Vector2(1, 1)
      },
      "vOffset": {
        type: "v2",
        value: new THREE.Vector2(1, 1)
      }
    };

    NoiseShader.prototype.fragmentShader = ["uniform float fTime;", "varying vec2 vUv;", "vec4 permute( vec4 x ) {", "return mod( ( ( x * 34.0 ) + 1.0 ) * x, 289.0 );", "}", "vec4 taylorInvSqrt( vec4 r ) {", "return 1.79284291400159 - 0.85373472095314 * r;", "}", "float snoise( vec3 v ) {", "const vec2 C = vec2( 1.0 / 6.0, 1.0 / 3.0 );", "const vec4 D = vec4( 0.0, 0.5, 1.0, 2.0 );", "vec3 i  = floor( v + dot( v, C.yyy ) );", "vec3 x0 = v - i + dot( i, C.xxx );", "vec3 g = step( x0.yzx, x0.xyz );", "vec3 l = 1.0 - g;", "vec3 i1 = min( g.xyz, l.zxy );", "vec3 i2 = max( g.xyz, l.zxy );", "vec3 x1 = x0 - i1 + 1.0 * C.xxx;", "vec3 x2 = x0 - i2 + 2.0 * C.xxx;", "vec3 x3 = x0 - 1. + 3.0 * C.xxx;", "i = mod( i, 289.0 );", "vec4 p = permute( permute( permute( i.z + vec4( 0.0, i1.z, i2.z, 1.0 ) ) + i.y + vec4( 0.0, i1.y, i2.y, 1.0 ) ) + i.x + vec4( 0.0, i1.x, i2.x, 1.0 ) );", "float n_ = 1.0 / 7.0;", "vec3 ns = n_ * D.wyz - D.xzx;", "vec4 j = p - 49.0 * floor( p * ns.z *ns.z );", "vec4 x_ = floor( j * ns.z );", "vec4 y_ = floor( j - 7.0 * x_ );", "vec4 x = x_ *ns.x + ns.yyyy;", "vec4 y = y_ *ns.x + ns.yyyy;", "vec4 h = 1.0 - abs( x ) - abs( y );", "vec4 b0 = vec4( x.xy, y.xy );", "vec4 b1 = vec4( x.zw, y.zw );", "vec4 s0 = floor( b0 ) * 2.0 + 1.0;", "vec4 s1 = floor( b1 ) * 2.0 + 1.0;", "vec4 sh = -step( h, vec4( 0.0 ) );", "vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;", "vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;", "vec3 p0 = vec3( a0.xy, h.x );", "vec3 p1 = vec3( a0.zw, h.y );", "vec3 p2 = vec3( a1.xy, h.z );", "vec3 p3 = vec3( a1.zw, h.w );", "vec4 norm = taylorInvSqrt( vec4( dot( p0, p0 ), dot( p1, p1 ), dot( p2, p2 ), dot( p3, p3 ) ) );", "p0 *= norm.x;", "p1 *= norm.y;", "p2 *= norm.z;", "p3 *= norm.w;", "vec4 m = max( 0.6 - vec4( dot( x0, x0 ), dot( x1, x1 ), dot( x2, x2 ), dot( x3, x3 ) ), 0.0 );", "m = m * m;", "return 42.0 * dot( m*m, vec4( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 ), dot( p3, x3 ) ) );", "}", "float surface3( vec3 coord ) {", "float n = 0.0;", "n += 1.0 * abs( snoise( coord ) );", "n += 0.5 * abs( snoise( coord * 2.0 ) );", "n += 0.25 * abs( snoise( coord * 4.0 ) );", "n += 0.125 * abs( snoise( coord * 8.0 ) );", "return n;", "}", "void main( void ) {", "vec3 coord = vec3( vUv, -fTime );", "float n = surface3( coord );", "gl_FragColor = vec4( vec3( n, n, n ), 1.0 );", "}"].join("\n");

    NoiseShader.prototype.vertexShader = ["varying vec2 vUv;", "uniform vec2 vScale;", "uniform vec2 vOffset;", "void main( void ) {", "vUv = (uv * vScale) + vOffset;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}"].join("\n");

    return NoiseShader;

  })();

var getWindMaterial = function(dx,dy,dz) {
      var material, params, shader, uniforms;
      shader = new WindMeshShader();
      uniforms = shader.uniforms;
      params = {};
      params.fragmentShader = shader.fragmentShader;
      params.vertexShader = shader.vertexShader;
      params.uniforms = shader.uniforms;
      params.attributes = {
        windFactor: {
          type: 'f',
          value: []
        }/*,
        fogColor:    { type: "c", value: 0xffffaa },
        fogNear:     { type: "f", value: 1 },
        fogFar:      { type: "f", value: 100 }*/
      };
      params.lights = true;
      params.side = THREE.DoubleSide;
      params.transparent= true;
      //params.depthWrite= false;
      //params.depthTest= false;
      params.alphaTest= 0.5;
      params.fog=true;
      material = new THREE.ShaderMaterial(params);
      uniforms["diffuse"].value = new THREE.Color(0XFFFFFF);
      uniforms["ambient"].value = new THREE.Color(0x000000);
      uniforms["specular"].value = new THREE.Color(0x000000);
      uniforms["map"].value = material.map = THREE.ImageUtils.loadTexture("textures/grass_billboard.png");
      uniforms["tWindForce"].value = noiseMap;
      uniforms["windScale"].value = 1;
      uniforms["windMin"].value = new THREE.Vector2(-30, -30);
      uniforms["windSize"].value = new THREE.Vector2(60, 60);
      uniforms["windDirection"].value = new THREE.Vector3(dx,dy,dz);
      return material;
    };

var noiseMap = null;

var noiseShader = null;

var noiseScene = null;

var noiseMaterial = null;

var noiseCameraOrtho = null;

var noiseQuadTarget = null;

var noiseRenderTarget = null;

var noiseSpeed = 0.046;

var noiseOffsetSpeed = 0.11;

    var initNoiseShader = function() {
      noiseMap = new THREE.WebGLRenderTarget(128, 128, {
        minFilter: THREE.LinearMipmapLinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat
      });
      noiseShader = new NoiseShader();
      noiseShader.uniforms.vScale.value.set(0.3, 0.3);
      noiseScene = new THREE.Scene();
      noiseCameraOrtho = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -10000, 10000);
      noiseCameraOrtho.position.z = 100;
      noiseScene.add(noiseCameraOrtho);
      noiseMaterial = new THREE.ShaderMaterial({
        fragmentShader: noiseShader.fragmentShader,
        vertexShader: noiseShader.vertexShader,
        uniforms: noiseShader.uniforms,
        lights: false
      });
      noiseQuadTarget = new THREE.Mesh(new THREE.PlaneGeometry(window.innerWidth, window.innerHeight, 100, 100), noiseMaterial);
      noiseQuadTarget.position.z = -500;
      return noiseScene.add(noiseQuadTarget);
    };