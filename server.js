/**
 * ORPGL server code
 * E.BOTROS (c) 2013
 **/

// Define some variables
var HOST      = null; 
var PORT      = 8080; 
var starttime = (new Date()).getTime();
var nature    = [];
nature['leaves'] = [];
nature['trunks'] = [];
nature['posX'] = [];
nature['posY'] = [];
var trees     = [];
var bush      = [];
var branch    = [];
var mem       = process.memoryUsage();

var MESSAGE_BACKLOG = 1,
    SESSION_TIMEOUT = 60 * 1000;

var mongodb = require('mongodb')
  , MongoClient = mongodb.MongoClient
var _users;

MongoClient.connect('mongodb://nodejitsu:72c7d98c69b4019a72b6e3dfdae485bb@alex.mongohq.com:10089/nodejitsudb5993184105', function(err, db) {
_users = db.collection('users')
});
// Global Server timer
GTime=0;

// Requires
var vm    = require("vm"),          // vm lib (see includeInThisContext)
    http  = require("http"),        // http server lib
    url   = require("url"),         // http url lib
    fs    = require("fs"),          // file system lib
    sys   = require("sys"),         // sys lib
    qs    = require("querystring"), // query string lib
    fu    = require("./fu")         // nodechat fu lib;

/*
// additionnal JS libs
var includeInThisContext = function(path) {
    var code = fs.readFileSync(path);
    vm.runInThisContext(code, path);
}.bind(this);
includeInThisContext("proctree/proctree.js");
*/
// Folder where reside client files
var appfolder='client';

// every 10 seconds poll for the memory.
setInterval(function () {
  mem = process.memoryUsage();
}, 10*1000);

//GTime ticks every 10 ms
setInterval(function () {
GTime+=1;
}, 10);

var server = new function () {
  var messages = [],
      callbacks = [];

  this.appendMessage = function (nick, type, text,id) {
    var m = { id:id
            ,nick: nick
            , type: type // "msg", "join", "part"
            , text: text
            , timestamp: (new Date()).getTime()
            };

    switch (type) {
      case "msg":
        break;
      case "join":
        sys.puts(nick + " join");
        break;
      case "part":
        sys.puts(nick + " part");
        break;
    }

    messages.push( m );

    while (callbacks.length > 0) {
      callbacks.shift().callback([m]);
    }

    while (messages.length > MESSAGE_BACKLOG)
      messages.shift();
  };

  this.query = function (since, callback) {
    var matching = [];
    for (var i = 0; i < messages.length; i++) {
      var message = messages[i];
      if (message.timestamp > since)
        matching.push(message)
    }

    if (matching.length != 0) {
      callback(matching);
    } else {
      callbacks.push({ timestamp: new Date(), callback: callback });
    }
  };

  // clear old callbacks
  // they can hang around for at most 30 seconds.
  setInterval(function () {
    var now = new Date();
    while (callbacks.length > 0 && now - callbacks[0].timestamp > 30*1000) {
      callbacks.shift().callback([]);
    }
  }, 3000);
};

var sessions = {};

function createSession (nick,data) {
  //if (nick.length > 50) return null;
  //if (/[^\w_\-^!]/.exec(nick)) return null;

  for (var i in sessions) {
    var session = sessions[i];
    //if (session && session.nick === nick) return null;
  }

  var session = { 
    data:data,
    nick: nick, 
    id: Math.floor(Math.random()*99999999999).toString(),
    timestamp: new Date(),

    poke: function () {
      session.timestamp = new Date();
    },

    destroy: function () {
      server.appendMessage(session.nick, "part");
      delete sessions[session.id];
    }
  };

  sessions[session.id] = session;


  return session;
}

// interval to kill off old sessions
setInterval(function () {
  var now = new Date();
  for (var id in sessions) {
    if (!sessions.hasOwnProperty(id)) continue;
    var session = sessions[id];

    if (now - session.timestamp > SESSION_TIMEOUT) {
      session.destroy();
    }
  }
}, 1000);

fu.listen(Number(process.env.PORT || PORT), HOST);

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
function createnature() {
    if (nature['posX'].length == 0) {
      for ( var i = 0; i <20000; i ++ ) {
          // random placement in a grid
          nature['posX'][i] = Math.random()*1024-512;
          nature['posY'][i] = Math.random()*1024-512;
      }
    }

    var winArea = new Array();

    winArea[0]= Math.random()*512-256;
    winArea[1]= Math.random()*512-256;
    winArea[2]= winArea[0]+5;
    winArea[3]= winArea[1]+5;
          
    var worldWidth = 256, worldDepth = 256,
    dataground = generateHeight( worldWidth, worldDepth );
    s= "var naturePos="+JSON.stringify(Array(nature['posX'],nature['posY']), undefined, 2)+';'
    s+= "var groundGeometry="+JSON.stringify(dataground)+';';
    s+= "var wa="+JSON.stringify(winArea)+';';

    fs.writeFile("nature.js", s); 
}

function loaddir(path, callback, set) {
  fs.readdir(path, function (err, filenames) {
    if (err) { return; }
    var realfiles = [];
    var count = filenames.length;
    filenames.forEach(function (filename) {
      if ((path.indexOf("svn")==-1)&&(filename.indexOf(".git")==-1)){
        console.log("loading file " + path+'/'+filename);                     
        fu.get('/'+path+'/'+filename, fu.staticHandler(path+'/'+filename));
        realfiles.push(filename);
        loaddir(path+'/'+filename, callback);
      }
    });
  });
}

    var realfiles = {};
    var vf=0;
function loadmodelsset(path, callback) {
  fs.readdir(path, function (err, filenames) {
    if (err) { return; }
    var count = filenames.length;
    filenames.forEach(function (filename) {
      var ppath = path+'/'+filename;
      var ppath2 = filename;
      fs.stat(ppath, function(err, stats) {
        if(stats.isDirectory()) {
          realfiles[ppath] = {};
          realfiles[ppath]['obj'] = '';
          realfiles[ppath]['png'] = ''; 
          fs.readdir(ppath, function (err, filenames) {
            var ll = 0;

          filenames.forEach(function (filename) {          
          if ((filename.indexOf(".obj")!=-1)||(filename.indexOf(".png")!=-1)){
            console.log("loading file " + path+'/'+filename);                     
            fu.get('/'+ppath+'/'+filename, fu.staticHandler(ppath+'/'+filename));
            if (filename.indexOf(".obj")!=-1)
              realfiles[ppath]['obj'] = ppath+'/'+filename;
            else
              realfiles[ppath]['png'] = ppath+'/'+filename;
          }
        });
        });

     }   
      });
  });

  });

  return realfiles;
}

var jslibs = 'js';
console.log("loading scripts "+jslibs);
loaddir(jslibs);
console.log("loading css");
loaddir('css');


console.log("starting application "+appfolder);
loaddir(appfolder);

console.log("loading trees folder");
var v =loadmodelsset('models/trees');

console.log("loading sounds folder");
loaddir('sounds');

console.log("loading buildings folder");
loaddir('models/buildings');

console.log("loading gems folder");
loaddir('models/gems');

console.log("loading avatars folder");
loaddir('models/avatars');

console.log("loading map");
loaddir('orpgl-mapgen');

console.log("loading textures");
loaddir('textures');


fu.get("/", fu.staticHandler("index.html"));
fu.get("/client.js", fu.staticHandler("client.js"));



fu.get("/who", function (req, res) {
  var nicks = [];
  for (var id in sessions) {
    if (!sessions.hasOwnProperty(id)) continue;
    var session = sessions[id];
    nicks.push(session.nick);
  }
  res.simpleJSON(200, { nicks: nicks
                      });
});

fu.get("/join", function (req, res) {
  var nick = qs.parse(url.parse(req.url).query).nick;
  var thumb = qs.parse(url.parse(req.url).query).thumb;
  if (nick == null || nick.length == 0) {
    res.simpleJSON(400, {error: "Bad nick."});
    return;
  }  

  _users.find({nick: nick}).toArray(
    function(err,results){
       if (results.length==0) {
            console.log('inserting new player...')
        _users.insert([{nick: nick,thumb:thumb}], function(err,
    docs) {
          if (err) {
            return console.error(err)
          }
          console.log('just inserted ', docs.length, ' new documents!')
        })
        } else {
            console.log('found existing player...')
            console.log(results);    
        }

        var session = createSession(nick,results);
        if (session == null) {
          res.simpleJSON(400, {error: "Nick in use"});
          return;
        }
        
        server.appendMessage(session.nick, "join", results);

        res.simpleJSON(200, { 
                              id: session.id
                            , nick: session.nick
                            , starttime: starttime
                            });
    }
    );
});

fu.get("/part", function (req, res) {
  var id = qs.parse(url.parse(req.url).query).id;
  var session;
  if (id && sessions[id]) {
    session = sessions[id];
    session.destroy();
  }
});

fu.get("/recv", function (req, res) {
  if (!qs.parse(url.parse(req.url).query).since) {
    res.simpleJSON(400, { error: "Must supply since parameter" });
    return;
  }
  var id = qs.parse(url.parse(req.url).query).id;
  var session;
  if (id && sessions[id]) {
    session = sessions[id];
    session.poke();
  }

  var since = parseInt(qs.parse(url.parse(req.url).query).since, 10);

  server.query(since, function (messages) {
    if (session) session.poke();
    res.simpleJSON(200, { messages: messages });
  });
});

fu.get("/send", function (req, res) {
  var id = qs.parse(url.parse(req.url).query).id;
  var text = qs.parse(url.parse(req.url).query).text;

  var session = sessions[id];
  if (!session || !text) {
    res.simpleJSON(400, { error: "No such session id" });
    return;
  }

  session.poke();
  if (session.nick) {
	//_users.update({nick: session.nick} ,{ nick: session.nick,data:text});


  _users.findAndModify(
  {nick: session.nick},
  [['_id','asc']],  // sort order
  {$set: {data:text,time: new Date().getTime()}}, // replacement, replaces only the field "hi"
  {}, // options
  function(err, object) {
      /*if (err){
          console.warn(err.message);  // returns error if no matching object found
      }else{
          console.dir(object);
      }*/
  });

  console.log(session.id+' '+session.nick +"(time "+GTime+") msg:"+ text);
	server.appendMessage(session.id, "msg", text,session.id);
	res.simpleJSON(200, {});
  }
});



fu.get("/tree", function (req, res) {

  var leaves = qs.parse(url.parse(req.url).query).leaves;
  if (leaves==1) {
      if (nature['leaves'][0]!=null)
          res.end(nature['leaves'][0]);
  } else {
      if (nature['trunks'][0]!=null)
          res.end(nature['trunks'][0]);
  }

  res.writeHead(200, {
      'Content-Type': 'text/plain'
  });

  var seed=519;
  var segments=6;
  var levels=5;
  var vMultiplier=1.01;
  var twigScale=0.52;
  var initalBranchLength=0.65;
  var lengthFalloffFactor=0.73;
  var lengthFalloffPower=0.76;
  var clumpMax=0.53;
  var clumpMin=0.419;
  var branchFactor=3.4;
  var dropAmount=-0.16;
  var growAmount=0.128;
  var sweepAmount=0.01;
  var maxRadius=0.168;
  var climbRate=0.472;
  var trunkKink=0.06;
  var treeSteps=5;
  var taperRate=0.835;
  var radiusFalloffRate=0.73;
  var twistRate=1.29;
  var trunkLength=2.2;

  for(var key in qs.parse(url.parse(req.url).query)){
      var val = qs.parse(url.parse(req.url).query)[key];
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
      "trunkLength":trunkLength
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
  }
  fa2 = fa2.substring(0, fa2.length - 1);
  var fT2 = fa2.split(',');

  var _verts1 = window.Tree.flattenArray(myTree.verts);
  var _verts2 = window.Tree.flattenArray(myTree.vertsTwig);
  var _norms1 = window.Tree.flattenArray(myTree.normals);
  var _norms2 = window.Tree.flattenArray(myTree.normalsTwig);
  var _uvs1 = window.Tree.flattenArray(myTree.UV);
  var _uvs2 = window.Tree.flattenArray(myTree.uvsTwig);
  var _faces1 = fT;
  var _faces2 = fT2;

  var _verts= _verts1;
  var _norms= _norms1;
  var _uvs= _uvs1;
  var _faces= _faces1;

  var texture = "../monster.jpg";
  var name = "tree";

  if (leaves==1) {
      _verts= _verts2;
      _norms= _norms2;
      _uvs= _uvs2;
      _faces= _faces2;
      texture = "../branch1.png";
      name = "leaves";
  }

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
  
  if (leaves==1) {
    nature['leaves'][0]=JSON.stringify(jsosTree, undefined, 2);
    res.end(nature['leaves'][0]);
  } else {
    nature['trunks'][0]=JSON.stringify(jsosTree, undefined, 2);
    res.end(nature['trunks'][0]);
  }
        
});


fu.get("/GST", function (req, res) {
  var id = qs.parse(url.parse(req.url).query).id;
  var session = sessions[id];
  if (!session) 
    return;
  session.poke();
  if (session.nick) {
  console.log(session.nick +" asks time : "+GTime);
	res.simpleJSON(200, { GST: GTime });
  }
});
//console.log('sleeping');
setTimeout(function(){

var i=0;
var fin =[];
for(var index in realfiles) {
//console.log('NATURE OBJ #'+(i++));  
//console.log('obj:'+realfiles[index].obj);
//console.log('png:'+realfiles[index].png);
fin.push(realfiles[index])
}
console.log(fin);

      fs.writeFile("nature.js", "var nature_ = "+JSON.stringify(fin)); 

fu.get("/nature.js", fu.staticHandler("nature.js"));

},2000);
