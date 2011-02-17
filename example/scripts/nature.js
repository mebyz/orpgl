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
				
	this.renderWidth = null;		
	this.renderHeight= null;
	
    this.evtPick= false; 	
	this.evtRay= false; 	
	
	this.setPosX=_setposx;
	this.setPosY=_setposy;
	this.setPosZ=_setposz;
	this.initObj=_initobj;	
	this.initGameRenderer=_initgr;	
	this.initScene=_initsc;	
	this.initCamera=_initcam;	
	this.setDoc=_setdoc;	
	this.initFog=_initfog;	

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
	
	function _initobj(mesh,name,posrot,mat,p,bag,ct,type,tvar) {
		
		var	obj=(new GLGE.Object).setDrawType(GLGE.DRAW_TRIANGLES);
				
		obj.setMesh(mesh);
		obj.setMaterial(mat);
		obj.setZtransparent(false);
		obj.id=name+ct;
		obj.pickable=p;
				
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

	function _initgr(el) {
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
	  
		$('#canvas').height(this.renderHeight);
		$('#canvas').width(this.renderWidth);
		
		$("#canvas").mousedown( function(event) { renderer.evtPick = true; } );
		$("#canvas").mouseup( function(event) { renderer.evtPick = false; } );
	}
	
	function _initsc(name) {
		this.gameScene = new GLGE.Scene();
		this.gameScene = this.doc.getElement(name)
		this.gameRenderer.setScene(renderer.gameScene);
		this.gameRenderer.canvas.width = this.renderWidth;
		this.gameRenderer.canvas.height = this.renderHeight;
	}
	
	function _initcam() {
		var camera = this.gameScene.camera;
		camera.setAspect(this.renderWidth/this.renderHeight);
		return camera;
	}
	

	function _initfog(near, far) {		
		this.gameScene.setFogType(GLGE.FOG_QUADRATIC);
		this.gameScene.fogNear=near;
		this.gameScene.fogFar=far;
	}	
		
	// END : GLGE INTERFACE //
	//////////////////////////
}

// Core Class handles game variables and communication with other modules
function Core() {
	this.DB = {};		
	this.DB.evtJump		= false; 		
	this.DB.evtJumped	= false; 		
	this.DB.evtPreJump	= false; 		
	this.DB.evtAnim		= false;			
	this.DB.evtPAnim	= false;			
	this.DB.evtPAnimWalk= false;		
	this.DB.incY		= 0;					
	this.DB.incX		= 0;		
	this.DB.ob0			= null;
	this.DB.dec			= 0;
	this.DB.pickedObj	= null;
	this.DB.nameObj		= null;
	this.DB.ret			= null;
	this.DB.pos0		= null
	this.DB.pos1		= null;
	this.DB.testt		= [];
	this.DB.H			= null;
	this.DB.evtClusterCrea 	= false; 
	this.DB.evtClusterPos	= false;
	this.DB.tree		= null;
	this.DB.bush		= null;
	this.DB.robot		= null;
	this.DB.grass		= null;
	this.DB.branches	= null;
	this.DB.objBag		= null;
	this.DB.objCount	= 0;
	this.DB.tick		= false;
	this.DB.Forest		= null;
	this.DB.Grass		= null;
	this.DB.Branches	= null;
	this.DB.KRotz		= 0;
	this.DB.black		= null;
	this.DB.moveableEnd	= 100;

	this.DB.AnimFramesArray = [0,120,125,135];
	
	window.DB=this.DB;
	
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
	
		renderer.initObj( this.clusterObj.getMesh(),"Cube_",(new PosRot(this.Elems[i][0],this.Elems[i][1],null,null,this.Elems[i][2],this.Elems[i][3])),mat,false,this.objContainer,core.DB.objCount++,1,this.cElems);
			
		}
		
		core.DB.evtClusterCrea=true;
	}
}

var random = function(maxNum) {
	return Math.ceil(Math.random() * maxNum);
}


var core 		= new Core(); 
var renderer 	= new Renderer(); 

////////////////////////////////////////////////////////////////////////


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

renderer.doc.onLoad = function() {	
	
	renderer.initGameRenderer('canvas');
	renderer.initScene("Scene");
	var camera = renderer.initCamera();
	renderer.initFog(20,2000);
	
	$('#mcur').show().css({"left":(renderer.renderWidth/2-20)+"px","top":(renderer.renderHeight/2-20)+"px"});
	
	var mouse = new GLGE.MouseInput(document.getElementById('canvas'));
	var keys = new GLGE.KeyInput();
	var mouseovercanvas;
	var hoverobj;
	
	var pxPos,pyPos,pzPos=0;
	var pxRot,pyRot,pzRot=0;
	var rotating=false;
	var vx=0;
	var vy=0;
	
	core.DB.objBag=renderer.doc.getElement( "graph" );
	core.DB.black=renderer.doc.getElement( "black" );
	core.DB.grass=renderer.doc.getElement( "Material" );
	core.DB.bush_mat=renderer.doc.getElement( "Bush Green.001" );
	core.DB.robot=renderer.doc.getElement( "Sphere" );
	core.DB.robot_mat=renderer.doc.getElement( "Material.003" );
	flower_mat=renderer.doc.getElement( "Flower Green" );
	head = renderer.doc.getElement( "head" );
	player = renderer.doc.getElement( "plane2" );
	var p2 = renderer.doc.getElement( "Cube" );
	cube = renderer.doc.getElement( "plane" );
	core.DB.tree=renderer.doc.getElement( "plant_pmat8.001" );
	core.DB.bush=renderer.doc.getElement( "Bush 1" );
	core.DB.branches=renderer.doc.getElement( "Bush 2" );	
			
	setTimeout('moveP();moveP2();',1000); 
	
	groundObject = renderer.doc.getElement( "groundObject" );
	groundObject.setLocZ(-300);
	
	var stop = false;
	
	maxVelocity = 1;

	var moveables = [];
	var numMoveables = 0;
	
	for(var i = 0; i < numMoveables; i++) {
		moveables.push(new Moveable(random(core.DB.moveableEnd), random(core.DB.moveableEnd),core.DB.grass));
		renderer.initObj( core.DB.robot.getMesh(),"Moveable_",(new PosRot(null,moveables[i].y,moveables[i].z,-250,null,null)),core.DB.robot_mat,true,core.DB.objBag,core.DB.objCount++,0,moveables[i]);
	}
	
	function movemoveables() {
		cubepos=cube.getPosition()
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
	


	var T;
	function addAvatar(){
		
		if(T) clearTimeout(T);
		T=setTimeout(function(){
		var newcol=new GLGE.Collada;
		newcol.setDocument("example/meshes/sheep.dae",window.location.href);
		var locx=Math.random()*100-50
		var locy=Math.random()*100-50
		newcol.setLocX(locx);
		newcol.setLocY(locy);
		var ray=renderer.gameScene.ray([locx,locy,20],[0,0,1]);
		newcol.setLocZ(-ray.distance+5);
		newcol.setRotZ(Math.PI*2*Math.random());
		newcol.setScale(30);
		renderer.gameScene.addCollada(newcol);
		},200);
	}

	
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
			cube.setRotX(inc/1000);
			head.setRotX(inc/1000);
		}
		
		cube.setRotZ(-inc2*2+1.57+core.DB.dec);
		head.setRotZ(-inc2*2+core.DB.dec);
		
		vx=mousepos.x
		vy=mousepos.y
		
		var H2=renderer.gameScene.getHeight(null);
		
		//if (H2!=false)
		//	buildNature();
			
		if (core.DB.H==null)core.DB.H=0;
		
		
		if ((!core.DB.evtJump))
			cube.setLocZ(-H2-.04);	
			
			

		if (core.DB.evtJumped)	
					{cube.setLocZ(cubepos.z-.1);	setTimeout("core.DB.evtJumped=false",500);}		
			
		if (core.DB.evtJump)
			cube.setLocZ(cubepos.z+.1);	
		core.DB.H=H2
		
	var mat=cube.getRotMatrix();
	var trans=GLGE.mulMat4Vec4(mat,[0,1,-1,1]);
	var mag=Math.pow(Math.pow(trans[0],2)+Math.pow(trans[1],2),0.5);
	if (core.DB.evtJump) {
		trans[0]=trans[0]/mag/8;
		trans[1]=trans[1]/mag/8;
	}
	else {
		trans[0]=trans[0]/mag/18;
		trans[1]=trans[1]/mag/18;
	}
	
	core.DB.incY=0;
	core.DB.incX=0;
	
	if(keys.isKeyPressed(GLGE.KI_SPACE)) {setTimeout("core.DB.evtJump=true",1);core.DB.evtPreJump=true;moveJump();/*addAvatar();*/		moveables.push(new Moveable(random(moveableEnd), random(moveableEnd),core.DB.grass));numMoveables++;}

	if(keys.isKeyPressed(GLGE.KI_DOWN_ARROW)) {core.DB.incY=core.DB.incY+parseFloat(trans[1]);core.DB.incX=core.DB.incX+parseFloat(trans[0]);if((!core.DB.evtPreJump)&&(!core.DB.evtJump))movePf();}
	if(keys.isKeyPressed(GLGE.KI_UP_ARROW)) {core.DB.incY=core.DB.incY-parseFloat(trans[1]);core.DB.incX=core.DB.incX-parseFloat(trans[0]);if((!core.DB.evtPreJump)&&(!core.DB.evtJump))movePf();} 
	if(keys.isKeyPressed(GLGE.KI_RIGHT_ARROW)) {core.DB.incY=core.DB.incY+parseFloat(trans[0]);core.DB.incX=core.DB.incX-parseFloat(trans[1]);if((!core.DB.evtPreJump)&&(!core.DB.evtJump))movePf();/*rotating=true;cube.setRotZ(cuberot.z-.01);head.setRotZ(headrot.z-.01);dec+=-.01;*/}
	if(keys.isKeyPressed(GLGE.KI_LEFT_ARROW)) {core.DB.incY=core.DB.incY-parseFloat(trans[0]);core.DB.incX=core.DB.incX+parseFloat(trans[1]);if((!core.DB.evtPreJump)&&(!core.DB.evtJump))movePf();/*rotating=true;cube.setRotZ(cuberot.z+.01);head.setRotZ(headrot.z+.01);dec+=.01;*/}

	if ((!keys.isKeyPressed(GLGE.KI_RIGHT_ARROW))&&(!keys.isKeyPressed(GLGE.KI_RIGHT_ARROW)))
		rotating=false;
	
	cube.setLocY(cubepos.y+core.DB.incY*0.05*(now-lasttime)*core.DB.H/100);
	cube.setLocX(cubepos.x+core.DB.incX*0.05*(now-lasttime)*core.DB.H/100);	
	camera.setLocZ((cubepos.z+1.6-cuberot.x*1000+inc));
	cubepos = cube.getPosition();
	cuberot = cube.getRotation();
	headpos = head.getPosition();
	headrot = head.getRotation();
	camera.setLocX(cubepos.x-2*inc*Math.cos((headrot.z) * 57 *Math.PI / 180));
	camera.setLocY(cubepos.y-2*inc*Math.sin((headrot.z) * 57* Math.PI / 180));
	
	head.setLocZ(cubepos.z-1.08);
	head.setLocX(cubepos.x);
	head.setLocY(cubepos.y);
	

	core.DB.KRotz=interlopateHeight(core.DB.KRotz,(cubepos.z+2+inc/1000),camera);
	
	
		
	if((((pxPos-(headpos.x)>1)||(pxPos-(headpos.x)<-1))||((pzPos-(headpos.z)>1)||(pzPos-(headpos.z)<-1))||((pxRot-(headrot.x)>1)||(pxRot-(headrot.x)<-1))||((pzRot-(headrot.z)>1)||(pzRot-(headrot.z)<-1))||((pyRot-(headrot.y)>1)||(pyRot-(headrot.y)<-1)))/*||(!tick)*/) {
		var msg = (headpos.x)+ ";"+ (headpos.y)+";"+(headpos.z)+'|'+(headrot.x)+ ";"+ (headrot.y)+";"+(headrot.z);
		pxPos=(headpos.x);
		pyPos=(headpos.y);
		pzPos=(headpos.z);
		pxRot=(headrot.x);
		pyRot=(headrot.y);
		pzRot=(headrot.z);		
		send(msg);
		core.DB.tick=true;
		setTimeout("core.DB.tick=false",10000);
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
		cubepos = cube.getPosition();
		cuberot = cube.getRotation();
		groundObjectpos = groundObject.getPosition();
		headrot = head.getRotation();
		
	}
	
	function buildNature() {

		if (!core.DB.evtClusterCrea){
			//core.DB.Forest=new Cluster;
			//core.DB.Forest.load(core.DB.tree,core.DB.objBag,core.DB.grass,0);	
			core.DB.Grass=new Cluster;
			core.DB.Grass.load(core.DB.bush,core.DB.objBag,flower_mat,1);	
			core.DB.Branches=new Cluster;
			core.DB.Branches.load(core.DB.branches,core.DB.objBag,core.DB.bush_mat,2);	
			core.DB.evtClusterCrea=true;	
		}
		
		if((core.DB.evtClusterCrea)&&(!core.DB.evtClusterPos)) { 
		
			for (var i=0;i<core.DB.Grass.count;i++) {
				cup=cube.getPosition();
				cp =core.DB.Grass.cElems[i].getPosition();
				renderer.setPosX(cube,cp.x);
				renderer.setPosY(cube,cp.y);
				H3=renderer.gameScene.getHeight(null);
				renderer.setPosZ(core.DB.Grass.cElems[i],-H3+1);
				renderer.setPosX(cube,cup.x);
				renderer.setPosY(cube,cup.y);
			}
			for (var i=0;i<core.DB.Branches.count;i++) {
				cup=cube.getPosition();
				cp =core.DB.Branches.cElems[i].getPosition();
				renderer.setPosX(cube,cp.x);
				renderer.setPosY(cube,cp.y);
				H3=renderer.gameScene.getHeight(null);
				renderer.setPosZ(core.DB.Branches.cElems[i],-H3+1);
				renderer.setPosX(cube,cup.x);
				renderer.setPosY(cube,cup.y);
			}
		}
	}

	

	function processRay(mousepos) {
		
		cx=mousepos.x;
		cy=mousepos.y;
		cx=renderer.renderWidth/2;
		cy=renderer.renderHeight/2;
				
		if 	((!renderer.evtRay)&&(renderer.evtPick)) {	
			core.DB.ob0=renderer.gameScene.pick3(cx, cy);
			
			
			if(core.DB.ob0['coord']) {
				
				core.DB.pos0=[cubepos.x,cubepos.y,cubepos.z+1.5]
				core.DB.pos1=[core.DB.ob0['coord'][0],core.DB.ob0['coord'][1],core.DB.ob0['coord'][2]];
				p2.setLocX(core.DB.pos0[0]);
				p2.setLocY(core.DB.pos0[1]);
				p2.setLocZ(core.DB.pos0[2]);	
				p2.setRotX(cuberot.x+1.57)
				p2.setRotY(cuberot.y)
				p2.setRotZ(cuberot.z)
				
				send('COLLISION:'+core.DB.pos1);
			}
		
			core.DB.nameObj=core.DB.ob0['object']['id']+"_"
			
			$("#tim1").html(core.DB.nameObj.substring(0,4))
			if (core.DB.nameObj.substring(0,4)=='Moveable')
				core.DB.pickedObj=core.DB.ob0['object'];
		
			renderer.evtRay=true;
			setTimeout("renderer.evtRay=false;",100);
			
		}	
		
		if (renderer.evtRay) {	
			
			var posi=[]
			posi[0]	=	core.DB.pos0[0]-(core.DB.pos0[0]-core.DB.pos1[0])
			posi[1]	=	core.DB.pos0[1]-(core.DB.pos0[1]-core.DB.pos1[1])
			posi[2]	=	core.DB.pos0[2]-(core.DB.pos0[2]-core.DB.pos1[2])
			p2.setLocX(posi[0]);
			p2.setLocY(posi[1]);
			p2.setLocZ(posi[2]);
			
			core.DB.pos0[0]	=	posi[0]
			core.DB.pos0[1]	=	posi[1]
			core.DB.pos0[2]	=	posi[2]
			
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
						
					
						player.setLocX(nlocX);
						player.setLocY(nlocY);
						player.setLocZ(nlocZ+1);	
						player.setRotZ((strot[2])-4.8)
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
	document.getElementById("canvas").onmouseover = function(e) {
		mouseovercanvas = true;
	};
	document.getElementById("canvas").onmouseout = function(e) {
		mouseovercanvas = false;
	};
	
	
};


GLGE.Scene.prototype.pick2=function(height){
	if(!cube)
		return false;
	if(this.camera.matrix && this.camera.pMatrix){	
		var cubePos=cube.getPosition();
		var origin=[cubePos.x,cubePos.y,cubePos.z+height];
		return this.ray(origin,[0,0,1]);
	}else{
		return false;
	}
}
GLGE.Scene.prototype.getHeight=function(h){
	if(!cube)
		return false;
	if(this.camera.matrix && this.camera.pMatrix){	
		var cubePos=cube.getPosition();
		var H=0;
		if (h!=null) H=h;
		var origin=[cubePos.x,cubePos.y,H];
		core.DB.ret=this.ray(origin,[0,0,1]);		

		if (core.DB.ret['object']['id']=='Plane')
			return core.DB.ret['distance'];

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
	if ((core.DB.evtJump)||(core.DB.evtPreJump)) 
		return;
		
	if ((c2.actions)&&(!core.DB.evtAnim)){ 
		if (core.DB.testt.length==0) {
			for(n in c2.actions) 
				core.DB.testt.push(c2.actions[n]);
		}	 
		for(n in c2.actions) { 
			c2.actions[n].setStartFrame(core.DB.AnimFramesArray[0]+1);
			c2.actions[n].setFrames(core.DB.AnimFramesArray[1]); 
			c2.setAction(c2.actions[n],0,true);
			break;
		}
		for(n in c3.actions) { 
			c3.actions[n].setStartFrame(core.DB.AnimFramesArray[0]+1);
			c3.actions[n].setFrames(core.DB.AnimFramesArray[1]); 
			c3.setAction(c3.actions[n],0,true);
			break;
		}
	}
}	
function moveP2() {
		
	if ((c3.actions)&&(!core.DB.evtPAnim)){ 
		for(n in c3.actions) { 
			c3.actions[n].setStartFrame(core.DB.AnimFramesArray[0]+1);
			c3.actions[n].setFrames(core.DB.AnimFramesArray[1]); 
			c3.setAction(c3.actions[n],0,true);
			break;
		}
	}
}	

function movePf() {
	
	if ((core.DB.evtJump)||(core.DB.evtPreJump)) 
		return;
		
	if ((c2.actions)&&(!core.DB.evtAnim)){  
		core.DB.evtPAnimWalk=true; 
		for(n in c2.actions) { 
			c2.actions[n].setStartFrame(core.DB.AnimFramesArray[2]);
			c2.actions[n].setFrames(core.DB.AnimFramesArray[3]); 
			core.DB.evtAnim=true; 
			c2.setAction(c2.actions[n],0,true);
			play_multi_sound('multiaudio1');
			break;			
		} 
		setTimeout('core.DB.evtAnim=false;core.DB.evtPAnimWalk=false;if(!core.DB.evtJump)moveP();',800);
	}
}
function movePf2() {

		
	if ((c3.actions)&&(!core.DB.evtPAnim)){  
		
		for(n in c3.actions) { 
			c3.actions[n].setStartFrame(core.DB.AnimFramesArray[2]);
			c3.actions[n].setFrames(150); 			
			core.DB.evtPAnim=true; 
			c3.setAction(c3.actions[n],0,false);
			break;
		} 
		
		setTimeout('core.DB.evtPAnim=false;moveP2();',1000);
	}
}

function moveJump() {
	
	if ((c2.actions)&&((!core.DB.evtAnim)||(core.DB.evtPAnimWalk))){  
		core.DB.evtPAnimWalk= false; 
		for(n in c2.actions) { 
			c2.actions[n].setStartFrame(core.DB.AnimFramesArray[2]);
			c2.actions[n].setFrames(core.DB.AnimFramesArray[3]); 
			core.DB.evtAnim=true; 
			c2.setAction(c2.actions[n],0,false);
			break;
		} 
		setTimeout('core.DB.evtAnim=false;core.DB.evtJump=false;core.DB.evtPreJump=false;core.DB.evtJumped=true;moveP();',1000);
	}	
}


renderer.doc.load("example/meshes/nature.xml");
