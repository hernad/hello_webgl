GlassApp = function() 
{
	Sim.App.call(this);
};

GlassApp.prototype = new Sim.App();

GlassApp.prototype.init = function(param)
{

	Sim.App.prototype.init.call(this, param);
	
	var light = new THREE.DirectionalLight( 0xffffff, 1);
	
	// sta mu ga je normalize
	light.position.set(0, 2, 5).normalize();
	
	// osvijetli scenu GlassApp-a
	this.scene.add(light);
	
	this.camera.position.set(-10, 30, 100);
	
	this.setFloor();

    this.glasses = [];
    
    
    var gdg_1 = new GDG();
    var app = this;
    gdg_1.init(app, 
    		{width: 5, height: 12, depth_out: 4, depth_distancer: 2, depth_in: 6  },
    		{x: -20, y: 0, z: 0}, null);
	
    var gdg_2 = new GDG();
    gdg_2.init(app, 
    		{width: 9, height: 20, depth_out: 4, depth_distancer: 4, depth_in: 6  },
    		{x: 0, y: 0, z: 0}, null);
    
    
	this.createCameraControls();
	
	this.createMenu();
};

// kada sklonimo misa sa stakla skloni callout
GlassApp.prototype.handleMouseUp = function(x,y)
{
	var callout = document.getElementById("callout");
	callout.style.display = "none";

};

// pomjeramo kameru scene sa mouse scroll-om
GlassApp.prototype.handleMouseScroll = function(delta)
{
	var dx = delta;
 
	this.camera.position.z -= dx;
};

GlassApp.prototype.createCameraControls = function()
{
	var controls = new THREE.TrackballControls( this.camera, this.renderer.domElement );
	var radius = GlassApp.CAMERA_RADIUS;
	
	controls.rotateSpeed = GlassApp.ROTATE_SPEED;
	controls.zoomSpeed = GlassApp.ZOOM_SPEED;
	controls.panSpeed = GlassApp.PAN_SPEED;
	controls.dynamicDampingFactor = GlassApp.DAMPING_FACTOR;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = false;

	controls.minDistance = radius * GlassApp.MIN_DISTANCE_FACTOR;
	controls.maxDistance = radius * GlassApp.MAX_DISTANCE_FACTOR;

    controls.target.set( 0, 0, 0 );


	this.controls = controls;
};

GlassApp.prototype.onGlassOver = function(id)
{

	var glass = this.glasses[id];
	

	// W-width, H-height, T-thickness
	var contentsHtml = "W: " + glass.width + " H: " + glass.height + " T:" + glass.depth + "<br>";

	switch(id)
	{
		case Glass.IDG1 :
			headerHtml = "Staklo G1";
			contentsHtml += "Karakteristike: todo-1";
			break;
			
		case Glass.IDG2 :
		    headerHtml = "Staklo G2";
			contentsHtml += "Karakteristike: todo-2";

			break;
			
		case Glass.IDG3 :
			headerHtml = "Staklo G3";
			contentsHtml += "Karakteristike: todo-3";
			break;
				
		case Glass.IDG4 :
			headerHtml = "Staklo G4";
			contentsHtml += "Karakteristike: todo-4";
			break;
				
		default:
		    headerHtml = "nista";
		    contentsHtml = "nista<br>pa nista";
			
	}
	
	// Populate the callout
	var callout = document.getElementById("callout");
	var calloutHeader = document.getElementById("header");
	var calloutContents = document.getElementById("contents");
	
	/*
	var _msg = "callot header undefined";
	if (calloutHeader == undefined) { 
		  console.log(_msg);
		  //alert(_msg);
	}
	if (callout == undefined) console.log("callout undefined");
	*/
	
	calloutHeader.innerHTML = headerHtml;
	calloutContents.innerHTML = contentsHtml;
	callout.glassID = this.selectedControl;
	
	// Place the callout near the object and show it
	var screenpos = this.getObjectScreenPosition(this.glasses[id]);
	
	// dinamički setujem stil za callout div
	// non => block
	callout.style.display = "block";
	// offsetWidth ?

	callout.style.left = (screenpos.x - callout.offsetWidth / 2)+ "px";
	callout.style.top = (screenpos.y + Glass.CALLOUT_Y_OFFSET) + "px";
	
	
	document.getElementById('edx').value = glass.height.toString();
	document.getElementById('edy').value = glass.width.toString();
	document.getElementById('edd').value = glass.depth.toString();
	
    document.getElementById("glass_id").value = glass.id.toString();
	
};

// -----------------------------------------------
// hendliraj distancer
// ------------------------------------------------
GlassApp.prototype.onDistancerOver = function(id)
{

	var distancer = this.distanceri[id];
	

	// W-width, H-height, T-thickness
	var contentsHtml = "W: " + distancer.width + " H: " + distancer.height + " T:" + distancer.depth + "<br>";
	
	switch(id)
	{
		case Distancer.IDD1 :
			headerHtml = "Distancer G1";
			contentsHtml += "Karakteristike: vako nako";
			break;
			
		case Distancer.IDD2 :
		    headerHtml = "Distancer G2";
			contentsHtml += "Karakteristike: vako2 nako2";

			break;
			
		default:
		    headerHtml = "distancer nista";
		    contentsHtml = "nista<br>pa nista D";
			
	}
	
	// Populate the callout
	var callout = document.getElementById("callout");
	var calloutHeader = document.getElementById("header");
	var calloutContents = document.getElementById("contents");

	
	calloutHeader.innerHTML = headerHtml;
	calloutContents.innerHTML = contentsHtml;
	callout.glassID = this.selectedControl;
	
	// Place the callout near the object and show it
	var screenpos = this.getObjectScreenPosition(this.distanceri[id]);
	
	// dinamicki setujem stil za callout div
	// non => block
	callout.style.display = "block";
	// offsetWidth ?

	callout.style.left = (screenpos.x - callout.offsetWidth / 2) + "px";
	callout.style.top = (screenpos.y + Glass.CALLOUT_Y_OFFSET) + "px";
	
	document.getElementById('edx').value = distancer.height.toString();
	document.getElementById('edy').value = distancer.width.toString();
	document.getElementById('edd').value = distancer.depth.toString();
	
    document.getElementById("glass_id").value = distancer.id.toString();
	
};

//
// x, y koordinate na 2D canvasu
//
GlassApp.prototype.getObjectScreenPosition = function(object)
{  
	var mat = object.object3D.matrixWorld;
	// ?
	var pos = new THREE.Vector3();
	// ?
	pos = mat.multiplyVector3(pos);
	
	projected = pos.clone();
	this.projector.projectVector(projected, this.camera);
	
	var eltx = (1 + projected.x) * this.container.offsetWidth / 2;
    var elty = (1 - projected.y) * this.container.offsetHeight / 2;

    // sta mu ga je offset ?
    var offset = $(this.renderer.domElement).offset();

    eltx += offset.left;
	elty += offset.top;
	
	return { x: eltx, y: elty };
};


GlassApp.prototype.selectGlass = function(id)
{
	var glass = this.glasses[id];
	
	var edx = parseInt(document.getElementById('edx').value);
	var edy = parseInt(document.getElementById('edy').value);
	var edd = parseInt(document.getElementById('edd').value);


	// skaliranjem izmedju nove i stare vrijednosti dobijamo 
	// novu dimenziju stakla
    //glass.mesh.scale.set(edx/glass.height, edy/glass.width, edd/glass.depth);
 
    //var g_old = glass.mesh.geometry;
	
	var pos = glass.pos;
	
	this.removeObject(glass);
	
	// prvo staklo
	glass = new Glass();
	glass.init(this, {height: edx, width: edy, depth: edd}, pos, id);


};

// --------------------------------------
// pravimo "pod" na koji ce ici stakla
// --------------------------------------
GlassApp.prototype.setFloor = function ()
{
	// neka pod bude mreža
    var geometry = new THREE.CubeGeometry(200, 0.1, 120, 15, 1, 15);
	
	var material = new THREE.MeshPhongMaterial({color: 0x000077, wireframe: 1, transparent: false, opacity: 0.07} );	

    var mesh = new THREE.Mesh( geometry, material );

    var obj3 = new Sim.Object(); 
    obj3.setObject3D(mesh);
    obj3.mesh = mesh;
	
	obj3.setPosition(0, -0.1, 0);
    this.addObject(obj3);

    // linija po pozitivnoj x osi, zelena
    var obj3 = add_x_line(100, 0x00ff00);
    this.addObject(obj3);
	
    // linija po negativnoj x osi, plava
	var obj3 = add_x_line(-100, 0x0000ff);
	this.addObject(obj3);
};


function add_x_line(x, color) 
{

	var geometry = new THREE.Geometry();
	var vertex = new THREE.Vertex(new THREE.Vector3(0,0,0));
	geometry.vertices.push(vertex);
	var vertex = new THREE.Vertex(new THREE.Vector3(x,0,0));
	geometry.vertices.push(vertex);
	
	var material = new THREE.LineBasicMaterial({ color: color, opacity: 0.5, linewidth: 2 });
	var line = new THREE.Line(geometry, material);
    
	var obj3 = new Sim.Object(); 
	obj3.setObject3D(line);
	obj3.mesh = line;
	
	obj3.setPosition(0, -0.1, 0);

	return obj3;

}

GlassApp.prototype.update = function()
{
	// Update the camera controls
	if (this.controls)
	{
		this.controls.update();
	}
	
	// Update the headlight to point at the model
	//var normcamerapos = this.camera.position.clone().normalize();
	//this.headlight.position.copy(normcamerapos);

	Sim.App.prototype.update.call(this);
};


GlassApp.prototype.createMenu = function ()
{
	var div_staklo_1 = document.getElementById("d_staklo_1");
	
	
	$("#m_btn_1").bind('click',  function() {
		console.log("opcija 1");
		
		var div_staklo_1 = document.getElementById("d_staklo_1");
		div_staklo_1.style.display = "block";
		
	}); 
	
	// forma jednoslojno staklo:
	
	$("#f_staklo_1 input:button").bind('click', function(event) {
		
		var visina = $("#f_staklo_1 input[name=visina]:text").val();
		var sirina = $("#f_staklo_1 input[name=sirina]:text").val();
		var debljina = $("#f_staklo_1 input[name=debljina]:text").val();
		
		console.log("visina:" + visina);
		console.log("sirina:" +  sirina);
		console.log("debljina:" + debljina);
		
		
		if (isNaN(visina) || isNaN(sirina) || isNaN(debljina) || !between(visina, 1, 20) || !between(sirina, 1, 20) || !between(debljina, 1, 10)) 
			alert("neispravan unos: v:" + visina + "/ s:" + sirina + "/ d:" + debljina);
		else {
		   $("#f_staklo_1 input[name=visina]:text").val("");
		   $("#f_staklo_1 input[name=sirina]:text").val("");
		   $("#f_staklo_1 input[name=debljina]:text").val("");
		   div_staklo_1.style.display = "none";
		}
	});
	
	$("#m_btn_2").bind('click',  function() {
		alert("opcija 2");
	}); 
	
	$("#status span").html(this.glasses.length);
};

function between(num, from, to) {
	
	if (num < from || num > to)
	   return false;
	else
	   return true;
}


GlassApp.CAMERA_RADIUS = 10;
GlassApp.MIN_DISTANCE_FACTOR = 1.1;
GlassApp.MAX_DISTANCE_FACTOR = 10;
GlassApp.ROTATE_SPEED = 1.0;
GlassApp.ZOOM_SPEED = 3;
GlassApp.PAN_SPEED = 0.2;
GlassApp.DAMPING_FACTOR = 0.3;