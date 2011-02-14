// emmanuel DOT botros AT gmail DOT com 
// 2011//2012
var evtPick = false; 	// client pick request asked
var evtRay = false; 	// client pick request sent
var gameScene = null;	// main Scene
var incY=0;				// y offset used for walking
var incX=0;				// y offset used for walking
var evtJump = false; 		// player evtJump test
var evtJumped = false; 		// player evtJump test
var evtPreJump = false; 		// player evtJump test
var evtAnim=false;			// player evtAnim test
var evtPAnim=false;			// player evtAnim test
var evtPAnimWalk=false;			// player evtAnim test
var renderWidth = 800;	// canvas x size
var renderHeight = 600;	// canvas x size
var ob0=null;
var dec=0;
var landed=false;
var up=false;
var ob2,pickedObj,nameObj;
var ret;
var pos0,pos1;
var testt=[];
var H=null;
var HMID=null;
var builded = false; // additionnal world objs
var builded2 = false; // additionnal world objs
var tree=null;
var bush=null;
var robot=null;
var branches=null;
var objBag=null;
var AnimFramesArray = [0,120,125,135];
var objCount=0;
var tick=false;
var Forest=null;
var Grass=null;
var Branches=null;
var KRotz=0;
var black=null;
var birdstart=-100;
var birdEnd=100;

var doc = new GLGE.Document(); 

var Bird = function(x, y,mat) {
	this.x = x;
	this.y = y;
	this.el=null;
	this.accelX=0;
	this.accelY=0;
	this.xVelocity = 1;
	this.yVelocity = -1;
	
			var	obj=(new GLGE.Object).setDrawType(GLGE.DRAW_TRIANGLES);
			
			obj.setMesh(robot.getMesh());
			obj.setMaterial(robot_mat);
			obj.setZtransparent(false);
			obj.id='Bird_'+(objCount++);
			obj.pickable=true;
var locx=this.x
		var locy=this.y
		obj.setLocX(locx);
		obj.setLocY(locy);
		obj.setLocZ(-250);
		obj.setScale(1);
			objBag.addObject(obj);
	
	
	
	this.el=obj;
	posSav = this.el.getPosition()
			
}

var random = function(maxNum) {
	return Math.ceil(Math.random() * maxNum);
}


function ccluster() {
	this.clusterObj=null;
	this.objContainer=null;
	this.count=0;
	this.load= cload;
	this.position= cpos;
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
			var	obj=(new GLGE.Object).setDrawType(GLGE.DRAW_TRIANGLES);
			obj.setMesh(this.clusterObj.getMesh());
			obj.setMaterial(mat);
			obj.setZtransparent(false);
			obj.id='Cube_'+(objCount++);
			obj.pickable=false;
			this.objContainer.addObject(obj);	
			var vx= this.Elems[i][0];
			var vy= this.Elems[i][1];
			var ry= this.Elems[i][2];
			var rz= this.Elems[i][3];

			obj.setLocX(vx);
			obj.setLocY(vy);
			obj.setRotY(ry);
			obj.setRotZ(rz);
			this.cElems.push(obj);
		}
		
		builded=true;
	}
	
	function cpos() {
		for (var i=0;i<this.count;i++) {
			cup=cube.getPosition();
			cp =this.cElems[i].getPosition();
			cube.setLocX(cp.x);
			cube.setLocY(cp.y);
			H3=gameScene.getHeight(null);
			this.cElems[i].setLocZ(-H3+1);
			cube.setLocX(cup.x);
			cube.setLocY(cup.y);
		}
		builded2=true;
		return;
	}
}

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

doc.onLoad = function() {	
	var gameRenderer = new GLGE.Renderer(document.getElementById('canvas'));
	
	gameScene = new GLGE.Scene();
	gameScene = doc.getElement("Scene");
	
	
	setCanvas();
	$('#mcur').show().css({"left":(renderWidth/2-20)+"px","top":(renderHeight/2-20)+"px"});
	
	gameScene.setFogType(GLGE.FOG_QUADRATIC);
	gameRenderer.setScene(gameScene);
	gameScene.fogNear=20;
	gameScene.fogFar=2000;
	var camera = gameScene.camera;

	
  
	camera.setAspect(renderWidth/renderHeight);

	gameRenderer.canvas.height = renderHeight;
	gameRenderer.canvas.width = renderWidth;

	var mouse = new GLGE.MouseInput(document.getElementById('canvas'));
	var keys = new GLGE.KeyInput();
	var mouseovercanvas;
	var hoverobj;
	
	var pxPos,pyPos,pzPos=0;
	var pxRot,pyRot,pzRot=0;
	var rotating=false;
	var vx=0;
	var vy=0;
	
	objBag=doc.getElement( "graph" );
	black=doc.getElement( "black" );
	grass=doc.getElement( "Material" );
	bush_mat=doc.getElement( "Bush Green.001" );
	robot=doc.getElement( "Sphere" );
	robot_mat=doc.getElement( "Material.003" );
	flower_mat=doc.getElement( "Flower Green" );
	head = doc.getElement( "head" );
	player = doc.getElement( "plane2" );
	var p2 = doc.getElement( "Cube" );
	cube = doc.getElement( "plane" );
	tree=doc.getElement( "plant_pmat8.001" );
	bush=doc.getElement( "Bush 1" );
	branches=doc.getElement( "Bush 2" );
	//grass=doc.getElement( "plant_pmat8.000" );
		
		
			
	setTimeout('moveP();moveP2();',1000); 
	
	groundObject = doc.getElement( "groundObject" );
	groundObject.setLocZ(-300);
	
		
	var stop = false;
	
	maxVelocity = 1;

	var birds = [];
	var numBirds = 10;
	for(var i = 0; i < numBirds; i++) {
		birds.push(new Bird(random(birdEnd), random(birdEnd),grass));
	}

	function movebirds() {
			cubepos=cube.getPosition()
		for(var i = 0; i < numBirds; i++) {					
		var distanceX = 0;
		var distanceY = 0; 
		var nPosX = 0;
		var nPosY = 0; 
		var distX = birds[i].x - cubepos.x;
		var distY = birds[i].y - cubepos.y;
		var distance =  Math.sqrt(distX * distX + distY * distY);
		//$("#tim").append("boid"+i+" x="+birds[i].x+"<br/>y="+birds[i].y+"<br/>x2="+cubepos.x+"<br/>y2="+cubepos.y+"<br/>dist="+distance+"<br/><br/>")
			if (distance>50) {
			
			if (( birds[i].x>cubepos.x))
				distanceX = -1/distance*distance/500;
			else
				distanceX = 1/distance*distance/500;
			if (( birds[i].y>cubepos.y))
				distanceY = -1/distance*distance/500;
			else
				distanceY = 1/distance*distance/500;

			
			
	
			}
	
			
			if (distanceY>0)birds[i].accelY+=1;
			else birds[i].accelY-=1;
			if (distanceX>0)birds[i].accelX+=1;
			else birds[i].accelX-=1;
			
			nPosX=birds[i].x+distanceX+birds[i].accelX/1000
			nPosY=birds[i].y+distanceY+birds[i].accelY/1000
			
	
			birds[i].el.setLocX(nPosX);
			birds[i].el.setLocY(nPosY);
			birds[i].x=nPosX
			birds[i].y=nPosY
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
		var ray=gameScene.ray([locx,locy,20],[0,0,1]);
		newcol.setLocZ(-ray.distance+5);
		newcol.setRotZ(Math.PI*2*Math.random());
		newcol.setScale(30);
		gameScene.addCollada(newcol);
		},200);
	}

	
	function process(){
	
		
		var camera = gameScene.camera;
		var mousepos = mouse.getMousePosition();
		mousepos.x = mousepos.x - document.body.offsetLeft;
		mousepos.y = mousepos.y	- document.body.offsetTop;			

		getPosRotObjects();
		
		processRay(mousepos);
		
		inc = ((mousepos.y - (document.getElementById('canvas').offsetHeight / 2)) / 200)+2;
		inc2 = (mousepos.x - (document.getElementById('canvas').offsetWidth / 2)) / 200;
		//if (inc <=0.01) inc=0.01;
		if (inc <=0.5) inc=0.5;
		var trans=GLGE.mulMat4Vec4(camera.getRotMatrix(),[0,0,-1,1]);
		var mag=Math.pow(Math.pow(trans[0],2)+Math.pow(trans[1],2),0.5);
		trans[0]=trans[0]/mag;
		trans[1]=trans[1]/mag;
		
		if (inc<1) {
			cube.setRotX(inc/1000);
			head.setRotX(inc/1000);
		}
		
		cube.setRotZ(-inc2*2+1.57+dec);
		head.setRotZ(-inc2*2+dec);
		
		vx=mousepos.x
		vy=mousepos.y
		
		var H2=gameScene.getHeight(null);
	//	gameScene.getHeight(-200)
		if (H2!=false)
			buildNature();
			
		if (H==null)H=0;
		
		
		if ((!evtJump))
			cube.setLocZ(-H2-.04);	
			
			

		if (evtJumped)	
					{cube.setLocZ(cubepos.z-.1);	setTimeout("evtJumped=false",500);}		
			
		if (evtJump)
			cube.setLocZ(cubepos.z+.1);	
		H=H2
		
	var mat=cube.getRotMatrix();
	var trans=GLGE.mulMat4Vec4(mat,[0,1,-1,1]);
	var mag=Math.pow(Math.pow(trans[0],2)+Math.pow(trans[1],2),0.5);
	if (evtJump) {
		trans[0]=trans[0]/mag/8;
		trans[1]=trans[1]/mag/8;
	}
	else {
		trans[0]=trans[0]/mag/18;
		trans[1]=trans[1]/mag/18;
	}
	
	incY=0;
	incX=0;
	
	if(keys.isKeyPressed(GLGE.KI_SPACE)) {setTimeout("evtJump=true",1);evtPreJump=true;moveJump();/*addAvatar();*/		birds.push(new Bird(random(birdEnd), random(birdEnd),grass));numBirds++;}

	if(keys.isKeyPressed(GLGE.KI_DOWN_ARROW)) {incY=incY+parseFloat(trans[1]);incX=incX+parseFloat(trans[0]);if((!evtPreJump)&&(!evtJump))movePf();}
	if(keys.isKeyPressed(GLGE.KI_UP_ARROW)) {incY=incY-parseFloat(trans[1]);incX=incX-parseFloat(trans[0]);if((!evtPreJump)&&(!evtJump))movePf();} 
	if(keys.isKeyPressed(GLGE.KI_RIGHT_ARROW)) {incY=incY+parseFloat(trans[0]);incX=incX-parseFloat(trans[1]);if((!evtPreJump)&&(!evtJump))movePf();/*rotating=true;cube.setRotZ(cuberot.z-.01);head.setRotZ(headrot.z-.01);dec+=-.01;*/}
	if(keys.isKeyPressed(GLGE.KI_LEFT_ARROW)) {incY=incY-parseFloat(trans[0]);incX=incX+parseFloat(trans[1]);if((!evtPreJump)&&(!evtJump))movePf();/*rotating=true;cube.setRotZ(cuberot.z+.01);head.setRotZ(headrot.z+.01);dec+=.01;*/}

	if ((!keys.isKeyPressed(GLGE.KI_RIGHT_ARROW))&&(!keys.isKeyPressed(GLGE.KI_RIGHT_ARROW)))
		rotating=false;
	
	cube.setLocY(cubepos.y+incY*0.05*(now-lasttime)*H/100);
	cube.setLocX(cubepos.x+incX*0.05*(now-lasttime)*H/100);

	// z axis is vertical		
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
	

	KRotz=interlopateHeight(KRotz,(cubepos.z+2+inc/1000),camera);
	
	
		
	if((((pxPos-(headpos.x)>1)||(pxPos-(headpos.x)<-1))||((pzPos-(headpos.z)>1)||(pzPos-(headpos.z)<-1))||((pxRot-(headrot.x)>1)||(pxRot-(headrot.x)<-1))||((pzRot-(headrot.z)>1)||(pzRot-(headrot.z)<-1))||((pyRot-(headrot.y)>1)||(pyRot-(headrot.y)<-1)))/*||(!tick)*/) {
		var msg = (headpos.x)+ ";"+ (headpos.y)+";"+(headpos.z)+'|'+(headrot.x)+ ";"+ (headrot.y)+";"+(headrot.z);
		pxPos=(headpos.x);
		pyPos=(headpos.y);
		pzPos=(headpos.z);
		pxRot=(headrot.x);
		pyRot=(headrot.y);
		pzRot=(headrot.z);		
		send(msg);
		tick=true;
		setTimeout("tick=false",10000);
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

		if (!builded){
			//Forest=new ccluster;
			//Forest.load(tree,objBag,grass,0);	
			Grass=new ccluster;
			Grass.load(bush,objBag,flower_mat,1);	
			Branches=new ccluster;
			Branches.load(branches,objBag,bush_mat,2);	
			//alert(Trees)
			builded=true;	
		}
					
		if((builded)&&(!builded2)) { 
			//Forest.position();
			Grass.position();
			Branches.position();
			builded2=true;
		}

	}

	function processRay(mousepos) {
		
		cx=mousepos.x;
		cy=mousepos.y;
		//+magic hook
		cx=renderWidth/2;
		cy=renderHeight/2;
		//+magic hook
				
		if 	((!evtRay)&&(evtPick)) {	
			ob0=gameScene.pick3(cx, cy);
			
			
			//$("#entry").attr("tim1",ob0['object']['id']+ ' shot at distance : '+ob0['distance']+'!');
			if(ob0['coord']) {
			/*var line=(new GLGE.Object).setDrawType(GLGE.DRAW_LINES);
			line.setMesh((new GLGE.Mesh).setPositions([cubepos.x,cubepos.y,cubepos.z+1.5,ob0['coord'][0],ob0['coord'][1],ob0['coord'][2]]));
			*/
			pos0=[cubepos.x,cubepos.y,cubepos.z+1.5]
			pos1=[ob0['coord'][0],ob0['coord'][1],ob0['coord'][2]];
			/*line.setMaterial(black);
			line.setZtransparent(true);
			objBag.addObject(line);	
			*/
			p2.setLocX(pos0[0]);
			p2.setLocY(pos0[1]);
			p2.setLocZ(pos0[2]);	
			p2.setRotX(cuberot.x+1.57)
			p2.setRotY(cuberot.y)
			p2.setRotZ(cuberot.z)
			
			send('COLLISION:'+pos1);
			}
		
			nameObj=ob0['object']['id']+"_"
			
			$("#tim1").html(nameObj.substring(0,4))
			if (nameObj.substring(0,4)=='Bird')
				pickedObj=ob0['object'];
		
			evtRay=true;
			setTimeout("evtRay=false;",100);
			
		}	
//		$("#tim1").html('')
	for(var i = 0; i < numBirds; i++) {					
//				$("#tim1").append('x0='+birds[i].x+'<br>'+'x0='+birds[i].y)
			}
		if (evtRay) {	
			var posi=[]
			posi[0]	=	pos0[0]-(pos0[0]-pos1[0])
			posi[1]	=	pos0[1]-(pos0[1]-pos1[1])
			posi[2]	=	pos0[2]-(pos0[2]-pos1[2])
			p2.setLocX(posi[0]);
			p2.setLocY(posi[1]);
			p2.setLocZ(posi[2]);
			//$("#entry").attr("value",$("#entry").attr("value")+'posx'+posi[0]+'posy'+posi[1]+'posz'+posi[2]);

			pos0[0]	=	posi[0]
			pos0[1]	=	posi[1]
			pos0[2]	=	posi[2]
				
			//$("#tim1").html(nameObj+"<br>")
			
			for(var i = 0; i < numBirds; i++) {					
				
				//$("#tim1").append('x0='+birds[i].x+'<br>'+'x0='+birds[i].y+'<br>'+'x1='+posi[0]+'<br>'+'y1='+posi[1]+'<br>'+ Pdistance)
				
				var PdistX =  birds[i].x-posi[0];
				var PdistY =  birds[i].y-posi[1];
				//var PdistZ = posi[2] + 300;
				var Pdistance =  Math.sqrt(PdistX * PdistX + PdistY * PdistY)//+ PdistZ * PdistZ);

				//"kill" the bird XD
				
				if (Pdistance<5) {
					birds[i].el.setLocZ(-1000);			
				}
			}

			/*if (nameObj.substring(0,4)=='Bird') {
				
				
//				p0=pickedObj.getPosition();
			
				var PdistX = p0.x - posi[0];
				var PdistY = p0.y - posi[1];
				var PdistZ = p0.z - posi[2];
				var Pdistance =  Math.sqrt(PdistX * PdistX + PdistY * PdistY+ PdistZ * PdistZ);

				//"kill" the bird XD
				$("#tim1").html(Pdistance)
				if (Pdistance<50) {
					alert(Pdistance);
					pickedObj.setLocZ(-1000);			
				}
			}*/
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
//						$("#entry").attr("value",'h1 '+st2[2]+' to h2 '+st[2]+' : <'+((st2[2]*1)-((st2[2]*1)-(st[2]*1))/10)+'>');
						$("#entry").attr("value",'ndist='+ndistX+';'+ndistY);
	
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
		//$("#entry").attr("value",$("#entry").attr("value")+'fps='+fps);

		process();

		multi();
		
		$("#tim").html("");
		movebirds();
		
		gameRenderer.render();
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
		ret=this.ray(origin,[0,0,1]);		

		if (ret['object']['id']=='Plane')
			return ret['distance'];

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
	if ((evtJump)||(evtPreJump)) 
		return;
		
	if ((c2.actions)&&(!evtAnim)){ 
		if (testt.length==0) {
			for(n in c2.actions) 
				testt.push(c2.actions[n]);
		}	 
		for(n in c2.actions) { 
			c2.actions[n].setStartFrame(AnimFramesArray[0]+1);
			c2.actions[n].setFrames(AnimFramesArray[1]); 
			c2.setAction(c2.actions[n],0,true);
			break;
		}
		for(n in c3.actions) { 
			c3.actions[n].setStartFrame(AnimFramesArray[0]+1);
			c3.actions[n].setFrames(AnimFramesArray[1]); 
			c3.setAction(c3.actions[n],0,true);
			break;
		}
	}
}	
function moveP2() {
		
	if ((c3.actions)&&(!evtPAnim)){ 
		for(n in c3.actions) { 
			c3.actions[n].setStartFrame(AnimFramesArray[0]+1);
			c3.actions[n].setFrames(AnimFramesArray[1]); 
			c3.setAction(c3.actions[n],0,true);
			break;
		}
	}
}	

function movePf() {
	
	if ((evtJump)||(evtPreJump)) 
		return;
		
	if ((c2.actions)&&(!evtAnim)){  
		evtPAnimWalk=true; 
		for(n in c2.actions) { 
			c2.actions[n].setStartFrame(AnimFramesArray[2]);
			c2.actions[n].setFrames(AnimFramesArray[3]); 
			evtAnim=true; 
			c2.setAction(c2.actions[n],0,true);
			play_multi_sound('multiaudio1');
			break;			
		} 
		setTimeout('evtAnim=false;evtPAnimWalk=false;if(!evtJump)moveP();',800);
	}
}
function movePf2() {

		
	if ((c3.actions)&&(!evtPAnim)){  
		
		for(n in c3.actions) { 
			c3.actions[n].setStartFrame(AnimFramesArray[2]);
			c3.actions[n].setFrames(150); 			
			evtPAnim=true; 
			c3.setAction(c3.actions[n],0,false);
			break;
		} 
		
		setTimeout('evtPAnim=false;moveP2();',1000);
	}
}

function moveJump() {
//	return;
	if ((c2.actions)&&((!evtAnim)||(evtPAnimWalk))){  
		evtPAnimWalk= false; 
		for(n in c2.actions) { 
			c2.actions[n].setStartFrame(AnimFramesArray[2]);
			c2.actions[n].setFrames(AnimFramesArray[3]); 
			evtAnim=true; 
			c2.setAction(c2.actions[n],0,false);
			break;
		} 
		setTimeout('evtAnim=false;evtJump=false;evtPreJump=false;evtJumped=true;moveP();',1000);
	}	
}

function setCanvas() {
	
	if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    renderWidth = window.innerWidth;
    renderHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    renderWidth = document.documentElement.clientWidth;
    renderHeight = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    renderWidth = document.body.clientWidth;
    renderHeight = document.body.clientHeight;
  }
  
	$('#canvas').height(renderHeight);
	$('#canvas').width(renderWidth);
	
	// we bind the click event to the evtPick variable
	$("#canvas").mousedown( function(event) { evtPick = true; } );
	$("#canvas").mouseup( function() { evtPick = false; } );
}

function build(oob,graph,material) {

	}

doc.load("example/meshes/nature.xml");
