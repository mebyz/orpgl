// emmanuel DOT botros AT gmail DOT com 
// 2011//2012


// PosRot Class represents a Position/Rotation couple of triplets
function PosRot(x,y,z,rx,ry,rz) {
	this.x=x
	this.y=y
	this.z=z
	this.rx=rx
	this.ry=ry
	this.rz=rz
}

// Renderer Class handles communication with the 3d engine
function Renderer() {

	this.gameRenderer = null;
	this.gameScene 	= null;		
	this.canvasEl	= null;
				
	this.renderWidth = null;		
	this.renderHeight= null;
	
    this.evtPick= false; 	
	this.evtRay= false; 	
	
	this.setPosX=_setposx;
	this.setPosY=_setposy;
	this.setPosZ=_setposz;
	this.setObj=_setobj;	
	this.setGameRenderer=_setgr;	
	this.setScene=_setsc;	
	this.setCamera=_setcam;	
	this.setDoc=_setdoc;	
	this.setFog=_setfog;	
	this.getMouseHandler=_getmouse
	this.getKeysHandler=_getkeys
	this.getMesh=_getmesh

	this.doc=this.setDoc();
	
	////////////////////////////	
	// START : GLGE INTERFACE //

	function _setdoc() {
		var doc = new GLGE.Document(); 
		return doc;
	}
	
	function _setposx(o,x) {
		if (typeof(o.setLocX)=='undefined')
			return;	
		o.setLocX(x);
	}
	
	function _setposy(o,y) {
		if (typeof(o.setLocY)=='undefined')
			return;	
		o.setLocY(y);
	}
	
	function _setposz(o,z) {
		if (typeof(o.setLocZ)=='undefined')
			return;	
		o.setLocX(z);
	}
	
	function _setobj(mesh,name,posrot,mat,pick,bag,counter,type,tvar) {
		
		var	obj=(new GLGE.Object).setDrawType(GLGE.DRAW_TRIANGLES);
				
		obj.setMesh(mesh);
		obj.setMaterial(mat);
		obj.setZtransparent(false);
		obj.id=name+counter;
		obj.pickable=pick;
				
		var x=posrot.x;
		var y=posrot.y;
		var z=posrot.z;
		var rx=posrot.rx;
		var ry=posrot.ry;
		var rz=posrot.rz;
		
		if (x!=null)
			obj.setLocX(x);
		if (y!=null)
			obj.setLocY(y);
		if (z!=null)
			obj.setLocZ(z);		
		if (rx!=null)
			obj.setLocX(rx);
		if (ry!=null)
			obj.setLocY(ry);
		if (rz!=null)
			obj.setLocZ(rz);

		bag.addObject(obj);
		posSav = obj.getPosition()
		
		if (type==0)
			tvar.el=obj;
				
		if (type==1)
			tvar.push(obj);		
	}

	function _setgr(el) {
		this.canvasEl=el
		this.gameRenderer = new GLGE.Renderer(document.getElementById(this.canvasEl));
		
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
	
	function _setsc(name) {
		this.gameScene = new GLGE.Scene();
		this.gameScene = this.doc.getElement(name)
		this.gameRenderer.setScene(this.gameScene);
		this.gameRenderer.canvas.width = this.renderWidth;
		this.gameRenderer.canvas.height = this.renderHeight;
	}
	
	function _setcam() {
		var camera = this.gameScene.camera;
		camera.setAspect(this.renderWidth/this.renderHeight);
		return camera;
	}
	
	function _getmesh(name) {
		return this.doc.getElement(name);
	}

	function _setfog(near, far) {		
		this.gameScene.setFogType(GLGE.FOG_QUADRATIC);
		this.gameScene.fogNear=near;
		this.gameScene.fogFar=far;
	}	
		
	function _getmouse() {		
		return new GLGE.MouseInput(document.getElementById(this.canvasEl));	
	}	

	function _getkeys() {		
		return new GLGE.KeyInput();
	}	
		
	
	// END : GLGE INTERFACE //
	//////////////////////////
}

// DB Class handles objects instances and in-game variables
function DB() {
	
	this.evtJump		= false; 		
	this.evtJumped	= false; 		
	this.evtPreJump	= false; 		
	this.evtAnim		= false;			
	this.evtPAnim	= false;			
	this.evtPAnimWalk= false;		
	this.incY		= 0;					
	this.incX		= 0;		
	this.ob0			= null;
	this.dec			= 0;
	this.pickedObj	= null;
	this.nameObj		= null;
	this.ret			= null;
	this.pos0		= null
	this.pos1		= null;
	this.testt		= [];
	this.H			= null;
	this.evtClusterCrea 	= false; 
	this.evtClusterPos	= false;
	
	this.tree		= null;
	this.bush		= null;
	this.bush_mat	= null;
	this.robot		= null;
	this.grass		= null;
	this.branches	= null;
	this.objBag		= null;
	this.flower_mat		= null;
	this.head		= null;
	this.player		= null;
	this.p2		= null;
	this.cube		= null;
	this.Forest		= null;
	this.Grass		= null;
	this.Branches	= null;
	this.robot_mat	= null;
	this.black	= null;

	this.objCount	= 0;
	this.tick		= false;
	this.KRotz		= 0;
	this.black		= null;
	this.moveableEnd	= 100;
	
	this.AnimFramesArray = [0,120,125,135];
	
	window.DB=this;
	
};

// Moveable Class Represent a positionable object in the 3d space 
function Moveable(x, y,mat) {
	this.x = x;
	this.y = y;
	this.el=null;
	this.accelX=0;
	this.accelY=0;
	this.xVelocity = 1;
	this.yVelocity = -1;	
}

// Cluster Class contains a cluster of clone objects 
function Cluster() {
	
	this.clusterObj=null;
	this.objContainer=null;
	this.count=0;
	this.load= cload;
	this.Elems=null;
	this.cElems=[];
	this.idx=-1;
	
	function cload(obj,cont,mat,idx) {
	
		this.idx=idx;
		this.Elems=Nature[idx];
		this.count=this.Elems.length;		
		this.clusterObj=obj;
		this.objContainer=cont;
		
		for (var i=0;i<this.count;i++) {
	
		renderer.setObj( this.clusterObj.getMesh(),"Cube_",(new PosRot(this.Elems[i][0],this.Elems[i][1],null,null,this.Elems[i][2],this.Elems[i][3])),mat,false,this.objContainer,db.objCount++,1,this.cElems);
			
		}
		
		db.evtClusterCrea=true;
	}
}

var random = function(maxNum) {
	return Math.ceil(Math.random() * maxNum);
}


var db 		= new DB(); 
var renderer 	= new Renderer(); 

////////////////////////////////////////////////////////////////////////


renderer.doc.onLoad = function() {	
	
	renderer.setGameRenderer('canvas');
	renderer.setScene("Scene");
	renderer.setFog(20,2000);	
	
	var camera = renderer.setCamera();
	var mouse = renderer.getMouseHandler();
	var keys = renderer.getKeysHandler();
	
	setDomEvents(renderer);
	
	var pPos = new PosRot(0,0,0,0,0,0);
	
	// this is an object container
	db.objBag=renderer.getMesh('graph');
	
	

	//some materials
	db.black=renderer.getMesh('black');
	db.grass=renderer.getMesh('Material');
	db.bush_mat=renderer.getMesh('Bush Green.001');
	db.robot_mat=renderer.getMesh('Material.003');
	db.flower_mat=renderer.getMesh('Flower Green');

	//ennemies
	db.robot=renderer.getMesh('Sphere');	
	// the player
	db.head = renderer.getMesh('head');
	// the opponent
	db.player = renderer.getMesh('plane2');
	//the bullet
	db.p2 = renderer.getMesh('Cube');
	//
	db.cube = renderer.getMesh('plane');	
	// nature
	db.tree=renderer.getMesh('plant_pmat8.001');
	db.bush=renderer.getMesh('Bush 1');
	db.branches=renderer.getMesh('Bush 2');	
	// sea plane
	groundObject = renderer.getMesh('groundObject');
	groundObject.setLocZ(-300);
	
	setTimeout('moveP();moveP2();',1000); 
	
	//init ennemies
	var maxVelocity = 1;
	var moveables = [];
	var numMoveables = 0;
	for(var i = 0; i < numMoveables; i++) {
		moveables.push(new Moveable(random(db.moveableEnd), random(db.moveableEnd),db.grass));
		renderer.setObj( db.robot.getMesh(),"Moveable_",(new PosRot(null,moveables[i].y,moveables[i].z,-250,null,null)),db.robot_mat,true,db.objBag,db.objCount++,0,moveables[i]);
	}
	
	function movemoveables() {
		cubepos=db.cube.getPosition()
		for(var i = 0; i < numMoveables; i++) {					
		var distanceX = 0;
		var distanceY = 0; 
		var nPosX = 0;
		var nPosY = 0; 
		var distX = moveables[i].x - cubepos.x;
		var distY = moveables[i].y - cubepos.y;
		var distance =  Math.sqrt(distX * distX + distY * distY);
		
		if (distance>50) {
			
			if (( moveables[i].x>cubepos.x))
				distanceX = -1/distance*distance/500;
			else
				distanceX = 1/distance*distance/500;
			if (( moveables[i].y>cubepos.y))
				distanceY = -1/distance*distance/500;
			else
				distanceY = 1/distance*distance/500;

			}
	
			if (distanceY>0)moveables[i].accelY+=1;
			else moveables[i].accelY-=1;
			if (distanceX>0)moveables[i].accelX+=1;
			else moveables[i].accelX-=1;
			
			nPosX=moveables[i].x+distanceX+moveables[i].accelX/1000
			nPosY=moveables[i].y+distanceY+moveables[i].accelY/1000
			
	
			moveables[i].el.setLocX(nPosX);
			moveables[i].el.setLocY(nPosY);
			moveables[i].x=nPosX
			moveables[i].y=nPosY
		}
		
		
	};			

	function process(){
	
		var camera = renderer.gameScene.camera;
		var mousepos = mouse.getMousePosition();
		mousepos.x = mousepos.x - document.body.offsetLeft;
		mousepos.y = mousepos.y	- document.body.offsetTop;			

		getPosRotObjects();
		
		processRay(mousepos);
		
		inc = ((mousepos.y - (document.getElementById('canvas').offsetHeight / 2)) / 200)+2;
		inc2 = (mousepos.x - (document.getElementById('canvas').offsetWidth / 2)) / 200;
		
		if (inc <=0.5) inc=0.5;
		var trans=GLGE.mulMat4Vec4(camera.getRotMatrix(),[0,0,-1,1]);
		var mag=Math.pow(Math.pow(trans[0],2)+Math.pow(trans[1],2),0.5);
		trans[0]=trans[0]/mag;
		trans[1]=trans[1]/mag;
		
		if (inc<1) {
			db.cube.setRotX(inc/1000);
			db.head.setRotX(inc/1000);
		}
		
		db.cube.setRotZ(-inc2*2+1.57+db.dec);
		db.head.setRotZ(-inc2*2+db.dec);
		
	
		var H2=renderer.gameScene.getHeight(null);
		
		//if (H2!=false)
		//	buildNature();
			
		if (db.H==null)db.H=0;
		
		
		if ((!db.evtJump))
			db.cube.setLocZ(-H2-.04);	
			
			

		if (db.evtJumped)	
					{db.cube.setLocZ(cubepos.z-.1);	setTimeout("db.evtJumped=false",500);}		
			
		if (db.evtJump)
			db.cube.setLocZ(cubepos.z+.1);	
		db.H=H2
		
	var mat=db.cube.getRotMatrix();
	var trans=GLGE.mulMat4Vec4(mat,[0,1,-1,1]);
	var mag=Math.pow(Math.pow(trans[0],2)+Math.pow(trans[1],2),0.5);
	if (db.evtJump) {
		trans[0]=trans[0]/mag/8;
		trans[1]=trans[1]/mag/8;
	}
	else {
		trans[0]=trans[0]/mag/18;
		trans[1]=trans[1]/mag/18;
	}
	
	db.incY=0;
	db.incX=0;
	
	if(keys.isKeyPressed(GLGE.KI_SPACE)) {setTimeout("db.evtJump=true",1);db.evtPreJump=true;moveJump();	moveables.push(new Moveable(random(moveableEnd), random(moveableEnd),db.grass));numMoveables++;}

	if(keys.isKeyPressed(GLGE.KI_DOWN_ARROW)) {db.incY=db.incY+parseFloat(trans[1]);db.incX=db.incX+parseFloat(trans[0]);if((!db.evtPreJump)&&(!db.evtJump))movePf();}
	if(keys.isKeyPressed(GLGE.KI_UP_ARROW)) {db.incY=db.incY-parseFloat(trans[1]);db.incX=db.incX-parseFloat(trans[0]);if((!db.evtPreJump)&&(!db.evtJump))movePf();} 
	if(keys.isKeyPressed(GLGE.KI_RIGHT_ARROW)) {db.incY=db.incY+parseFloat(trans[0]);db.incX=db.incX-parseFloat(trans[1]);if((!db.evtPreJump)&&(!db.evtJump))movePf();}
	if(keys.isKeyPressed(GLGE.KI_LEFT_ARROW)) {db.incY=db.incY-parseFloat(trans[0]);db.incX=db.incX+parseFloat(trans[1]);if((!db.evtPreJump)&&(!db.evtJump))movePf();}

	
	db.cube.setLocY(cubepos.y+db.incY*0.05*(now-lasttime)*db.H/100);
	db.cube.setLocX(cubepos.x+db.incX*0.05*(now-lasttime)*db.H/100);	
	camera.setLocZ((cubepos.z+1.6-cuberot.x*1000+inc));
	cubepos = db.cube.getPosition();
	cuberot = db.cube.getRotation();
	headpos = db.head.getPosition();
	headrot = db.head.getRotation();
	camera.setLocX(cubepos.x-2*inc*Math.cos((headrot.z) * 57 *Math.PI / 180));
	camera.setLocY(cubepos.y-2*inc*Math.sin((headrot.z) * 57* Math.PI / 180));
	
	db.head.setLocZ(cubepos.z-1.08);
	db.head.setLocX(cubepos.x);
	db.head.setLocY(cubepos.y);
	

	db.KRotz=interlopateHeight(db.KRotz,(cubepos.z+2+inc/1000),camera);
	
	
		
	if((((pPos.x-(headpos.x)>1)||(pPos.x-(headpos.x)<-1))||((pPos.z-(headpos.z)>1)||(pPos.z-(headpos.z)<-1))||((pPos.rx-(headrot.x)>1)||(pPos.rx-(headrot.x)<-1))||((pPos.rz-(headrot.z)>1)||(pPos.rz-(headrot.z)<-1))||((pPos.ry-(headrot.y)>1)||(pPos.ry-(headrot.y)<-1)))) {
		var msg = (headpos.x)+ ";"+ (headpos.y)+";"+(headpos.z)+'|'+(headrot.x)+ ";"+ (headrot.y)+";"+(headrot.z);
		pPos.x=(headpos.x);
		pPos.y=(headpos.y);
		pPos.z=(headpos.z);
		pPos.rx=(headrot.x);
		pPos.ry=(headrot.y);
		pPos.rz=(headrot.z);		
		send(msg);
		db.tick=true;
		setTimeout("db.tick=false",10000);
	}
}
	
	
	canvas.onmousewheel = function( e ){
		delta=e.wheelDelta/40;
		if(delta!=0){
			camera.setFovY(parseFloat(camera.getFovY())-delta);
		}
	}
	
	
	function getPosRotObjects() {
		
		camerarot = camera.getRotation();
		camerapos = camera.getPosition();
		cubepos = db.cube.getPosition();
		cuberot = db.cube.getRotation();
		groundObjectpos = groundObject.getPosition();
		headrot = db.head.getRotation();
		
	}
	
	function buildNature() {

		if (!db.evtClusterCrea){
			//db.Forest=new Cluster;
			//db.Forest.load(db.tree,db.objBag,db.grass,0);	
			db.Grass=new Cluster;
			db.Grass.load(db.bush,db.objBag,db.flower_mat,1);	
			db.Branches=new Cluster;
			db.Branches.load(db.branches,db.objBag,db.bush_mat,2);	
			db.evtClusterCrea=true;	
		}
		
		if((db.evtClusterCrea)&&(!db.evtClusterPos)) { 
		
			for (var i=0;i<db.Grass.count;i++) {
				cup=db.cube.getPosition();
				cp =db.Grass.cElems[i].getPosition();
				renderer.setPosX(db.cube,cp.x);
				renderer.setPosY(db.cube,cp.y);
				H3=renderer.gameScene.getHeight(null);
				renderer.setPosZ(db.Grass.cElems[i],-H3+1);
				renderer.setPosX(db.cube,cup.x);
				renderer.setPosY(db.cube,cup.y);
			}
			for (var i=0;i<db.Branches.count;i++) {
				cup=db.cube.getPosition();
				cp =db.Branches.cElems[i].getPosition();
				renderer.setPosX(db.cube,cp.x);
				renderer.setPosY(db.cube,cp.y);
				H3=renderer.gameScene.getHeight(null);
				renderer.setPosZ(db.Branches.cElems[i],-H3+1);
				renderer.setPosX(db.cube,cup.x);
				renderer.setPosY(db.cube,cup.y);
			}
		}
	}

	

	function processRay(mousepos) {
		
		cx=mousepos.x;
		cy=mousepos.y;
		cx=renderer.renderWidth/2;
		cy=renderer.renderHeight/2;
		
		
		$("#tim1").html(renderer.evtRay+" "+renderer.evtPick)
		
		if 	((!renderer.evtRay)&&(renderer.evtPick)) {	
			
			db.ob0=renderer.gameScene.pick3(cx, cy);
			
			
			if(db.ob0['coord']) {
				
				db.pos0=[cubepos.x,cubepos.y,cubepos.z+1.5]
				db.pos1=[db.ob0['coord'][0],db.ob0['coord'][1],db.ob0['coord'][2]];
				db.p2.setLocX(db.pos0[0]);
				db.p2.setLocY(db.pos0[1]);
				db.p2.setLocZ(db.pos0[2]);	
				db.p2.setRotX(cuberot.x+1.57)
				db.p2.setRotY(cuberot.y)
				db.p2.setRotZ(cuberot.z)
				
				send('COLLISION:'+db.pos1);
			}
		
			db.nameObj=db.ob0['object']['id']+"_"
			
			$("#tim1").html(db.nameObj.substring(0,4))
			if (db.nameObj.substring(0,4)=='Moveable')
				db.pickedObj=db.ob0['object'];
		
			renderer.evtRay=true;
			setTimeout("renderer.evtRay=false;",100);
			
		}	
		
		if (renderer.evtRay) {	
			
			var posi=[]
			posi[0]	=	db.pos0[0]-(db.pos0[0]-db.pos1[0])
			posi[1]	=	db.pos0[1]-(db.pos0[1]-db.pos1[1])
			posi[2]	=	db.pos0[2]-(db.pos0[2]-db.pos1[2])
			db.p2.setLocX(posi[0]);
			db.p2.setLocY(posi[1]);
			db.p2.setLocZ(posi[2]);
			
			db.pos0[0]	=	posi[0]
			db.pos0[1]	=	posi[1]
			db.pos0[2]	=	posi[2]
			
			for(var i = 0; i < numMoveables; i++) {					
				
				var PdistX =  moveables[i].x-posi[0];
				var PdistY =  moveables[i].y-posi[1];
				
				var Pdistance =  Math.sqrt(PdistX * PdistX + PdistY * PdistY)//+ PdistZ * PdistZ);

				//"kill" the moveable XD
				
				if (Pdistance<5) {
					moveables[i].el.setLocZ(-1000);			
				}
			}
		}
	}
	
	function multi() {
		
		for (var i=0;i<ns.length;i++) {

			$("#tim").append(ns[i]+" "+ myJSONUserPosArray[ns[i]]+"<br/>")
		   if (CONFIG.nick!=ns[i]) {
				if (myJSONUserPosArray[ns[i]])	{
					if (myJSONUserPosArray2[ns[i]])
					{
						
						}
					var straw=myJSONUserPosArray[ns[i]]+"";
					var stmid=straw.split('|');
					var st=stmid[0].split(';');
					var strot=stmid[1].split(';');
					
					
					if (myJSONUserPosArray2[ns[i]]) {
						
						var straw2=myJSONUserPosArray2[ns[i]]+"";
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
						
					
						db.player.setLocX(nlocX);
						db.player.setLocY(nlocY);
						db.player.setLocZ(nlocZ+1);	
						db.player.setRotZ((strot[2])-4.8)
						if (moveplayer)	{		
							movePf2();
							moveplayer=false;
						}
						
						myJSONUserPosArray2[ns[i]]= nlocX+";"+ nlocY+";"+ nlocZ+"||"+strot2[0]+";"+strot2[1]+";"+strot2[2]						

					}
				}
			}     
		}
	}

	var lasttime = 0;
	var frameratebuffer = 60;
	start = parseInt(new Date().getTime());
	var now;

	function render() {
		
		$("#tim").html("")
		
		now = parseInt(new Date().getTime());
		fps = Math.round(((frameratebuffer * 9) + 1000 / (now - lasttime)) / 10);

		process();

		multi();
		
		$("#tim").html("");
		movemoveables();
		
		renderer.gameRenderer.render();
		lasttime = now;
	}
	
	
	setInterval(render, 1);
	var inc = 0.2;
};


function interlopateHeight(keep,value,obj) {

	var keeped=keep;
	
	if (keep==0)
		keep=value;		

	var dd=keep;
		
	if (value>keep+0.001) 
		dd=keep+0.001;
	if (value<keep-0.001) 
		dd=keep-0.001;

	obj.Lookat([cubepos.x,cubepos.y,dd]);
	
	keep=value;
	
	if (value>keeped+0.001) 
		keep=value+0.001;
	if (value<keeped-0.001) 
		keep=value-0.001;
	
	return keep;
}	 


function setDomEvents(iRenderer) {
	$('#canvas').mousedown( function(e) { iRenderer.evtPick = true; } );
	$('#canvas').mouseup( function(e) { iRenderer.evtPick = false; } );
	$('#mcur').show().css({"left":(iRenderer.renderWidth/2-20)+"px","top":(iRenderer.renderHeight/2-20)+"px"});
}

GLGE.Scene.prototype.pick2=function(height){
	if(!db.cube)
		return false;
	if(this.camera.matrix && this.camera.pMatrix){	
		var cubePos=db.cube.getPosition();
		var origin=[cubePos.x,cubePos.y,cubePos.z+height];
		return this.ray(origin,[0,0,1]);
	}else{
		return false;
	}
}
GLGE.Scene.prototype.getHeight=function(h){
	if(!db.cube)
		return false;
	if(this.camera.matrix && this.camera.pMatrix){	
		var cubePos=db.cube.getPosition();
		var H=0;
		if (h!=null) H=h;
		var origin=[cubePos.x,cubePos.y,H];
		db.ret=this.ray(origin,[0,0,1]);		

		if (db.ret['object']['id']=='Plane')
			return db.ret['distance'];

		return false;
			
	}
	else {
		return false;
	}
}

GLGE.Scene.prototype.pick3=function(x,y){
	if(!this.camera){
		GLGE.error("No camera set for picking");
		return false;
	}else if(this.camera.matrix && this.camera.pMatrix){
		var height=this.renderer.getViewportHeight();
		var width=this.renderer.getViewportWidth();
		var offsetx=this.renderer.getViewportOffsetX();
		var offsety=this.renderer.getViewportHeight()-this.renderer.canvas.height+this.renderer.getViewportOffsetY();
		var xcoord =  ((x-offsetx)/width-0.5)*2;
		var ycoord = -((y+offsety)/height-0.5)*2;
		var invViewProj=GLGE.mulMat4(GLGE.inverseMat4(this.camera.matrix),GLGE.inverseMat4(this.camera.pMatrix));
		var origin =GLGE.mulMat4Vec4(invViewProj,[xcoord,ycoord,-1,1]);
		origin=[origin[0]/origin[3],origin[1]/origin[3],origin[2]/origin[3]];
		var coord =GLGE.mulMat4Vec4(invViewProj,[xcoord,ycoord,1,1]);
		coord=[-(coord[0]/coord[3]-origin[0]),-(coord[1]/coord[3]-origin[1]),-(coord[2]/coord[3]-origin[2])];
		coord=GLGE.toUnitVec3(coord);
		var ret = this.ray(origin,coord);
		return ret;
	}else{
		return false;
	}
	
}

function moveP() {
	if ((db.evtJump)||(db.evtPreJump)) 
		return;
		
	if ((c2.actions)&&(!db.evtAnim)){ 
		if (db.testt.length==0) {
			for(n in c2.actions) 
				db.testt.push(c2.actions[n]);
		}	 
		for(n in c2.actions) { 
			c2.actions[n].setStartFrame(db.AnimFramesArray[0]+1);
			c2.actions[n].setFrames(db.AnimFramesArray[1]); 
			c2.setAction(c2.actions[n],0,true);
			break;
		}
		for(n in c3.actions) { 
			c3.actions[n].setStartFrame(db.AnimFramesArray[0]+1);
			c3.actions[n].setFrames(db.AnimFramesArray[1]); 
			c3.setAction(c3.actions[n],0,true);
			break;
		}
	}
}	
function moveP2() {
		
	if ((c3.actions)&&(!db.evtPAnim)){ 
		for(n in c3.actions) { 
			c3.actions[n].setStartFrame(db.AnimFramesArray[0]+1);
			c3.actions[n].setFrames(db.AnimFramesArray[1]); 
			c3.setAction(c3.actions[n],0,true);
			break;
		}
	}
}	

function movePf() {
	
	if ((db.evtJump)||(db.evtPreJump)) 
		return;
		
	if ((c2.actions)&&(!db.evtAnim)){  
		db.evtPAnimWalk=true; 
		for(n in c2.actions) { 
			c2.actions[n].setStartFrame(db.AnimFramesArray[2]);
			c2.actions[n].setFrames(db.AnimFramesArray[3]); 
			db.evtAnim=true; 
			c2.setAction(c2.actions[n],0,true);
			play_multi_sound('multiaudio1');
			break;			
		} 
		setTimeout('db.evtAnim=false;db.evtPAnimWalk=false;if(!db.evtJump)moveP();',800);
	}
}
function movePf2() {

		
	if ((c3.actions)&&(!db.evtPAnim)){  
		
		for(n in c3.actions) { 
			c3.actions[n].setStartFrame(db.AnimFramesArray[2]);
			c3.actions[n].setFrames(150); 			
			db.evtPAnim=true; 
			c3.setAction(c3.actions[n],0,false);
			break;
		} 
		
		setTimeout('db.evtPAnim=false;moveP2();',1000);
	}
}

function moveJump() {
	
	if ((c2.actions)&&((!db.evtAnim)||(db.evtPAnimWalk))){  
		db.evtPAnimWalk= false; 
		for(n in c2.actions) { 
			c2.actions[n].setStartFrame(db.AnimFramesArray[2]);
			c2.actions[n].setFrames(db.AnimFramesArray[3]); 
			db.evtAnim=true; 
			c2.setAction(c2.actions[n],0,false);
			break;
		} 
		setTimeout('db.evtAnim=false;db.evtJump=false;db.evtPreJump=false;db.evtJumped=true;moveP();',1000);
	}	
}


renderer.doc.load("example/meshes/nature.xml");
