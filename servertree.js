// Include http module,
var vm = require("vm");
var http = require("http"),
// And url module, which is very helpful in parsing request parameters.
   url = require("url"),
  fs = require("fs");
var includeInThisContext = function(path) {
    var code = fs.readFileSync(path);
    vm.runInThisContext(code, path);
}.bind(this);

includeInThisContext("../proctree.js/proctree.js");
// Create the server.
http.createServer(function (request, response) {
   // Attach listener on end event.
   request.on('end', function () {
      // Parse the request for arguments and store them in _get variable.
      // This function parses the url from request and returns object representation.
      var _get = url.parse(request.url,true).query;
      // Write headers to the response.
      response.writeHead(200, {
         'Content-Type': 'text/plain'
      });


var seed=810;
var segments =10;
var vMultiplier=0.66;
var twigScale=0.47;
var initalBranchLength=0.5;
var lengthFalloffFactor=0.85;
var lengthFalloffPower=0.99;
var clumpMax=0.449;
var clumpMin=0.404;
var branchFactor=2.75;
var dropAmount=0.07;
var growAmount=-0.005;
var sweepAmount=0.01;
var maxRadius=0.269;
var climbRate=0.626;
var trunkKink=0.108;
var treeSteps=4;
var taperRate=0.876;
var radiusFalloffRate=0.66;
var twistRate=2.7;
var trunkLength=1.55;

var leaves=0;


       for(var key in _get){
            var val = _get[key];
if (key == 'leaves')
  leaves = val;
if (key == 'seed')
  seed = val
if (key == 'segments')
  segments = val
if (key == 'vMultiplier')
  vMultiplier = val
if (key == 'twigScale')
  twigScale = val
if (key == 'initalBranchLength')
  initalBranchLength = val
if (key == 'lengthFalloffFactor')
  lengthFalloffFactor = val
if (key == 'lengthFalloffPower')
  lengthFalloffPower = val
if (key == 'clumpMax')
  clumpMax = val
if (key == 'clumpMin')
  clumpMin = val
if (key == 'branchFactor')
  branchFactor = val
if (key == 'dropAmount')
  dropAmount = val
if (key == 'growAmount')
  growAmount = val
if (key == 'sweepAmount')
  sweepAmount = val
if (key == 'maxRadius')
  maxRadius = val
if (key == 'climbRate')
  climbRate = val
if (key == 'trunkKink')
  trunkKink = val
if (key == 'treeSteps')
  treeSteps = val
if (key == 'taperRate')
  taperRate = val
if (key == 'radiusFalloffRate')
  radiusFalloffRate = val
if (key == 'twistRate')
  twistRate = val
if (key == 'trunkLength')
  trunkLength = val
}




var myTree = new window.Tree({
"seed": seed,
"segments":segments,
"vMultiplier":vMultiplier,
"twigScale":twigScale,
"initalBranchLength":initalBranchLength,
"lengthFalloffFactor":lengthFalloffFactor,
"lengthFalloffPower":lengthFalloffPower,
"clumpMax":clumpMax,
"clumpMin":clumpMin,
"branchFactor":branchFactor,
"dropAmount":dropAmount,
"growAmount":growAmount,
"sweepAmount":sweepAmount,
"maxRadius":maxRadius,
"climbRate":climbRate,
"trunkKink":trunkKink,
"treeSteps":treeSteps,
"taperRate":taperRate,
"radiusFalloffRate":radiusFalloffRate,
"twistRate":twistRate,
"trunkLength":trunkLength,
});


var fa=''
var r = myTree.faces.length;
for (var i =0 ; i <  r; i++) {
    if (i< r -1) {
    fa=fa+'42,'+myTree.faces[i].join(",")+',0,1,3,2,1,3,2,';
   }
};
fa = fa.substring(0, fa.length - 1);
var fT = fa.split(',');


var fa2=''
var r = myTree.facesTwig.length;
for (var i =0 ; i <  r; i++) {
    if (i< r -1) {
    fa2=fa2+'42,'+myTree.facesTwig[i].join(",")+',0,1,3,2,1,3,2,';
   }
};
fa2 = fa2.substring(0, fa2.length - 1);
var fT2 = fa2.split(',');

var _verts1 = window.Tree.flattenArray(myTree.verts)
var _verts2 = window.Tree.flattenArray(myTree.vertsTwig)
var _norms1 = window.Tree.flattenArray(myTree.normals)
var _norms2 = window.Tree.flattenArray(myTree.normalsTwig)
var _uvs1 = window.Tree.flattenArray(myTree.UV)
var _uvs2 = window.Tree.flattenArray(myTree.uvsTwig)
var _faces1 = fT
var _faces2 = fT2

  var _verts= _verts1
  var _norms= _norms1
  var _uvs= _uvs1
  var _faces= _faces1

var texture = "monster.jpg"
var name = "tree"

if (leaves==1) {
  _verts= _verts2
  _norms= _norms2
  _uvs= _uvs2
  _faces= _faces2
  texture = "branch1.png"
  name = "leaves"
}

// building three.js json model (v3.1)
var jsosTree = {
    "version" : 2,
    "materials": [  {
    "DbgColor" : 0,
    "DbgIndex" : 0,
    "DbgName" : name,
    "colorAmbient" : [0,0,0],
    "colorDiffuse" : [0,0,0],
    "colorSpecular" : [0,0,0],
    "mapDiffuse" : texture,
    "mapDiffuseWrap" : ["repeat", "repeat"],
    "shading" : "Lambert",
    "specularCoef" : 0,
    "transparency" : 0,
    "vertexColors" : false
    }],
   "scale":0.001,
    "vertices":_verts,
    "normals":_norms,
    "uvs":new Array(_uvs),
    "faces":_faces
}

      response.end(JSON.stringify(jsosTree, undefined, 2));
   });
}).listen(8081);
