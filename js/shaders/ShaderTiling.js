
var tiledVertexShader = 
"uniform sampler2D heightMap;"+
"uniform float heightScale;"+

"varying float vAmount;"+
"varying vec2 vUV;"+

"void main()"+
"{"+
"vUV = uv;"+
"vec4 tx = texture2D( heightMap, vUV);"+
"vAmount = tx.g;"+
"vec3 newPosition = position + normal  * vAmount * heightScale;"+

"gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );"+
"}";
var tiledFragmentShader = [
"uniform sampler2D oceanTexture;",
"uniform sampler2D sandyTexture;",
"uniform sampler2D grassTexture;",
"uniform sampler2D rockyTexture;",
"uniform sampler2D snowyTexture;",
"uniform sampler2D heightMap;",

"varying vec2 vUV;",
THREE.ShaderChunk[ "fog_pars_fragment" ],
"varying float vAmount;",

"void main()", 
"{",
"vec4 water = (smoothstep(0.01, 0.20, vAmount) - smoothstep(0.16, 0.20, vAmount)) * texture2D( oceanTexture, vUV * 10.0 );",
"vec4 sandy = (smoothstep(0.14, 0.20, vAmount) - smoothstep(0.22, 0.28, vAmount)) * texture2D( sandyTexture, vUV * 10.0 );",
"vec4 grass = (smoothstep(0.22, 0.28, vAmount) - smoothstep(0.30, 0.40, vAmount)) * texture2D( grassTexture, vUV * 20.0 );",
"vec4 rocky = (smoothstep(0.30, 0.40, vAmount) - smoothstep(0.50, 0.60, vAmount)) * texture2D( rockyTexture, vUV * 20.0 );",
"vec4 snowy = (smoothstep(0.40, 0.75, vAmount))                                   * texture2D( snowyTexture, vUV * 10.0 );",
"vec4 tx = texture2D( heightMap, vUV);",  
"gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0) + water + sandy + grass + rocky + snowy; //, 1.0);",
THREE.ShaderChunk[ "fog_fragment" ],
"}"
].join("\n");