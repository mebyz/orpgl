HOST = null; // localhost
PORT = 8080; 

GTime=0;

var appfolder='example';
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

var channel = new function () {
  var messages = [],
      callbacks = [];

  this.appendMessage = function (nick, type, text) {
    var m = { nick: nick
            , type: type // "msg", "join", "part",...
            , text: text
            , timestamp: (new Date()).getTime()
            };

    switch (type) {
      case "msg":
        sys.puts("<" + nick + "> " + text);
        break;
      case "join":
        sys.puts(nick + " join");
        break;
      case "joinadmin":
        sys.puts(nick + " join admin");
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
      channel.appendMessage(session.nick, "part");
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
		var ry= (Math.random()*.5)-.5;
		var rz= (Math.random()*2*3.14);
		obj=[vx,
			vy,
			ry,
			rz,
			];
		cont.push(obj);
	}
	nature.push(cont);
}

function loaddir(path, callback) {
	fs.readdir(path, function (err, filenames) {
	if (err) 
		return; 
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
console.log("creating nature ...");
createnature(trees,30);
createnature(bush,5);
createnature(branch,50);


fu.get("/", fu.staticHandler("index.html"));
fu.get("/admin.html", fu.staticHandler("admin.html"));
fu.get("/styles.css", fu.staticHandler("styles.css"));
fu.get("/client.js", fu.staticHandler("client.js"));
fu.get("/jquery-1.2.6.min.js", fu.staticHandler("jquery-1.2.6.min.js"));
fu.get("/glge-compiled-min.js", fu.staticHandler("glge-compiled-min.js"));

fu.get("/who", function (req, res) {
  var nicks = [];
  for (var id in sessions) {
    if (!sessions.hasOwnProperty(id)) continue;
    var session = sessions[id];
    nicks.push(session.nick);
  }
  res.simpleJSON(200, { nicks: nicks
                      , rss: mem.rss
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

  channel.appendMessage(session.nick, "join");
  res.simpleJSON(200, { id: session.id
                      , nick: session.nick
                      , rss: mem.rss
                      , starttime: starttime
                      });
});

fu.get("/joinadmin", function (req, res) {
  var nick = qs.parse(url.parse(req.url).query).nick;
  if (nick == null || nick.length == 0 || nick != 'elidoeiram' ) {
    res.simpleJSON(400, {error: "Bad nick."});
    return;
  }
  var session = createSession(nick);
  if (session == null) {
    res.simpleJSON(400, {error: "Nick in use"});
    return;
}

  //sys.puts("connection: " + nick + "@" + res.connection.remoteAddress);

  channel.appendMessage(session.nick, "join admin");
  res.simpleJSON(200, { id: session.id
                      , nick: session.nick
                      , rss: mem.rss
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
  res.simpleJSON(200, { rss: mem.rss });
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

  channel.query(since, function (messages) {
    if (session) session.poke();
    res.simpleJSON(200, { messages: messages, rss: mem.rss });
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
	channel.appendMessage(session.nick, "msg", text);
	res.simpleJSON(200, { rss: mem.rss });
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
