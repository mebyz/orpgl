HOST = null; // localhost
PORT = 8080; 

GTime=0;
var vm = require("vm"),
    http = require("http"),
    url = require("url"),
    fs = require("fs");

// proctree
var includeInThisContext = function(path) {
    var code = fs.readFileSync(path);
    vm.runInThisContext(code, path);
}.bind(this);
includeInThisContext("../proctree.js/proctree.js");

var appfolder='client';
var starttime = (new Date()).getTime();
var nature = [];
var trees = [];
var bush = [];
var branch = [];
  
var mem = process.memoryUsage();

// every 10 seconds poll for the memory.
setInterval(function () {
  mem = process.memoryUsage();
}, 10*1000);

//GTime ticks every 10 ms
setInterval(function () {
GTime+=1;
}, 10);

var fu = require("./fu"),
    fs = require("fs"),
    sys = require("sys"),
    url = require("url"),
    qs = require("querystring");

var MESSAGE_BACKLOG = 1,
    SESSION_TIMEOUT = 60 * 1000;

var server = new function () {
  var messages = [],
      callbacks = [];

  this.appendMessage = function (nick, type, text) {
    var m = { nick: nick
            , type: type // "msg", "join", "part"
            , text: text
            , timestamp: (new Date()).getTime()
            };

    switch (type) {
      case "msg":
        //sys.puts("<" + nick + "> " + text);
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

function createSession (nick) {
  if (nick.length > 50) return null;
  if (/[^\w_\-^!]/.exec(nick)) return null;

  for (var i in sessions) {
    var session = sessions[i];
    if (session && session.nick === nick) return null;
  }

  var session = { 
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

function createnature(cont,num,callback) {
	for (var i=0;i<num;i++) {
			var vx= (Math.random()*400)-200;
			var vy= (Math.random()*400)-200;
			var ry= (Math.random()*.1)-.1;
			var rz= (Math.random()*2*3.14);
			obj=[vx
                      , vy
                      , ry
                      , rz
                      ];
			cont.push(obj);
		}
		nature.push(cont);
}

function loaddir(path, callback) {
      fs.readdir(path, function (err, filenames) {
        if (err) { return; }
        var realfiles = [];
        var count = filenames.length;
        filenames.forEach(function (filename) {
if ((path.indexOf("svn")==-1)&&(filename.indexOf("svn")==-1)){
		console.log("oco  : " + path+'/'+filename);                     
		fu.get('/'+path+'/'+filename, fu.staticHandler(path+'/'+filename));
		realfiles.push(filename);

        loaddir(path+'/'+filename, callback);}

    });
    });
    }


console.log("loading folder "+appfolder+" ...");
loaddir(appfolder);

//console.log("creating nature ...");
//createnature(trees,30);
//createnature(bush,50);
//createnature(branch,30);


fu.get("/", fu.staticHandler("index.html"));
fu.get("/styles.css", fu.staticHandler("styles.css"));
fu.get("/client.js", fu.staticHandler("client.js"));
fu.get("/jquery-1.2.6.min.js", fu.staticHandler("jquery-1.2.6.min.js"));
fu.get("/three.js", fu.staticHandler("three.js"));
fu.get("/branch1.png", fu.staticHandler("branch1.png"));
fu.get("/branch2.png", fu.staticHandler("branch2.png"));
fu.get("/monster.jpg", fu.staticHandler("monster.jpg"));
fu.get("/texture.jpg", fu.staticHandler("texture.jpg"));
//fu.get("/tree.php", fu.staticHandler("tree.php"));


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

fu.get("/getnature", function (req, res) {
  res.simpleJSON(200, { nature: nature
                      });
  console.log("sending nature data");

});

fu.get("/join", function (req, res) {
  var nick = qs.parse(url.parse(req.url).query).nick;
  if (nick == null || nick.length == 0) {
    res.simpleJSON(400, {error: "Bad nick."});
    return;
  }
  var session = createSession(nick);
  if (session == null) {
    res.simpleJSON(400, {error: "Nick in use"});
    return;
}

  //sys.puts("connection: " + nick + "@" + res.connection.remoteAddress);

  server.appendMessage(session.nick, "join");
  res.simpleJSON(200, { id: session.id
                      , nick: session.nick
                      , starttime: starttime
                      });
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
	console.log(session.nick +"(time "+GTime+") msg:"+ text);
	server.appendMessage(session.nick, "msg", text);
	res.simpleJSON(200, {});
  }
});



fu.get("/tree", function (req, res) {
  var leaves = qs.parse(url.parse(req.url).query).leaves;
  
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

/*        var seed=810;
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
        var trunkLength=1.55;*/

        //var leaves=0;


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

        var texture = "../monster.jpg"
        var name = "tree"

        if (leaves==1) {
            _verts= _verts2
            _norms= _norms2
            _uvs= _uvs2
            _faces= _faces2
            texture = "../branch1.png"
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

        res.end(JSON.stringify(jsosTree, undefined, 2));
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
