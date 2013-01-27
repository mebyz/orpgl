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
      // Send data and end response.
var seed  = Math.floor((Math.random()*50));




var myTree = new window.Tree({
"seed": 810+seed,
"segments":10,
"vMultiplier":0.66,
"twigScale":0.47,
"initalBranchLength":0.5,
"lengthFalloffFactor":0.85,
"lengthFalloffPower":0.99,
"clumpMax":0.449,
"clumpMin":0.404,
"branchFactor":2.75,
"dropAmount":0.07,
"growAmount":-0.005,
"sweepAmount":0.01,
"maxRadius":0.269,
"climbRate":0.626,
"trunkKink":0.108,
"treeSteps":4,
"taperRate":0.876,
"radiusFalloffRate":0.66,
"twistRate":2.7,
"trunkLength":1.55,
});
console.log (seed);


var fa=''
var r = myTree.faces.length;
for (var i =0 ; i <  r; i++) {
    if (i< r -1) {

    fa=fa+'42,'+myTree.faces[i].join(",")+',0,1,3,2,1,3,2,';

   }
};

fa = fa.substring(0, fa.length - 1);
var fT = fa.split(',');

// building three.js json model (v3.1)
var jsosTree = {
    "version" : 2,
    "materials": [  {
    "DbgColor" : 0,
    "DbgIndex" : 0,
    "DbgName" : "monster",
    "colorAmbient" : [0,0,0],
    "colorDiffuse" : [0,0,0],
    "colorSpecular" : [0,0,0],
    "mapDiffuse" : "monster.jpg",
    "mapDiffuseWrap" : ["repeat", "repeat"],
    "shading" : "Lambert",
    "specularCoef" : 0,
    "transparency" : 0,
    "vertexColors" : false
    }],
   "scale":0.001,
    "vertices":window.Tree.flattenArray(myTree.verts),
    "normals":window.Tree.flattenArray(myTree.normals),
    "uvs":new Array(window.Tree.flattenArray(myTree.UV)),
    "faces":fT
}

/*

var fa2=''
var r = myTree.facesTwig.length;
for (var i =0 ; i <  r; i++) {
    if (i< r -1) {

    fa=fa+'42,'+myTree.facesTwig[i].join(",")+',0,1,3,2,1,3,2,';

   }
};

fa = fa.substring(0, fa.length - 1);
var fT = fa.split(',');

// building three.js json model (v3.1)
var jsosTreeLeafs = {
    "version" : 2,
    "materials": [  {
    "DbgColor" : 0,
    "DbgIndex" : 0,
    "DbgName" : "monster",
    "colorAmbient" : [0,0,0],
    "colorDiffuse" : [0,0,0],
    "colorSpecular" : [0,0,0],
    "mapDiffuse" : "monster.jpg",
    "mapDiffuseWrap" : ["repeat", "repeat"],
    "shading" : "Lambert",
    "specularCoef" : 0,
    "transparency" : 0,
    "vertexColors" : false
    }],
   "scale":0.001,
    "vertices":window.Tree.flattenArray(myTree.vertsTwig),
    "normals":window.Tree.flattenArray(myTree.normalsTwig),
    "uvs":new Array(window.Tree.flattenArray(myTree.uvsTwig)),
    "faces":fT
}
*/
      response.end(JSON.stringify(jsosTree, undefined, 2));
   });
}).listen(8081);
