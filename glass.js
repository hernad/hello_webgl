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
	
	this.camera.position.set(0, 0, 100);


    this.glasses = [];
	
	// prvo staklo
	var glass = new Glass();
	glass.init(this, {height: 25, width:8, depth: 3}, {x: -20, y: 0, z: 20}, Glass.IDG1);
		
	
	// drugo staklo
	var glass = new Glass();
	glass.init(this, {height: 12, width: 12, depth: 5}, {x: 0, y: 0, z: 20}, Glass.IDG2);

    
	
	this.setFloor();
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


GlassApp.prototype.onGlassOver = function(id)
{

	var glass = this.glasses[id];
	
	//debugger;
	var contentsHtml = "X: " + glass.height + " Y: " + glass.width + " D:" + glass.depth + "<br>";
	
	switch(id)
	{
		case Glass.IDG1 :
			headerHtml = "Staklo G1";
			contentsHtml += "Karakteristike: vako nako";
			break;
			
		case Glass.IDG2 :
		    headerHtml = "Staklo G2";
			contentsHtml += "Karakteristike: vako2 nako2";

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


GlassApp.prototype.setFloor = function ()
{
	
    var geometry = new THREE.CubeGeometry(200, 0.1, 120, 15, 1, 15);
	
	var material = new THREE.MeshPhongMaterial({color: 0x000077, wireframe: 1, transparent: false, opacity: 0.07} );	

    var mesh = new THREE.Mesh( geometry, material );

    var obj3 = new Sim.Object(); 
    obj3.setObject3D(mesh);
    obj3.mesh = mesh;
	

	// zakreni ga
    // Turn the canvas a bit so that we can see the 3D-ness
    obj3.mesh.rotation.x = GlassApp.X_ROTATION;
	obj3.mesh.rotation.y = GlassApp.Y_ROTATION; // + Math.PI/3;
	
    //obj3.mesh.rotation.z = Math.PI / 2;
	obj3.setPosition(0, 0, -1);

    
    //obj3.object3D.rotation.set( -Math.PI/4, -Math.PI/9, 0);
    
	this.addObject(obj3);

};


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
	
	this.update_geometry(this.height, this.width, this.depth);
    
	this.setPosition(this.pos.x, this.pos.y, this.pos.z);
	
	// dodaj u matricu ovo staklo
	//debugger;
	if (!(id in app.glasses))
	     app.glasses[id] = this;
	else {
		delete app.glasses[id];
		app.glasses[id] = this;
	}
	
};

Glass.prototype.update_geometry = function(height, width, depth)
{
	
	
    var geometry = new THREE.CubeGeometry(height, width, depth);
	
	//debugger;
	var material = new THREE.MeshPhongMaterial({color: 0xffffff, ambient: 0xffffff, transparent: true, reflectivity: 1, opacity: 0.65} );		
    var mesh = new THREE.Mesh( geometry, material );

    //mesh.doubleSided = true;
	
    this.setObject3D(mesh);
    this.mesh = mesh;
	
	// zakreni ga
    // Turn the canvas a bit so that we can see the 3D-ness
    this.mesh.rotation.y = Math.PI / 6;
    this.mesh.rotation.x = Math.PI / 12;
	
	//debugger;
	this.subscribe("over", app, app.onGlassOver);
	app.addObject(this);

};

Glass.prototype.handleMouseUp = function(x, y, point, normal)
{

	this.publish("selected", this.id);
};

Glass.prototype.handleMouseOver = function()
{
	// ovo će prihvatiti app objekat
	// on se pretplatio na "over" dogadjaj
	this.publish("over", this.id);
	
};

GlassApp.X_ROTATION = Math.PI / 12;
GlassApp.Y_ROTATION = Math.PI / 6;
	
Glass.IDG1 = 1;
Glass.IDG2 = 2;
Glass.CALLOUT_Y_OFFSET = 50;