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
    this.distanceri = [];
	
	// prvo staklo
	var glass = new Glass();
	// podigni za dvije visine
	var g_height = 20; 
	var g_width = 10;
	var g_debljina = 8;
	glass.init(this, 
		{width: g_width, height: g_height, depth: g_debljina}, 
		{x: 0, y: g_height/2, z: 0}, Glass.IDG1);

	var distanc = new Distancer();
	var d_debljina = 15;
	distanc.init(this, 
	   {width: g_width, height: g_height, depth: d_debljina}, 
	   {x: 0, y: g_height/2, z: g_debljina/2 + d_debljina/2}, Distancer.IDD1);
	
	
	// drugo staklo
	var glass = new Glass();
	var g_height = 20; 
	var g_width = 10;
	var g_debljina_2 = 15;
	
	// pozicija narednog stakla moramo dodati pola 1/2 debljine predhodnog stakla
	// + kompletnu debljinu distanceri i 1/2 novog stakla
	glass.init(this, 
		{width: g_width, height: g_height, depth: g_debljina_2}, 
		{x: 0, y: g_height/2, z: g_debljina/2 + d_debljina + g_debljina_2/2}, Glass.IDG2);
	
	/*
	var glass = new Distancer();
	glass.init(this, {height: 12, width: 12, depth: 2}, {x: 0, y: 0, z: 20}, Distancer.IDD1);
	*/	
	
	
    
	this.createCameraControls();
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
}

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
	
	// dinamički setujem stil za callout div
	// non => block
	callout.style.display = "block";
	// offsetWidth ?

	callout.style.left = (screenpos.x - callout.offsetWidth / 2)+ "px";
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
}


// ------------------------------------
// Glass object
Glass = function()
{
	Sim.Object.call(this);
};

Glass.prototype = new Sim.Object();

Glass.prototype.init = function(app, geom, pos, id)
{
	
    this.height = geom.height || 10;
	this.width = geom.width || 10;
	this.depth = geom.depth || 2;
	
	this.pos = pos;
	
	this.id = id;
	
	this.update_geometry(this.width, this.height, this.depth);
    
	this.setPosition(this.pos.x, this.pos.y, this.pos.z);
	
	// dodaj u matricu ovo staklo
	if (!(id in app.glasses))
	     app.glasses[id] = this;
	else {
		delete app.glasses[id];
		app.glasses[id] = this;
	}
	
};

Glass.prototype.update_geometry = function(width, height, depth)
{
	
    var geometry = new THREE.CubeGeometry(width, height, depth);
	
	//debugger;
	var material = new THREE.MeshPhongMaterial({color: 0xffffff, ambient: 0xffffff, transparent: true, reflectivity: 1, opacity: 0.65} );		
    var mesh = new THREE.Mesh( geometry, material );

    //mesh.doubleSided = true;
	
    this.setObject3D(mesh);
    this.mesh = mesh;
	
	// zakreni ga
    // Turn the canvas a bit so that we can see the 3D-ness
    //this.mesh.rotation.y = Math.PI / 6;
    //this.mesh.rotation.x = Math.PI / 12;
	// ne zakreci objekat blento jedan nego kameru !
	
    // generisi "over" event koji ce App objekat hendlirati sa funkcijom onGlassOver
	this.subscribe("over", app, app.onGlassOver);
	app.addObject(this);

};

Glass.prototype.handleMouseUp = function(x, y, point, normal)
{

	this.publish("selected", this.id);
};

Glass.prototype.handleMouseOver = function()
{
	// ovo henlidra app objekat
	// on se pretplatio na "over" dogadjaj
	this.publish("over", this.id);
	
};


// ----------------------------------------------------
// ----------------------------------------------------
Distancer = function()
{
	Sim.Object.call(this);
};

Distancer.prototype = new Sim.Object();

Distancer.prototype.init = function(app, geom, pos, id)
{
	
    this.height = geom.height || 10;
	this.width = geom.width || 10;
	this.depth = geom.depth || 2;
	
	this.pos = pos;
	
	this.id = id;
	
	this.update_geometry(this.width/2, this.height / 2, this.depth / 2);
    
	this.setPosition(this.pos.x, this.pos.y - 10, this.pos.z);
	
	
	// dodaj u matricu ovaj distancer
	if (!(id in app.distanceri))
	     app.distanceri[id] = this;
	else {
		delete app.distanceri[id];
		app.distanceri[id] = this;
	}
	
	
};

Distancer.prototype.update_geometry = function(width, height, depth)
{
	
	var model = new JSONModel;			
	model.init(
	{ 
		 url : "blender/distancer.js", 
		scale: 1,
		position: {x:0, y:0, z:0}
	
	});

	
    this.setObject3D(model.object3D);
    this.mesh = model.object3D;
	
	// zakreni ga
    // Turn the canvas a bit so that we can see the 3D-ness
    
    this.mesh.scale.set(width, height, depth * 5);
    
	this.subscribe("over", app, app.onDistancerOver);
	
	app.addObject(this);

};

Distancer.prototype.handleMouseUp = function(x, y, point, normal)
{

	this.publish("selected", this.id);
};

Distancer.prototype.handleMouseOver = function()
{
	// ovo henlidra app objekat
	// on se pretplatio na "over" dogadjaj
	this.publish("over", this.id);
	
};


//GlassApp.X_ROTATION = Math.PI / 12;
//GlassApp.Y_ROTATION = Math.PI / 12;
	
Glass.IDG1 = 1;
Glass.IDG2 = 2;

Distancer.IDD1 = 1;
Distancer.IDD2 = 2;

Glass.CALLOUT_Y_OFFSET = 50;

GlassApp.CAMERA_RADIUS = 10;
GlassApp.MIN_DISTANCE_FACTOR = 1.1;
GlassApp.MAX_DISTANCE_FACTOR = 10;
GlassApp.ROTATE_SPEED = 1.0;
GlassApp.ZOOM_SPEED = 3;
GlassApp.PAN_SPEED = 0.2;
GlassApp.DAMPING_FACTOR = 0.3;
