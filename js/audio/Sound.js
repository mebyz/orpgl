
var Sound = function ( sources, radius, volume) {

                var audio = document.createElement( 'audio' );

                for ( var i = 0; i < sources.length; i ++ ) {

                    var source = document.createElement( 'source' );
                    source.src = sources[ i ];

                    audio.appendChild( source );

                }

                this.position = new THREE.Vector3();
                this.loop = null
                this.play = function() {
                    audio.play();
                };
                this.stop = function() {
                    audio.pause();
                    clearInterval(this.loop);
                };

                this.getloop = function() {
                    return this.loop;
                };

                this.playsea = function () {
                    audio.play();
                    setInterval(function(){audio.setAttribute('src', audio.children[0].src);audio.play();},13000);
                }
                this.playloop = function (looptime) {
                    if (this.loop == null) {
                        audio.play();
                        this.loop = setInterval(function(){audio.setAttribute('src', audio.children[0].src);audio.play();},looptime);
                    }
                }
                
                this.getaudio = function () {
                    return audio;                    
                }

                this.update = function ( camera ) {

                    var distance = this.position.distanceTo( camera.position );

                    if ( distance <= radius ) {

                        audio.volume = volume * ( 1 - distance / radius );

                    } else {

                        audio.volume = 0;

                    }

                }

            }
