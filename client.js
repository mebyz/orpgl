//emmanuel.botros@gmail.com (2011) - Creative Commons BY 3.0 License Terms//
//------------------------------------------------------------------------//

var ns=0; // connected users counter
var myJSONUserPosArray =new Array(); // users positions array
var Nature = null; 
//var Trees = null; 
//var Bush = null; 
//var Branch = null; 
var myJSONUserPosArray2 =new Array(); // users positions array
var gameScene; // our main scene object
var moveplayer =false; // users positions array

var CONFIG = { nick: "#"   // set in onConnect
             , id: null    // set in onConnect
             , last_message_time: 1
             , focus: true //event listeners bound in onConnect
             , unread: 0 //updated in the message-processing loop
             };

var nicks = [];

//  CUT  ///////////////////////////////////////////////////////////////////
/* This license and copyright apply to all code until the next "CUT"
http://github.com/jherdman/javascript-relative-time-helpers/

The MIT License

Copyright (c) 2009 James F. Herdman

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
Date.prototype.toRelativeTime = function(now_threshold) {
  var delta = new Date() - this;

  now_threshold = parseInt(now_threshold, 10);

  if (isNaN(now_threshold)) {
    now_threshold = 0;
  }

  if (delta <= now_threshold) {
    return 'Just now';
  }

  var units = null;
  var conversions = {
    millisecond: 1, // ms    -> ms
    second: 1000,   // ms    -> sec
    minute: 60,     // sec   -> min
    hour:   60,     // min   -> hour
    day:    24,     // hour  -> day
    month:  30,     // day   -> month (roughly)
    year:   12      // month -> year
  };

  for (var key in conversions) {
    if (delta < conversions[key]) {
      break;
    } else {
      units = key; // keeps track of the selected key over the iteration
      delta = delta / conversions[key];
    }
  }

  // pluralize a unit when the difference is greater than 1.
  delta = Math.floor(delta);
  if (delta !== 1) { units += "s"; }
  return [delta, units].join(" ");
};


Date.fromString = function(str) {
  return new Date(Date.parse(str));
};
//  CUT  ///////////////////////////////////////////////////////////////////

function userJoin(nick, timestamp) {
  addMessage(nick, "joined", timestamp, "join");
  for (var i = 0; i < nicks.length; i++)
    if (nicks[i] == nick) return;
  nicks.push(nick);
}

function userPart(nick, timestamp) {
  addMessage(nick, "left", timestamp, "part");
  for (var i = 0; i < nicks.length; i++) {
    if (nicks[i] == nick) {
      nicks.splice(i,1)
      break;
    }
  }
}

util = {
  urlRE: /https?:\/\/([-\w\.]+)+(:\d+)?(\/([^\s]*(\?\S+)?)?)?/g, 

  toStaticHTML: function(inputHtml) {
    inputHtml = inputHtml.toString();
    return inputHtml.replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;");
  }, 


  zeroPad: function (digits, n) {
    n = n.toString();
    while (n.length < digits) 
      n = '0' + n;
    return n;
  },

  timeString: function (date) {
    var minutes = date.getMinutes().toString();
    var hours = date.getHours().toString();
    return this.zeroPad(2, hours) + ":" + this.zeroPad(2, minutes);
  },

  isBlank: function(text) {
    var blank = /^\s*$/;
    return (text.match(blank) !== null);
  }
};

function addMessage (from, text, time, _class) {
  if (text === null)
    return;

  if (time == null) {
    time = new Date();
  } else if ((time instanceof Date) === false) {
    time = new Date(time);
  }

  var messageElement = $(document.createElement("table"));

  messageElement.addClass("message");
  if (_class)
    messageElement.addClass(_class);

  text = util.toStaticHTML(text);

  var nick_re = new RegExp(CONFIG.nick);
  if (nick_re.exec(text))
    messageElement.addClass("personal");

  text = text.replace(util.urlRE, '<a target="_blank" href="$&">$&</a>');

  var content = '<tr>'
              + '  <td class="date">' + util.timeString(time) + '</td>'
              + '  <td class="nick">' + util.toStaticHTML(from) + '</td>'
              + '  <td class="msg-text">' + text  + '</td>'
              + '</tr>'
              ;
  messageElement.html(content);


}

var transmission_errors = 0;
var first_poll = true;


function longPoll (data) {
  if (transmission_errors > 2) {
    showConnect();
    return;
  }

  if (data && data.messages) {
    for (var i = 0; i < data.messages.length; i++) {
      var message = data.messages[i];

      if (message.timestamp > CONFIG.last_message_time)
        CONFIG.last_message_time = message.timestamp;

      switch (message.type) {
        case "msg": 
		if (typeof(myJSONUserPosArray[message.nick])!='undefined') myJSONUserPosArray2[message.nick]=myJSONUserPosArray[message.nick];
		myJSONUserPosArray[message.nick]=message.text;
		if (message.nick!=CONFIG.nick)
			moveplayer=true;

        break;

        case "join":
          userJoin(message.nick, message.timestamp);          
		jQuery.get("/who", {}, function (data, status) {
		if (status != "success") return;
		ns = String(data.nicks);
		ns=ns.split(',');
		}, "json");          
          break;

        case "joinadmin":
          userJoin(message.nick, message.timestamp);          
		jQuery.get("/who", {}, function (data, status) {
		if (status != "success") return;
		ns = String(data.nicks);
		ns=ns.split(',');
		}, "json");          
          break;

        case "part":
          userPart(message.nick, message.timestamp);
          break;
      }
    }


    //only after the first request for messages do we want to show who is here
    if (first_poll) {
      first_poll = false;
      who();
    }
  }

  //make another request
  $.ajax({ cache: false
         , type: "GET"
         , url: "/recv"
         , dataType: "json"
         , data: { since: CONFIG.last_message_time, id: CONFIG.id }
         , error: function () {
             addMessage("", "long poll error. trying again...", new Date(), "error");
             transmission_errors += 1;
             //don't flood the servers on error, wait 10 seconds before retrying
             setTimeout(longPoll, 10*1000);
           }
         , success: function (data) {
             transmission_errors = 0;
             longPoll(data);
           }
         });
}

function send(msg) {
    jQuery.get("/send", {id: CONFIG.id, text: msg}, function (data) { }, "json");
}

function getServerTime(msg) {
    jQuery.get("/GST", {id: CONFIG.id}, function (data) {$("#tim1").html("Global Time Server (refresh 10 secs) : "+ data.GST + " Time Units")}, "json");
}

//Transition the page to the state that prompts the user for a nickname
function showConnect () {
  $("#connect").show();
  $("#loading").hide();
  $("#toolbar").hide();
  $("#nickInput").focus();
}

//transition the page to the loading screen
function showLoad () {
  $("#connect").hide();
  $("#loading").show();
  $("#toolbar").hide();
}

//transition the page to the main chat view, putting the cursor in the textfield
function showChat (nick) {
  $("#toolbar").show();
  $("#entry").focus();

  $("#connect").hide();
  $("#loading").hide();

}

//we want to show a count of unread messages when the window does not have focus
function updateTitle(){
  if (CONFIG.unread) {
    document.title = "(" + CONFIG.unread.toString() + ") node chat";
  } else {
    document.title = "node chat";
  }
}

var starttime;

function onConnect (session) {
  if (session.error) {
    alert("error connecting: " + session.error);
    showConnect();
$("#canvas").css({"height":"300px","width":"600px"})
    return;
  }
  
    var str='<script type="text/javascript" src="client/webgl2.js"></script>';
    $("#app").append(str);

  CONFIG.nick = session.nick;
  CONFIG.id   = session.id;
  starttime   = new Date(session.starttime);
  
  //update the UI to show the chat
  showChat(CONFIG.nick);

  //listen for browser events so we know to update the document title
  $(window).bind("blur", function() {
    CONFIG.focus = false;
    updateTitle();
  });

  $(window).bind("focus", function() {
    CONFIG.focus = true;
    CONFIG.unread = 0;
    updateTitle();
  });
  
  jQuery.get("/who", {}, function (data, status) {
    if (status != "success") return;
    ns = String(data.nicks);
    ns=ns.split(',');
  }, "json");
  $("#page").hide();
/*
  jQuery.get("/getnature", {}, function (data, status) {
    if (status != "success") return;
    Nature=data.nature;
  }, "json");
*/
 
}

//add a list of present chat members to the stream
function outputUsers () {
  var nick_string = nicks.length > 0 ? nicks.join(", ") : "(none)";
  addMessage("users:", nick_string, new Date(), "notice");
  return false;
}

//get a list of the users presently in the room, and add it to the stream
function who () {
  jQuery.get("/who", {}, function (data, status) {
    if (status != "success") return;
    nicks = data.nicks;
    outputUsers();
  }, "json");
}

$(document).ready(function() {


  $("#usersLink").click(outputUsers);

  //try joining the chat when the user clicks the connect button
  $("#connectButton").click(function () {
    //lock the UI while waiting for a response
    showLoad();
    var nick = $("#nickInput").attr("value");

    //dont bother the backend if we fail easy validations
    if (nick.length > 50) {
      alert("Nick too long. 50 character max.");
      showConnect();
      return false;
    }

    //more validations
    if (/[^\w_\-^!]/.exec(nick)) {
      alert("Bad character in nick. Can only have letters, numbers, and '_', '-', '^', '!'");
      showConnect();
      return false;
    }

    //make the actual join request to the server
    $.ajax({ cache: false
           , type: "GET" // XXX should be POST
           , dataType: "json"
           , url: "/join"
           , data: { nick: nick }
           , error: function () {
               alert("error connecting to server");
               showConnect();
             }
           , success: onConnect
           });
    return false;
  });
  
  $("#connectAdminButton").click(function () {
    //lock the UI while waiting for a response
    showLoad();
    var nick = $("#nickInput").attr("value");

    //dont bother the backend if we fail easy validations
    if (nick.length > 50) {
      alert("Nick too long. 50 character max.");
      showConnect();
      return false;
    }

    //more validations
    if (/[^\w_\-^!]/.exec(nick)) {
      alert("Bad character in nick. Can only have letters, numbers, and '_', '-', '^', '!'");
      showConnect();
      return false;
    }

    //make the actual join request to the server
    $.ajax({ cache: false
           , type: "GET" // XXX should be POST
           , dataType: "json"
           , url: "/joinadmin"
           , data: { nick: nick }
           , error: function () {
               alert("error connecting to server");
               showConnect();
             }
           , success: onConnect
           });
    return false;
  });
  
  $("#log table").remove();

  longPoll();

  showConnect();
});

$(window).unload(function () {
  jQuery.get("/part", {id: CONFIG.id}, function (data) { }, "json");
});
