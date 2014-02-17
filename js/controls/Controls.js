THREE.PointerLockControls = function(camera) {

    var scope = this;
    camera.rotation.set(0, 0, 0);

    pitchObject = new THREE.Object3D();
    pitchObject.add(camera);

    yawObject = new THREE.Object3D();
    yawObject.position.y = 0;
    yawObject.add(pitchObject);

    var moveUpward = false;
    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;

    var isOnObject = false;
    var canJump = false;

    var velocity = new THREE.Vector3();

    var PI_2 = Math.PI / 2;
    var mousemov = false;


    var  projector = new THREE.Projector();
    var  mouseVector = new THREE.Vector3();
    var onMouseMove = function(event) {

                
                mouseVector.x = 2 * (event.clientX / window.innerWidth) - 1;
                mouseVector.y = 1 - 2 * ( event.clientY / window.innerHeight );


                
        
        if(scope.enabled === false) {
            return;
        }
        if (mousemov==true) {

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        yawObject.rotation.y -= movementX * 0.004;
        pitchObject.rotation.x -= movementY * 0.004;

        pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));
}
    };
    var onMouseDown = function(event) {

    if (!dragging)
        mousemov=true;

        var raycaster = projector.pickingRay( mouseVector.clone(), camera );
        var     intersects = raycaster.intersectObjects( app.Config.scene.children );
                        
                for( var i = 0; i < intersects.length; i++ ) {
                        var intersection = intersects[ i ],
                                obj = intersection.object;
if (obj.material.color) {
    console.log(obj.id)
                        obj.material.color.setRGB( 1.0 - i / intersects.length, 0, 0 );
                        }
                }
         event.preventDefault();
    };
    var onMouseUp = function(event) {
mousemov=false
    };

    var onKeyDown = function(event) {

        switch(event.keyCode) {

            case 38: // up
            case 87: // w
                moveForward = true;
                break;

            case 37: // left
            case 65: // a
                moveLeft = true;
                break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                break;

            case 32: // space
attack = true;
setTimeout("attack=false;","500")
                sound1.position.copy( yawObject.position );
                sound1.play();





                moveUpward = true;
                var vector = new THREE.Vector3(0, 0, -1);

                var direction = new THREE.Vector3(0, 0, -1);
                var rotation = new THREE.Euler(0, 0, 0, "YXZ");

                rotation.set(pitchObject.rotation.x, yawObject.rotation.y, 0);

                direct = direction.applyEuler(rotation);
                direct = direct.multiplyScalar(5);

                velocity.y = 10;
                break;

        }

    };

    var onKeyUp = function(event) {

        switch(event.keyCode) {

            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // a
                moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                moveRight = false;
                break;

            case 32:

                moveUpward = false;
                break;

        }

    };
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mousedown', onMouseDown, false);
    document.addEventListener('mouseup', onMouseUp, false);
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    this.enabled = true;

    this.getObject = function() {

        return yawObject;

    };

    this.isOnObject = function(boolean) {

        isOnObject = boolean;
        canJump = boolean;

    };

    this.getDirection = function() {

        // assumes the camera itself is not rotated

        var direction = new THREE.Vector3(0, 0, -1);
        var rotation = new THREE.Euler(0, 0, 0, "YXZ");

        return function(v) {

            rotation.set(pitchObject.rotation.x, yawObject.rotation.y, 0);

            v.copy(direction).applyEuler(rotation);

            return v;

        }

    }();

    this.update = function(delta) {


        if(scope.enabled === false || die) {
            return;
        }

        delta = 2;


        velocity.x += ( -velocity.x *10) * 0.015 * delta;
        velocity.z += ( -velocity.z *10) * 0.015 * delta;

        if(moveForward) {
            velocity.z -= 0.7 * delta;
        }
        if(moveBackward) {
            velocity.z += 0.7 * delta;
        }

        if(moveUpward) {
            velocity.y = 3 * delta;
        }

        if(moveLeft) {
            velocity.x -= 0.7 * delta;
        }
        if(moveRight) {
            velocity.x += 0.7 * delta;
        }

        yawObject.translateX(velocity.x);
        yawObject.translateZ(velocity.z);

        var height = getHeight(yawObject.position.x,yawObject.position.z,true)+1;
            yawObject.position.y =height+5;
        if (height<=-64 && yawObject.position.x != 0 && yawObject.position.z!=0) {
            if(!underwaterInterval)
                underwaterInterval = setInterval(function () {$('#painDiv').css("visibility","").effect( "pulsate", {times:1,mode:'hide'}, 350 );ctext.health-=10;},3000);
                $('#underwaterDiv').css("visibility","");
        }
        else{
            clearInterval(underwaterInterval)
                $('#underwaterDiv').css("visibility","hidden");
                underwaterInterval = false;
        }

//        if (height<=-64) {
//            yawObject.position.y =-94;
//        }
//        if (Math.abs(lastheight-height)>=35) 
//            yawObject.position.y = lastheight

        lastheight=yawObject.position.y;
        
        checkPos(yawObject);


    };
};