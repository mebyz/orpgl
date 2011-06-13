//emmanuel.botros@gmail.com (2011) - Creative Commons BY 3.0 License Terms//
//------------------------------------------------------------------------//


// AIMoveable Class handles AI rules defining objects paths in 3d space 
var AIMoveable = function () {
	// virtual vectors used in member methods
	this.virt=null;
	this.virt1=null;
	this.virt2=null;
	this.virt3=null;
}

// move a collection of objects for a renderer (rd:renderer, coll:collection of objects, num:collection size) 
AIMoveable.prototype.movecoll = function (rd,coll,num){
	this.virt= new Vector(0,0,0);
	
	var killed=0;
	// get the center of gravity of the collection
	for(var i = 0; i < num; i++) {
		if (coll[i].active==true)
			this.virt.addvectorpos({'x':coll[i].x,'y':coll[i].y,'z':coll[i].z});
		else 
			killed++;
	}
	this.virt.divector((num-killed)-1);
	
	for(var i = 0; i < num; i++) {
		if (coll[i].active==true) {
			
			//rule1 : each object approaches the collective center of gravity
			this.virt1 = new Vector(this.virt.x-coll[i].x,this.virt.y-coll[i].y,this.virt.z-coll[i].z);
			this.virt1.divector(5000);
			
			this.virt2 = new Vector(0,0,0);
			this.virt3 = new Vector(0,0,0);
			for(var j = 0; j < num; j++) {
				
				//rule2 : if distance between 2 objects is too low, they repulse each other
				 if (i!=j) {
					if (coll[i].getdistpos({'x':coll[j].x,'y':coll[j].y,'z':coll[j].z}) < 2 ) {
						this.virt2.addvectorpos({'x':coll[i].x-coll[j].x,'y':coll[i].y-coll[j].y,'z':coll[i].z-coll[j].z});
						this.virt2.divector(100);
						}
				}
				
				//rule3 : objects try to get to the same speed
				if (i!=j) {
					this.virt3.addvectorpos({'x':coll[i].velocity.x-coll[j].velocity.x,'y':coll[i].velocity.y-coll[j].velocity.y,'z':coll[i].velocity.z-coll[j].velocity.z});
					this.virt3.divector(10000);
				}
				
			}
			
			var addvelocity = new Vector(0,0,0);
			
			addvelocity.addvectorpos({'x':this.virt1.x,'y':this.virt1.y,'z':this.virt1.z});
			addvelocity.addvectorpos({'x':this.virt2.x,'y':this.virt2.y,'z':this.virt2.z});
			addvelocity.addvectorpos({'x':this.virt3.x,'y':this.virt3.y,'z':this.virt3.z});
			//rule4 : each object approachs the origin
			//addvelocity.addvectorpos({'x':-coll[i].x/1000,'y':-coll[i].y/1000,'z':-coll[i].z/900});
			
			
			coll[i].velocity.addvectorpos(addvelocity);
			coll[i].addvectorpos(addvelocity);
			
			
			rd.setposx(coll[i].el,coll[i].x);
			rd.setposy(coll[i].el,coll[i].y);
			rd.setposz(coll[i].el,coll[i].z);
		}
	}
}

// Renderer Class handles communication with the 3d engine
var Renderer = function (db) {
	this.gameRenderer = null; 				// game renderer
	this.gameScene 	= null;					// game scene
	this.canvasEl	= null;					// canvas element name
	this.renderWidth = null;				// screen w size
	this.renderHeight= null;				// screen h size
	this.lasttime=null;						// last rendering time
	this.now=null;							// current time
	this.mouse=null;						// I/O mouse handler
	this.camera =null;						// main camera handler
	this.keys =null;						// I/O keyboard handler
	this.pPos = new PosRot(0,0,0,0,0,0);	// player pos & rot between loops
	this.numEnnemies=0;				 		// number of ennemies
	this.ennemyArray =null;				 	// ennemies obj array
	this.doc=new GLGE.Document();			// initiate the document handler
	db.RD=this;
}

// START : GLGE INTERFACE //

// *** loadxml *** load a xml scene
Renderer.prototype.loadxml = function (doc) {
	this.doc.load(doc);
}

// *** initobjects *** add a collection of objects to a js object
Renderer.prototype.initobjects = function (database,collection) {
	for (var prop in collection) {
		database[prop]=this.getmeshxml(collection[prop]);	
	}
}

// *** getheight *** get vertical distance to the ground for given position
Renderer.prototype.getheight = function(pos,shift){
	if(this.camera.matrix && this.camera.pMatrix){
		var H=0;
		if (shift!=null)
			H=shift;
		var origin=[pos.x,pos.y,H];
		var ret=this.gameScene.ray(origin,[0,0,1]);		
		
		if (ret==null)
			return false;
			
		if (ret['object']['id']=='Plane')
			return ret['distance'];	
		
		if (ret['object']['id']=='groundObject')
			return ret['distance'];
			
		return false;
	}
	else 
		return false;
}

// *** pick *** handle mouse picking
Renderer.prototype.mousepick = function(x,y){
	if(!this.camera){
		GLGE.error("No camera set for picking");
		return false;
	}else if(this.camera.matrix && this.camera.pMatrix){
		var height=this.gameRenderer.getViewportHeight();
		var width=this.gameRenderer.getViewportWidth();
		var offsetx=this.gameRenderer.getViewportOffsetX();
		var offsety=this.gameRenderer.getViewportHeight()-this.gameRenderer.canvas.height+this.gameRenderer.getViewportOffsetY();
		var xcoord =  ((x-offsetx)/width-0.5)*2;
		var ycoord = -((y+offsety)/height-0.5)*2;
		var invViewProj=GLGE.mulMat4(GLGE.inverseMat4(this.camera.matrix),GLGE.inverseMat4(this.camera.pMatrix));
		var origin =GLGE.mulMat4Vec4(invViewProj,[xcoord,ycoord,-1,1]);
		origin=[origin[0]/origin[3],origin[1]/origin[3],origin[2]/origin[3]];
		var coord =GLGE.mulMat4Vec4(invViewProj,[xcoord,ycoord,1,1]);
		coord=[-(coord[0]/coord[3]-origin[0]),-(coord[1]/coord[3]-origin[1]),-(coord[2]/coord[3]-origin[2])];
		coord=GLGE.toUnitVec3(coord);
		var ret = this.gameScene.ray(origin,coord);
		return ret;
	}else{
		return false;
	}
}

// *** getray *** check collision state after a mouse click
Renderer.prototype.getray = function (database,mousepos) {

	// get the screen center's position
	var aimX=this.renderWidth/2;
	var aimY=this.renderHeight/2;

	// if user clicked AND ray timeout is passed
	if 	((!database.eRay)&&(database.ePick)) {		
		
		// get collision test result
		var hitObj=this.mousepick(aimX, aimY); 
		
		// the ray actually hit something
		if(hitObj['coord']) {	
			
			// rayPosStart: player position 
			// rayPosEnd: collision position
			database.rayPosStart=[database.playerPos.x,database.playerPos.y,database.playerPos.z+1.5]
			database.rayPosEnd=[hitObj['coord'][0],hitObj['coord'][1],hitObj['coord'][2]];

			// Set the initial position and rotation of the bullet
			this.setposx(database.bullet,(database.rayPosStart[0]));
			this.setposy(database.bullet,(database.rayPosStart[1]));
			this.setposz(database.bullet,(database.rayPosStart[2]));	
			this.setrotx(database.bullet,(database.playerrot.x+(Math.PI/2)));
			this.setroty(database.bullet,(database.playerrot.y));
			this.setrotz(database.bullet,(database.playerrot.z));
			
			// Server needs to know a collision just happened
			send('COLLISION:'+database.rayPosEnd);
			
			// hit an ennemy ?
			var hitObjName=hitObj['object']['id']+"_"
			//if (hitObjName.substring(0,8)=='Moveable')
				
				database.pickedObj=hitObj['object'];
			
			// initiate bullet movement
			database.eRay=true;
			database.accelZ=0;
			// can't fire faster then 10 bullet per sec
			setTimeout("window.DB.eRay=false;",3000);
			setTimeout("$('#tim2').html('');",10000);
		}
	}	
	
	// handles the bullet movement
	if (database.eRay) {	

		// posi : next intermediate position of the bullet
		var posi=[];
		
		var distX=(database.rayPosStart[0]-database.rayPosEnd[0])
		var distY=(database.rayPosStart[1]-database.rayPosEnd[1])
		var distZ=(database.rayPosStart[2]-database.rayPosEnd[2])
		
		// 3d intermediate distance
		var dist3d = Math.sqrt(distX * distX + distY * distY + distZ * distZ);
		// constant speed
		var speed= 3;
		// intermediate eta 
		var tps=dist3d/speed;
		
		if (dist3d<speed){
			posi[0]	=	database.rayPosEnd[0];
			posi[1]	=	database.rayPosEnd[1];
			posi[2]	=	database.rayPosEnd[2];
		}
		else {
			posi[0]	=	database.rayPosStart[0]-((database.rayPosStart[0]-database.rayPosEnd[0])/tps);
			posi[1]	=	database.rayPosStart[1]-((database.rayPosStart[1]-database.rayPosEnd[1])/tps);
			posi[2]	=	database.rayPosStart[2]-((database.rayPosStart[2]-database.rayPosEnd[2])/tps);
		}
		
		database.accelZ=database.accelZ-(.01);
		posi[2]	+=database.accelZ;
		
		// moves the bullet along its path
		this.setposx(database.bullet,(posi[0]));
		this.setposy(database.bullet,(posi[1]));
		this.setposz(database.bullet,(posi[2]));
		
		// keep new "start" position for next pass
		database.rayPosStart[0]	=	posi[0]
		database.rayPosStart[1]	=	posi[1]
		database.rayPosStart[2]	=	posi[2]
		
		// posi2 : next intermediate position prediction (the "next" posi[])
		var posi2=[];

		var distX=(database.rayPosStart[0]-database.rayPosEnd[0])
		var distY=(database.rayPosStart[1]-database.rayPosEnd[1])
		var distZ=(database.rayPosStart[2]-database.rayPosEnd[2])
		
		// 3d intermediate distance
		var dist3d = Math.sqrt(distX * distX + distY * distY + distZ * distZ);
		// constant speed
		var speed= 10;
		// intermediate eta 
		var tps=dist3d/speed;
		
		if (dist3d<speed){
			posi2[0]	=	database.rayPosEnd[0];
			posi2[1]	=	database.rayPosEnd[1];
			posi2[2]	=	database.rayPosEnd[2];
		}
		else {
			posi2[0]	=	database.rayPosStart[0]-((database.rayPosStart[0]-database.rayPosEnd[0])/tps);
			posi2[1]	=	database.rayPosStart[1]-((database.rayPosStart[1]-database.rayPosEnd[1])/tps);
			posi2[2]	=	database.rayPosStart[2]-((database.rayPosStart[2]-database.rayPosEnd[2])/tps);
		}
		
		// reminder : posmed is the median point between posi and the next posi[] (posi2)
		// used to double precision on collision detection 
		var posmed=[];
		
		posmed[0]=	(posi[0]+posi2[0])/2;
		posmed[1]=	(posi[1]+posi2[1])/2;
		posmed[2]=	(posi[2]+posi2[2])/2;
	
		// loop in the enemies' collection
		for(var i = 0; i < this.numEnnemies; i++) {									
			if (this.ennemyArray[i].active==true) {
				
				// calcutate distance btween the bullet position (posi) and the ennemy
				var dX =  this.ennemyArray[i].x-posi[0];
				var dY =  this.ennemyArray[i].y-posi[1];				
				var dZ =  this.ennemyArray[i].z-posi[2];				
				var dist =  Math.sqrt(dX * dX + dY * dY + dZ * dZ);
			
				// calcutate distance btween the bullet PREDICTED position (posmed) and the ennemy
				var d2X =  this.ennemyArray[i].x-posmed[0];
				var d2Y =  this.ennemyArray[i].y-posmed[1];				
				var d2Z =  this.ennemyArray[i].z-posmed[2];				
				var dist2 =  Math.sqrt(d2X * d2X + d2Y * d2Y + d2Z * d2Z);

				if ((dist<=2)||(dist2<=2)) {
					//$("#tim2").append("COLLISION near "+this.ennemyArray[i].x+" "+this.ennemyArray[i].y+" "+this.ennemyArray[i].z+"<br>");
					this.setposz(this.ennemyArray[i].el,-1000);			
					this.ennemyArray[i].active=false;
				}
			}
		}
	}
}

// *** lookat *** Rotate object to face given position
Renderer.prototype.lookat = function (o,pos) {
	o.Lookat(pos)
}

// *** setheightfrustrum *** set object height restricted by given frustrum variables (keep,shift,value)
Renderer.prototype.setheightfrustrum = function(keep,value,obj,shift) {
	
	var keeped=keep;
	
	if (keep==0)
		keep=value;		

	var dd=keep;
		
	if (value>keep+shift) 
		dd=keep+shift;
	if (value<keep-shift) 
		dd=keep-shift;

	this.lookat(obj,[db.playerPos.x,db.playerPos.y,dd]);
	
	keep=value;
	
	if (value>keeped+shift) 
		keep=value+shift;
	if (value<keeped-shift) 
		keep=value-shift;
		
	return keep;
}	 

// *** process *** main loop
Renderer.prototype.process = function (database){

	var camera = this.getcam();
	var mousepos = this.getmousepos();
	var camerapos = this.getpos(camera);
	var camerarot = this.getrot(camera);
	database.playerPos = this.getpos(database.player);
	database.playerrot = this.getrot(database.player);
	database.headrot =  this.getrot(database.head);
	
	mousepos.x = mousepos.x - document.body.offsetLeft;
	mousepos.y = mousepos.y	- document.body.offsetTop;			
	this.getray(database,mousepos);
	
	inc = ((mousepos.y - (document.getElementById('canvas').offsetHeight / 2)) / 10000);
	inc2 = (mousepos.x - (document.getElementById('canvas').offsetWidth / 2)) / 400;
	
	if (inc < 0) 
		inc=0;
	
	var trans=GLGE.mulMat4Vec4(camera.getRotMatrix(),[0,0,-1,1]);
	var mag=Math.pow(Math.pow(trans[0],2)+Math.pow(trans[1],2),0.5);
	trans[0]=trans[0]/mag;
	trans[1]=trans[1]/mag;
	
	this.setrotx(database.player,inc/10000);
	this.setrotx(database.head,inc/10000);
	
	
	this.setrotz(database.player,(-inc2-1.57));
	this.setrotz(database.head,(-inc2));
	
	var H2=this.getheight(db.playerPos,null);
	
	if (H2!=false)
		renderer.buildnature(db);
		
	if (database.playerHeight==null)
		database.playerHeight=0;
		
	if ((!database.eJump)&&(H2>0))
		this.setposz(database.player,(-H2)+2);

	if (database.eJumped) {
		this.setposz(database.player,(database.playerPos.z-.1));	
		setTimeout("window.DB.eJumped=false",500);
	}		
		
	if (database.eJump)
		this.setposz(database.player,(database.playerPos.z+.1));	
	
	database.playerHeight=H2
	
	var mat=database.player.getRotMatrix();
	var trans=GLGE.mulMat4Vec4(mat,[0,1,-1,1]);
	var mag=Math.pow(Math.pow(trans[0],2)+Math.pow(trans[1],2),0.5);
	if (database.eJump) {
		trans[0]=trans[0]/mag*2;
		trans[1]=trans[1]/mag*2;
	}
	else {
		trans[0]=trans[0]/mag;
		trans[1]=trans[1]/mag;
	}
	
	// moving forces along axis
	var incY=0;
	var incX=0;
	var mvanim="anim1";

	if(this.keys.isKeyPressed(GLGE.KI_SPACE)) {setTimeout("window.DB.eJump=true",1);database.ePreJump=true;}
	if(this.keys.isKeyPressed(GLGE.KI_DOWN_ARROW)) {mvanim="anim3";incY-=parseFloat(trans[1]);incX-=parseFloat(trans[0]);}
	if(this.keys.isKeyPressed(GLGE.KI_UP_ARROW)) {mvanim="anim3";incY+=parseFloat(trans[1]);incX+=parseFloat(trans[0]);} 
	if(this.keys.isKeyPressed(GLGE.KI_LEFT_ARROW)) {mvanim="turnl";incY=parseFloat(trans[0]);incX-=parseFloat(trans[1]);}
	if(this.keys.isKeyPressed(GLGE.KI_RIGHT_ARROW)) {mvanim="turnr";incY-=parseFloat(trans[0]);incX+=parseFloat(trans[1]);}
	
	
	if((incY==0)&&(incX==0)) {
		if(database.timer==null) 
			database.timer=setTimeout(function(){database.RD.setanim(database,database.player,"idle");},300);
	}
	else {
		if(database.timer) {
			clearTimeout(database.timer);
			database.timer=null;
		}
		database.RD.setanim(database,database.player,mvanim);
	}
	
	if (database.playerHeight=='')
		database.playerHeight=-database.playerPos.z;
		
		$('#tim2').html(database.playerHeight);

	this.setposy(database.player,(database.playerPos.y+incY*0.5*database.playerHeight/100));
	this.setposx(database.player,(database.playerPos.x+incX*0.5*database.playerHeight/100));	

	this.setposz(camera,(database.playerPos.z+1.6-database.playerrot.x*1000+inc));

	database.playerrot = this.getrot(database.player);
	database.headpos = this.getpos(database.head);
	database.headrot = this.getrot(database.head);
	this.setposx(camera,(database.playerPos.x-300*inc*Math.cos((database.headrot.z) * 57 * Math.PI / 180)));
	this.setposy(camera,(database.playerPos.y-300*inc*Math.sin((database.headrot.z) * 57 * Math.PI / 180)));
	
	this.setposz(database.head,(database.playerPos.z-1.08));
	this.setposx(database.head,(database.playerPos.x));
	this.setposy(database.head,(database.playerPos.y));
	
	database.playerTempHeight=this.setheightfrustrum(database.playerTempHeight,(database.playerPos.z+2+inc/1000),camera,0.001);
	
	database.headpos = this.getpos(database.head);
	database.headrot = this.getrot(database.head);
	
	
	if ((this.pPos.x-(database.headpos.x)>3)||
	(this.pPos.x-(database.headpos.x)<-3)||
	(this.pPos.y-(database.headpos.y)>3)||
	(this.pPos.y-(database.headpos.y)<-3)||
	(this.pPos.z-(database.headpos.z)>3)||
	(this.pPos.z-(database.headpos.z)<-3)||
	(this.pPos.rx-(database.headrot.x)>1)||
	(this.pPos.rx-(database.headrot.x)<-1)||
	(this.pPos.ry-(database.headrot.y)>1)||
	(this.pPos.ry-(database.headrot.y)<-1)||
	(this.pPos.rz-(database.headrot.z)>1)||
	(this.pPos.rz-(database.headrot.z)<-1)) {
		var sx='';
		var sy='';
		var sz='';
		var srx='';
		var sry='';
		var srz='';
				
		//if (this.pPos.x!=database.headpos.x) 
		sx=Math.round(database.headpos.y*100)/100;
		//if (this.pPos.y!=database.headpos.y) 
		sy=Math.round(database.headpos.x*100)/100;
		//if (this.pPos.z!=database.headpos.z) 
		sz=Math.round(database.headpos.z*100)/100;
		//if (this.pPos.rx!=database.headrot.x) 
		srx=Math.round(database.headrot.x*100)/100;
		//if (this.pPos.ry!=database.headrot.y) 
		sry=Math.round(database.headrot.y*100)/100;
		//if (this.pPos.rz!=database.headrot.z) 
		srz=Math.round(database.headrot.z*100)/100;
		var msg = (sy)+ ";"+ (sx)+";"+(sz)+'|'+(srx)+ ";"+ (sry)+";"+(srz);
			
		//var msg = (database.headpos.x)+ ";"+ (database.headpos.y)+";"+(database.headpos.z)+'|'+(database.headrot.x)+ ";"+ (database.headrot.y)+";"+(database.headrot.z);
		this.pPos.x=(database.headpos.x);
		this.pPos.y=(database.headpos.y);
		this.pPos.z=(database.headpos.z);
		this.pPos.rx=(database.headrot.x);
		this.pPos.ry=(database.headrot.y);
		this.pPos.rz=(database.headrot.z);		
		send(msg);
		database.tick=true;
		setTimeout("window.DB.tick=false",10000);
	}
}

// set object position in 3d
Renderer.prototype.setposx = function (o,x) {
	o.setLocX(x);
}

Renderer.prototype.setposy= function (o,y) {	
	o.setLocY(y);
}

Renderer.prototype.setposz= function (o,z) {
	o.setLocZ(z);
}

// set object rotation in 3d	
Renderer.prototype.setrotx= function (o,x) {
	o.setRotX(x);
}

Renderer.prototype.setroty= function (o,y) {
	o.setRotY(y);
}

Renderer.prototype.setrotz= function (o,z) {
	o.setRotZ(z);
}

// push an object in a object collection
Renderer.prototype.addobj = function (o,o2) {
	o.addObject(o2);
}

// set an object's material at runtime
Renderer.prototype.setmat = function (o,mat) {
	o.setMaterial(mat);
}

// create a new object
Renderer.prototype.setobj = function (mesh,name,posrot,mat,pick,bag,counter,type,tvar,scale) {
	
	var	obj=(new GLGE.Object).setDrawType(GLGE.DRAW_TRIANGLES);
			
	obj.setMesh(mesh);
	obj.setScale(scale);
	obj.setMaterial(mat);
	obj.setZtransparent(true);
	obj.id=name+counter;
	obj.pickable=pick;
			
	var x=posrot.x;
	var y=posrot.y;
	var z=posrot.z;
	var rx=posrot.rx;
	var ry=posrot.ry;
	var rz=posrot.rz;
	
	if (x!=null)
		this.setposx(obj,x);
	if (y!=null)
		this.setposy(obj,y);
	if (z!=null)
		this.setposz(obj,z);		
	if (rx!=null)
		this.setrotx(obj,rx);
	if (ry!=null)
		this.setroty(obj,ry);
	if (rz!=null)
		this.setrotz(obj,rz);

	this.addobj(bag,obj);
	posSav = this.getpos(obj)
	
	if (type==0) {
		tvar.el=obj;
	}
	if (type==1)
		tvar.push(obj);		
}

// sets the game renderer size
Renderer.prototype.setgr = function (el) {
	this.canvasEl=el
	this.gameRenderer = new GLGE.Renderer(document.getElementById(el));

	if( typeof( window.innerWidth ) == 'number' ) {
		this.renderWidth = window.innerWidth;
		this.renderHeight = window.innerHeight;
	} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
		this.renderWidth = document.documentElement.clientWidth;
		this.renderHeight = document.documentElement.clientHeight;
	} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
		this.renderWidth = document.body.clientWidth;
		this.renderHeight = document.body.clientHeight;
	}
}

// create the scene	
Renderer.prototype.setsc = function (name) {
	this.gameScene = new GLGE.Scene();
	this.gameScene = this.doc.getElement(name)
	this.gameRenderer.setScene(this.gameScene);
	this.gameRenderer.canvas.width = this.renderWidth;
	this.gameRenderer.canvas.height = this.renderHeight;
}

// create the main camera
Renderer.prototype.setcam = function () {
	var camera = this.gameScene.camera;
	camera.setAspect(this.renderWidth/this.renderHeight);
	this.camera=camera;
}

// get mesh from object name
Renderer.prototype.getmeshxml = function (name) {
	return this.doc.getElement(name);
}

// set the ambient fog
Renderer.prototype.setfog = function (near, far) {		
	this.gameScene.setFogType(GLGE.FOG_QUADRATIC);
	this.gameScene.fogNear=near;
	this.gameScene.fogFar=far;
}	

// create the mouse handler	
Renderer.prototype.getmouse = function () {
	this.mouse =	new GLGE.MouseInput(document.getElementById(this.canvasEl));
}	

// get current mouse pos
Renderer.prototype.getmousepos = function () {
	return this.mouse.getMousePosition();
}

// get current object pos (x,y,z)
Renderer.prototype.getpos = function (obj) {	
	return obj.getPosition();
}

// get current object pos (rx,ry,rz)
Renderer.prototype.getrot = function (obj) {	
	return obj.getRotation();
}

// return the main camera
Renderer.prototype.getcam = function () {		
	return this.gameScene.camera;	
};

// create the keys handler
Renderer.prototype.getkeyboard = function () {		
	this.keys = new GLGE.KeyInput();
};

Renderer.prototype.render = function () {
	this.now = parseInt(new Date().getTime());
	this.gameRenderer.render();
	this.lasttime = this.now;		
}
// set a collection of objects to the ground
Renderer.prototype.setposground = function (database,coll) {
	for (var i=0;i<coll.count;i++) {
		cup=database.player.getPosition();
		cp =coll.cElems[i].getPosition();
		this.setposx(database.player,cp.x);
		this.setposy(database.player,cp.y);
		database.playerPos = this.getpos(database.player);
		H3=this.getheight(database.playerPos,null);
		if (H3>0) {
			this.setposz(coll.cElems[i],-H3+1);
			this.setposx(database.player,cup.x);
			this.setposy(database.player,cup.y);
		}
		database.playerPos = this.getpos(database.player);
	}
}

Renderer.prototype.buildnature = function (database) {
		if (!database.eClusterCrea){
	//		database.Forest=new Cluster(this,database);
	//		database.Forest.load(database.tree,database.ObjBag,database.materialGrass,0,1);	
			database.Grass=new Cluster(this,database);
			database.Grass.load(database.bush,database.ObjBag,database.materialBush,1,5);	
			database.Branches=new Cluster(this,database);
			database.Branches.load(database.branches,database.ObjBag,database.materialBush,2,1);	
			database.eClusterCrea=true;	
		}
		
		if((database.eClusterCrea)&&(!database.eClusterPos)) { 
			this.setposground(database,database.Grass);
			this.setposground(database,database.Branches);
		//	this.setposground(database,database.Forest);
			database.eClusterPos=true;
		}
}

Renderer.prototype.setanim = function (db,object,anim) {
	if((db.state==anim)&&(anim!="idle")) return;
	if(anim=="anim1"){
		object.setStartFrame(290,200,true);
		object.setFrames(18);
	}else if(anim=="idle"){
		object.setStartFrame(0,200,true);
		object.setFrames(270);
	}else if(anim=="anim3"){
		object.setStartFrame(270,100,true);
		object.setFrames(19);
	}else if(anim=="turnl"){
		object.setStartFrame(309,200,true);
		object.setFrames(12);
	}else if(anim=="turnr"){
		object.setStartFrame(322,200,true);
		object.setFrames(12);
	}
	db.state=anim;
}

Renderer.prototype.initennemies = function (database) {
//init ennemies
	this.ennemyArray = [];
	this.numEnnemies = 20;
	for(var i = 0; i < this.numEnnemies; i++) {
		this.ennemyArray.push(new Vector(window.UTILS.random(300), window.UTILS.random(300),-170));
		this.ennemyArray[i].velocity=new Vector(0,0,0);
		this.setobj( database.robot.getMesh(),"Moveable_",(new PosRot(this.ennemyArray[i].x,this.ennemyArray[i].y,this.ennemyArray[i].z,null,null,null)),database.materialBush,false,database.ObjBag,database.objectsCounter++,0,this.ennemyArray[i],1);
	}
}

Renderer.prototype.multi = function (database) {
	for (var i=0;i<ns.length;i++) {
	   if (CONFIG.nick!=ns[i]) {
			if (myJSONUserPosArray[ns[i]])	{

				var straw=myJSONUserPosArray[ns[i]]+"";
				var stmid=straw.split('|');
				var st=stmid[0].split(';');
				var strot=stmid[1].split(';');
				
				if (myJSONUserPosArray2[ns[i]]) {
					
					var straw2=myJSONUserPosArray2[ns[i]]+"";
					$('#tim2').append(straw2+"<br>");
					var stmid2=straw2.split('|');
					var st2=stmid2[0].split(';');
					var strot2=stmid2[1].split(';');
					
					var ndistX=((st2[0]*1)-(st[0]*1))/2;
					var ndistY=((st2[1]*1)-(st[1]*1))/2;
					var ndistZ=((st2[2]*1)-(st[2]*1))/2;
					
					if (ndistX>1) ndistX=1;
					if (ndistY>1) ndistY=1;
					if (ndistZ>1) ndistZ=1;
					if (ndistX<-1) ndistX=-1;
					if (ndistY<-1) ndistY=-1;
					if (ndistZ<-1) ndistZ=-1;
					
					var nlocX=((st2[0]*1) - ndistX);
					var nlocY=((st2[1]*1) - ndistY);
					var nlocZ=((st2[2]*1) - ndistZ);
					
					this.setposx(database.opponent,(nlocX));
					this.setposy(database.opponent,(nlocY));
					this.setposz(database.opponent,(nlocZ+1));	
					
					this.setrotz(database.opponent,strot[2]+3.14);
					
					myJSONUserPosArray2[ns[i]]= nlocX+";"+ nlocY+";"+ nlocZ+"|"+strot2[0]+";"+strot2[1]+";"+strot2[2]
				}
			}
		}
	}
}

// END : GLGE INTERFACE //

// DB Class handles objects instances and in-game variables
var DB = function (utils) {
	this.timer		= null;
	this.state		= "idle";
	this.eJump		= false; 		
	this.eJumped	= false; 		
	this.ePreJump	= false; 		
	this.eAnim		= false;			
	this.ePAnim		= false;			
	this.ePAnimWalk	= false;	
    this.ePick		= false; 	
	this.eRay			= false; 	
	this.eClusterCrea = false; 
	this.eClusterPos	= false;	
	
	this.pickedObj		= null;
	this.rayPosStart	= null
	this.rayPosEnd		= null;
	this.playerHeight	= null;
	this.tempHeight		= null;
	this.playerPos	= null;
	this.objectsCounter	= 0;
	this.tick		= false;
	this.playerrot	= null;
	this.headrot	= null;
	this.headpos	= null;
	
	this.AnimFramesArray = [0,120,125,135];
	this.RD		= null; // renderer instance

	this.accelZ = null; // bullet gravity
		
	window.DB	= this;
	window.UTILS= utils;
	
};

// Vector Class Represent a 3d Vector which can be associated either to an object's position, a velocity,... 
var Vector = function (x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.active=true;
	this.el=null;
	this.velocity=null;
}

Vector.prototype.addvectorpos = function (pos){
	this.x+=pos.x;
	this.y+=pos.y;
	this.z+=pos.z;
}

Vector.prototype.remvectorpos = function (pos){
	this.x-=pos.x;
	this.y-=pos.y;
	this.z-=pos.z;
}

Vector.prototype.getdistpos = function (pos){
	var distX = this.x-pos.x;
	var distY = this.y-pos.y;
	var distZ = this.z-pos.z;
	return Math.sqrt(distX * distX + distY * distY + distZ * distZ);
}

Vector.prototype.divector = function (div){
	this.x/=div;
	this.y/=div;
	this.z/=div;
}
// Cluster Class contains a cluster of clone objects (forest,grass,..)
var Cluster = function (_rd,_db) {
	this.clusterObj=null;
	this.objContainer=null;
	this.count=0;
	this.Elems=null;
	this.cElems=[];
	this.idx=-1;
	this.rd=_rd;
	this.dtb=_db;
}

Cluster.prototype.load = function (obj,cont,mat,idx,sc) {
		this.idx=idx;
		this.Elems=Nature[idx];
		this.count=this.Elems.length;		
		this.clusterObj=obj;
		this.objContainer=cont;
		
		for (var i=0;i<this.count;i++) {
			// rd is a Renderer Instance
			this.rd.setobj( this.clusterObj.getMesh(),"Cube_",(new PosRot(this.Elems[i][0],this.Elems[i][1],null,null,this.Elems[i][2],this.Elems[i][3])),mat,false,this.objContainer,db.objectsCounter++,1,this.cElems,sc);
		}
		
		this.dtb.eClusterCrea=true;
}

var PosRot = function (x,y,z,rx,ry,rz) {
	this.x=x;
	this.y=y;
	this.z=z;
	this.rx=rx;
	this.ry=ry;
	this.rz=rz;
}

var Utils = function () {
this.loaded=true;	
}

Utils.prototype.setdom = function(iRenderer) {
	$('#canvas').mousedown( function(e) { window.DB.ePick = true; } );
	$('#canvas').mouseup( function(e) { window.DB.ePick = false; } );
	$('#mcur').show().css({"left":(iRenderer.renderWidth/2-20)+"px","top":(iRenderer.renderHeight/2-20)+"px"});
}

Utils.prototype.random = function(maxNum) {
	return Math.ceil(Math.random() * maxNum);
}

Utils.prototype.setmousewheel = function() {
	canvas.onmousewheel = function( e ){
		delta=e.wheelDelta/40;
		if(delta!=0){
			renderer.camera.setFovY(parseFloat(renderer.camera.getFovY())-delta);
		}
	}
}
////////////////////////////////////////////////////////////////////////
var utils=new Utils();
var db=new DB(utils);
var renderer=new Renderer(db); 
var ai=new AIMoveable();
////////////////////////////////////////////////////////////////////////

renderer.doc.onLoad = function() {
	renderer.setgr('canvas');
	renderer.setsc("mainscene");
	renderer.setfog(20,200000);
	renderer.setcam();
	renderer.getmouse();
	renderer.getkeyboard();
	renderer.initobjects(db,{
	'ObjBag' : 'graph',
	'materialBlack' : 'black',
	'materialGrass' : 'Material',
	'robot' : 'Sphere',
	'head' : 'head',
	'bullet' : 'Cube',
	'player' : 'player',
	'opponent' : 'opponent',
	'tree' : 'plant_pmat8.001',
	'bush' : 'Bush 3',
	'branches' : 'Bush 2',
	'materialBush' : 'Flower Green',
	'materialFlower' : 'fougere',
	'materialGround' : 'groundmat',
	'terrain' : 'Plane',
	'groundObject':'ground'});
	renderer.setposz(db.groundObject,-215);
	renderer.setmat(db.terrain,db.materialGround);
	utils.setdom(renderer);
	utils.setmousewheel();
	renderer.initennemies(db);
	
	setInterval( function () {
		ai.movecoll(renderer,renderer.ennemyArray,renderer.numEnnemies);
		renderer.process(window.DB);
		renderer.multi(window.DB);
		renderer.render(db,utils);
	},1);
};

renderer.loadxml("client/meshes/nature.xml");
