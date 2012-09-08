GlassApp = function() 
{
	Sim.App.call(this);
}

GlassApp.prototype = new Sim.App();

GlassApp.prototype.init = function(param)
{

	Sim.App.prototype.init.call(this, param);
	
	var light = new THREE.DirectionalLight( 0xffffff, 1);
	
	// sta mu ga je normalize
	light.position.set(0, 2, 1).normalize();
	
	// osvijetli scenu GlassApp-a
	this.scene.add(light);
	
	this.camera.position.set(0, 0, 100);


    this.glasses = [];
	
	// prvo staklo
	var glass = new Glass();
	glass.init(this, 25, 8, 3, Glass.IDG1);
	glass.setPosition(-20, 0, 20);
	// dodaj u matricu ovo staklo
	this.glasses.push(glass);
	
	// drugo staklo
	var glass = new Glass();
	glass.init(this, 12, 12, 5, Glass.IDG2);
    glass.setPosition(0, 0, 20);
	this.glasses.push(glass);
}

// kada sklonimo misa sa stakla skloni callout
GlassApp.prototype.handleMouseUp = function(x,y)
{
	var callout = document.getElementById("callout");
	callout.style.display = "none";

}

// pomjeramo kameru scene sa mouse scroll-om
GlassApp.prototype.handleMouseScroll = function(delta)
{
	var dx = delta;
 
	this.camera.position.z -= dx;
}


GlassApp.prototype.onGlassOver = function(id)
{
	var html = "";
	switch(id)
	{
		case Glass.IDG1 :
			headerHtml = "Staklo G1";
			contentsHtml = 
				"Sirina: 1 mm<br>Visina: 1 mm<br>" +
				"Karakteristike: vako nako";
			break;
			
		case Glass.IDG2 :
		    headerHtml = "Staklo G2";
			contentsHtml = 
			"Sirina: 2 mm<br>Visina: 2 mm<br>" +
			"Karakteristike: vako2 nako2";

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
	var screenpos = this.getObjectScreenPosition(this.glasses[id-1]);
	
	// dinamički setujem stil za callout div
	// non => block
	callout.style.display = "block";
	// offsetWidth ?

	callout.style.left = (screenpos.x - callout.offsetWidth / 2)+ "px";
	callout.style.top = (screenpos.y + Glass.CALLOUT_Y_OFFSET) + "px";
}

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
}

GlassApp.prototype.selectGlass = function(id)
{
}


// ------------------------------------
// Glass object
Glass = function()
{
	Sim.Object.call(this);
}

Glass.prototype = new Sim.Object();

Glass.prototype.init = function(app, visina, sirina, debljina, id)
{
    this.height = visina || 10;
	this.width = sirina || 10;
	this.deepth = debljina || 2;
	this.id = id;
	
	
    var geometry = new THREE.CubeGeometry(this.height, this.width, this.deepth);
	var material = new THREE.MeshPhongMaterial({ color: 0xffffff, ambient: 0xffffff, transparent: true} );		
    var mesh = new THREE.Mesh( geometry, material );

    mesh.doubleSided = true;
	
    this.setObject3D(mesh);
    this.mesh = mesh;
	
	// zakreni ga
    // Turn the canvas a bit so that we can see the 3D-ness
    this.mesh.rotation.y = Math.PI / 6;
    this.mesh.rotation.x = Math.PI / 12;
	
	//debugger;
	this.subscribe("over", app, app.onGlassOver);
	app.addObject(this);
}

Glass.prototype.handleMouseUp = function(x, y, point, normal)
{

	this.publish("selected", this.id);
}

Glass.prototype.handleMouseOver = function()
{
	// ovo će prihvatiti app objekat
	// on se pretplatio na "over" dogadjaj
	this.publish("over", this.id);
	
}

Glass.IDG1 = 1;
Glass.IDG2 = 2;
Glass.CALLOUT_Y_OFFSET = 50;