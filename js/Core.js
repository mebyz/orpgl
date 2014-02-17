// IMAGE
var loadImage = function(url) {
    return THREE.ImageUtils.loadTexture(url,null,function(){lt++;});
}

// GET HEIGHT
function getHeight(x,z,cam){

    var h = 0;
    if (x<=5 || z<=5 || x>=9995 || z>=9995) {
        return -68;
    }
    var idx=x+'x'+z;
    if(typeof localStorage!='undefined') {
        var hh = localStorage.getItem(idx);
        if(hh!=null) {
            h = parseInt(hh);
        } else {
            var tileX = Math.abs(Math.round((x-512)/1007)%10);
            var tileZ = Math.abs(-Math.round(-(z-512)/1007)%10);
            var idx = tileZ + tileX*10; 
            var ctx = document.getElementById('tile_'+tileX+'_'+tileZ).getContext('2d');
            ctx.imageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;
            ctx.oImageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;

            if (app.Config.currentTile !=idx) {
                app.Config.currentTile = idx;
            }
            var imageData = ctx.getImageData(0, 0, 512,512);


            var imgX = (Math.abs(Math.floor(((x-tileX*1007)/2))))%508+1;
            var imgZ = (Math.abs(Math.floor(((z-tileZ*1007)/2))))%508+1;


            var index = 4 * (imgZ * 512 + imgX);
            var height = imageData.data[index];
            
            if (imgX>0 && imgX<=512 && imgZ>0 && imgZ<=512) 
                h=height*(app.Config.heightScale/300)-60;
            h = h +((h*h)/900)

            h=h-20;
            localStorage.setItem(idx,h);
        }
    }
    if (h<=-64) h=-68;
    return h;
}


// LENS FLARE
function addLight(h, s, l, x, y, z,texture,scene) {

    Sunlight = new THREE.PointLight(0xffffff, 1.5, 4500);
    Sunlight.color.setHSL(h, s, l);
    Sunlight.position.set(x, y, z);
    scene.add(Sunlight);

    var flareColor = new THREE.Color(0xffffff);
    flareColor.setHSL(h, s, l + 0.5);

    lensFlare = new THREE.LensFlare(texture, 700, 0.0, THREE.AdditiveBlending, flareColor);
    lensFlare.customUpdateCallback = lensFlareUpdateCallback;
    lensFlare.position = Sunlight.position;

    scene.add(lensFlare);

}

function lensFlareUpdateCallback(object) {

    var f, fl = object.lensFlares.length;
    var flare;
    var vecX = -object.positionScreen.x * 2;
    var vecY = -object.positionScreen.y * 2;

    for(f = 0; f < fl; f++) {

        flare = object.lensFlares[ f ];

        flare.x = object.positionScreen.x + vecX * flare.distance;
        flare.y = object.positionScreen.y + vecY * flare.distance;

        flare.rotation = 0;
    }
}

// UTILS

function animate() {
    requestAnimationFrame(animate);
    render();
}

function replacer(key, value) {
    if(typeof value === 'number' && !isFinite(value)) {
        return String(value);
    }
    return value;
}

// INDEX

 var dragging = false;
  $(function() {
    $( ".draggable" ).draggable().mouseover(function(event, ui) {dragging=true;})
    .mouseout(function(event, ui) {dragging=false;});
    $( ".droppable" ).droppable({
      drop: function( event, ui ) {
          dragging=false;
      }
    });
  });
      function loadRemote(path, callback) {
        var fetch = new XMLHttpRequest();
        fetch.open('GET', path);
        fetch.overrideMimeType("text/plain; charset=x-user-defined");
        fetch.onreadystatechange = function() {
          if(this.readyState == 4 && this.status == 200) {
            /* munge response into a binary string */
            var t = this.responseText || "" ;
            var ff = [];
            var mx = t.length;
            var scc= String.fromCharCode;
            for (var z = 0; z < mx; z++) {
              ff[z] = scc(t.charCodeAt(z) & 255);
            }
            callback(ff.join(""));
          }
        }
        fetch.send();
      }
      
      function play(file) {
        loadRemote(file, function(data) {
          midiFile = MidiFile(data);
          synth = Synth(44100);
          replayer = Replayer(midiFile, synth);
          audio = AudioPlayer(replayer);
        })
      }
    (function() {
      var po = document.createElement('script');
      po.type = 'text/javascript'; po.async = true;
      po.src = 'https://plus.google.com/js/client:plusone.js';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(po, s);
    })();

    var helper = (function() {
    var BASE_API_PATH = 'plus/v1/';

    return {
      /**
       * Hides the sign in button and starts the post-authorization operations.
       *
       * @param {Object} authResult An Object which contains the access token and
       *   other authentication information.
       */
      onSignInCallback: function(authResult) {
        gapi.client.load('plus','v1', function(){
          $('#authResult').html('Auth Result:<br/>');
          for (var field in authResult) {
            $('#authResult').append(' ' + field + ': ' +
                authResult[field] + '<br/>');
          }
          if (authResult['access_token']) {
            $('#authOps').show('slow');
            var r=gapi.client.plus.people.get({'userId' : 'me'});r.execute(function(name){
            document.getElementById('chatframe').src = 'http://lecontrepoids.fr/orpgl-chat/index.php?nickName='+name.displayName;
            CONFIG.nick = name.displayName;
   $.ajax({ cache: false
             , type: "GET" // XXX should be POST
             , dataType: "json"
             , url: "/join"
             , data: { nick: name.displayName,thumb :name.image.url }
             , error: function () {
                 alert("error connecting to server");
                 showConnect();
               }
             , success: onConnect
             });
   

  });
            $('#gConnect').hide();
            helper.profile();
            helper.people();
            $("#page").hide();
            $("#wait").show();


           } else if (authResult['error']) {
            // There was an error, which means the user is not signed in.
            // As an example, you can handle by writing to the console:
            console.log('There was an error: ' + authResult['error']);
            $('#authResult').append('Logged out');
            $('#authOps').hide('slow');
            $('#gConnect').show();
          }
//          console.log('authResult', authResult);
        });
      },

      /**
       * Calls the OAuth2 endpoint to disconnect the app for the user.
       */
      disconnect: function() {
        // Revoke the access token.
        $.ajax({
          type: 'GET',
          url: 'https://accounts.google.com/o/oauth2/revoke?token=' +
              gapi.auth.getToken().access_token,
          async: false,
          contentType: 'application/json',
          dataType: 'jsonp',
          success: function(result) {
            console.log('revoke response: ' + result);
            $('#authOps').hide();
            $('#profile').empty();
            $('#visiblePeople').empty();
            $('#authResult').empty();
            $('#gConnect').show();
          },
          error: function(e) {
            console.log(e);
          }
        });
      },

      /**
       * Gets and renders the list of people visible to this app.
       */
      people: function() {
        var request = gapi.client.plus.people.list({
          'userId': 'me',
          'collection': 'visible'
        });
        request.execute(function(people) {
          $('#visiblePeople').empty();
          $('#visiblePeople').append('Number of people visible to this app: ' +
              people.totalItems + '<br/>');
          for (var personIndex in people.items) {
            person = people.items[personIndex];
            $('#visiblePeople').append('<img src="' + person.image.url + '">');
          }
        });
      },

      /**
       * Gets and renders the currently signed in user's profile data.
       */
      profile: function(){
        var request = gapi.client.plus.people.get( {'userId' : 'me'} );
        request.execute( function(profile) {
          $('#profile').empty();
          if (profile.error) {
            $('#profile').append(profile.error);
            return;
          }
          $('#profile').append(
              $('<p><img src=\"' + profile.image.url + '\"></p>'));
          $('#profile').append(
              $('<p>Hello ' + profile.displayName + '!<br />Tagline: ' +
              profile.tagline + '<br />About: ' + profile.aboutMe + '</p>'));
          if (profile.cover && profile.coverPhoto) {
            $('#profile').append(
                $('<p><img src=\"' + profile.cover.coverPhoto.url + '\"></p>'));
          }
        });
      }
    };
  })();

  /**
   * jQuery initialization
   */
  $(document).ready(function() {
    $('#disconnect').click(helper.disconnect);
    $('#loaderror').hide();
    if ($('[data-clientid="YOUR_CLIENT_ID"]').length > 0) {
      alert('This sample requires your OAuth credentials (client ID) ' +
          'from the Google APIs console:\n' +
          '    https://code.google.com/apis/console/#:access\n\n' +
          'Find and replace YOUR_CLIENT_ID with your client ID.'
      );
    }
  });

  /**
   * Calls the helper method that handles the authentication flow.
   *
   * @param {Object} authResult An Object which contains the access token and
   *   other authentication information.
   */
  function onSignInCallback(authResult) {
    helper.onSignInCallback(authResult);
  }

// MULTILINE
function multiline(f) {
  return f.toString().
      replace(/^[^\/]+\/\*!?/, '').
      replace(/\*\/[^\/]+$/, '');
}

