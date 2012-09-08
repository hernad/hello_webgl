/*
SaturnRings = function()
{
	Sim.Object.call(this);
}

SaturnRings.prototype = new THREE.Geometry();
SaturnRings.prototype.constructor = SaturnRings;


// The rings
SaturnRings = function ( innerRadius, outerRadius, nSegments ) {

	THREE.Geometry.call( this );

	var outerRadius = outerRadius || 1,
	innerRadius = innerRadius || .5,
	gridY = nSegments || 10;
	
	var i, twopi = 2 * Math.PI;
	var iVer = Math.max( 2, gridY );

	var origin = new THREE.Vector3(0, 0, 0);	
	//this.vertices.push(new THREE.Vertex(origin));

	for ( i = 0; i < ( iVer + 1 ) ; i++ ) {

		var fRad1 = i / iVer;
		var fRad2 = (i + 1) / iVer;
		var fX1 = innerRadius * Math.cos( fRad1 * twopi );
		var fY1 = innerRadius * Math.sin( fRad1 * twopi );
		var fX2 = outerRadius * Math.cos( fRad1 * twopi );
		var fY2 = outerRadius * Math.sin( fRad1 * twopi );
		var fX4 = innerRadius * Math.cos( fRad2 * twopi );
		var fY4 = innerRadius * Math.sin( fRad2 * twopi );
		var fX3 = outerRadius * Math.cos( fRad2 * twopi );
		var fY3 = outerRadius * Math.sin( fRad2 * twopi );
		
		var v1 = new THREE.Vector3( fX1, fY1, 0 );
		var v2 = new THREE.Vector3( fX2, fY2, 0 );
		var v3 = new THREE.Vector3( fX3, fY3, 0 );
		var v4 = new THREE.Vector3( fX4, fY4, 0 );
		this.vertices.push( new THREE.Vertex( v1 ) );
		this.vertices.push( new THREE.Vertex( v2 ) );
		this.vertices.push( new THREE.Vertex( v3 ) );
		this.vertices.push( new THREE.Vertex( v4 ) );
		
	}

	for ( i = 0; i < iVer ; i++ ) {

		this.faces.push(new THREE.Face3( i * 4, i * 4 + 1, i * 4 + 2));
		this.faces.push(new THREE.Face3( i * 4, i * 4 + 2, i * 4 + 3));
		this.faceVertexUvs[ 0 ].push( [
			       						new THREE.UV(0, 1),
			       						new THREE.UV(1, 1),
			       						new THREE.UV(1, 0) ] );
		this.faceVertexUvs[ 0 ].push( [
			       						new THREE.UV(0, 1),
			       						new THREE.UV(1, 0),
			       						new THREE.UV(0, 0) ] );
	}	

	this.computeCentroids();
	this.computeFaceNormals();

	this.boundingSphere = { radius: outerRadius };
};

*/

// Constructor
SelectGlassApp = function()
{
	Sim.App.call(this);
}

// SelectGlass je podklasa Sim.App
SelectGlassApp.prototype = new Sim.App();

// Our custom initializer
SelectGlassApp.prototype.init = function(param)
{
	// Zovemo superclass init da podesimo scenu, renderer, kameru
	Sim.App.prototype.init.call(this, param);
	
    // Create a directional light to show off the Control
	var light = new THREE.DirectionalLight( 0xffffff, 1);
	light.position.set(1, 0, 1).normalize();
	this.scene.add(light);
	
	this.camera.position.set(0, 1, 6);
	this.camera.lookAt(this.root);
	
	this.controls = [];
	
    // Create the Control and add it to our sim
    var g1 = new Control();
    g1.init({ id : Control.ID_G1, icon : "images/low-e_tr.png" });
   
	this.addObject(g1);
	// kada budeš nad ovom kontrolom aktiviraj onGlassOver
    g1.subscribe("over", this, this.onGlassOver);	
    this.controls.push(g1);

    // Create the Control and add it to our sim
    var g2 = new Control();
    g2.init({ id : Control.ID_G2, icon : "images/solar_tr.png" });
	
    this.addObject(g2);
	g2.subscribe("over", this, this.onGlassOver);
	this.controls.push(g2);

    this.layoutControls();
    
    this.selectedControl = null;
    
}

SelectGlassApp.prototype.layoutControls = function()
{
	var scale = 2;
	var theta = 0;
	var x = scale * Math.sin(theta);
	var z = scale * Math.cos(theta);
	var y = 0;

	var nControls = this.controls.length;
	var left = (nControls - 1 )/ 2 * -scale;
	
	var i;

	x = left;
	y = z = 0;
	for (i = 0; i < nControls; i++)
	{
		this.controls[i].setPosition(x, y, z);
		x += scale;
		
		this.controls[i].subscribe("selected", this, this.onControlSelected)
	}
}

SelectGlassApp.prototype.onControlSelected = function(control, selected)
{
	if (control == this.selectedControl)
	{
		if (!selected)
		{
			this.selectedControl = null;
		}
	}
	else
	{
		if (selected)
		{
			if (this.selectedControl)
			{
				this.selectedControl.deselect();
			}
			this.selectedControl = control;
		}
	}
}

SelectGlassApp.prototype.update = function()
{
    TWEEN.update();

    Sim.App.prototype.update.call(this);
}



SelectGlassApp.prototype.handleMouseUp = function(x, y)
{
	var callout = document.getElementById("callout");
	callout.style.display = "none";
}

// viewport kompletne scene umanjuje/uvecava sa mouse scroll
SelectGlassApp.prototype.handleMouseScroll = function(delta)
{
	var dx = delta;

    // ako skrolamo mjenjamo z poziciju
	this.camera.position.z -= dx;	
}


SelectGlassApp.prototype.onGlassOver = function()
{
	var html = "";
	switch(this.selectedControl)
	{
		case Control.ID_G1 :
			headerHtml = "Staklo G1";
			contentsHtml = 
				"Širina: 1 mm<br>Visina: 1 mm<br>" +
					"Karakteristike: vako nako";
			break;
			
		case Control.ID_G2 :
		    headerHtml = "Staklo G2";
			contentsHtml = 
			"Širina: 2 mm<br>Visina: 2 mm<br>" +
				"Karakteristike: vako2 nako2";

			break;
			
	}
	
	// Populate the callout
	var callout = document.getElementById("callout");
	var calloutHeader = document.getElementById("header");
	var calloutContents = document.getElementById("contents");
	
	calloutHeader.innerHTML = headerHtml;
	calloutContents.innerHTML = contentsHtml;
	callout.glassID = this.selectedControl;
	
	// Place the callout near the object and show it
	var screenpos = this.getObjectScreenPosition(this.SelectedControl);
	
	// dinamički setujem stil za callout div
	// non => block
	callout.style.display = "block";
	callout.style.left = (screenpos.x - callout.offsetWidth / 2)+ "px";
	callout.style.top = (screenpos.y + Shipster.CALLOUT_Y_OFFSET) + "px";

}



// ------------------------------------------------------

// Custom Control class
Control = function()
{
	Sim.Object.call(this);
}

// Control class (prototype)

Control.prototype = new Sim.Object();

Control.prototype.init = function(param)
{
	this.id = param.id || Control.ID_NONE;
	
	var icon = param.icon || '';
	
	var pic_map = THREE.ImageUtils.loadTexture(icon);

  
    // Create our Control
	// var geometry = new THREE.PlaneGeometry(1, 1, 32, 32)

    var geometry = new THREE.CubeGeometry(2, 2, 0.2);
	
	//ambient: 0xababab
    //var material = new THREE.MeshPhongMaterial({ color: 0xffffff, ambient: 0xffffff, transparent: true, map: pic_map } );
	
	//
	var material = new THREE.MeshPhongMaterial({ color: 0xffffff, ambient: 0xffffff, transparent: true} );
	
	//var material = new THREE.MeshBasicMaterial( {color: 0xffffff, map: pic_map })		
    var mesh = new THREE.Mesh( geometry, material );


/*
    var ringsmap = "images/SatRing.png";
	
    var geom = new SaturnRings(1.1, 1.867, 64);
    
    var texture = THREE.ImageUtils.loadTexture(ringsmap);
    var material = new THREE.MeshLambertMaterial( {map: texture, transparent:true, ambient:0xffffff } );
    var mesh = new THREE.Mesh( geom, material );
    mesh.doubleSided = true;
    mesh.rotation.x = Math.PI / 2;
*/

	//mesh.position.z = - .255;
	 
    mesh.doubleSided = true;
    // mesh.position.set(-2, 0, 2);
    // mesh.rotation.x = Math.PI / 12;
    
    // Tell the framework about our object
    this.setObject3D(mesh);
    this.mesh = mesh;
	
	// zakreni ga
    // Turn the canvas a bit so that we can see the 3D-ness
    this.object3D.rotation.y = Math.PI / 6;
    this.object3D.rotation.x = Math.PI / 12;
	
	this.selected = false;
    
    // Have the framework show the pointer when over
    this.overCursor = 'pointer';
}


Control.prototype.handleMouseOver = function(x, y)
{
	this.mesh.scale.set(1.05, 1.05, 3);
	this.mesh.material.ambient.setRGB(.777,.777,.777);
	//this.object3D.rotation.x = - Math.PI / 12;
}

/*
Control.prototype.handleMouseOut = function(x, y)
{
	this.mesh.scale.set(1, 1, 1);
	this.mesh.material.ambient.setRGB(.667, .667, .667);
	//this.object3D.rotation.x = + Math.PI / 12;
}
*/

Control.prototype.handleMouseOver = function(x, y)
{
	var html = "";
	switch(this.id)
	{
		case Control.ID_G1 :
			headerHtml = "Staklo G1";
			contentsHtml = 
				"Širina: 1 mm<br>Visina: 1 mm<br>" +
					"Karakteristike: vako nako";
			break;
			
		case Control.ID_G2 :
		    headerHtml = "Staklo G2";
			contentsHtml = 
			"Širina: 2 mm<br>Visina: 2 mm<br>" +
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
	var _msg = "callot header undefined";
	if (calloutHeader == undefined) { 
		  console.log(_msg);
		  //alert(_msg);
	}
	
	if (callout == undefined) console.log("callout undefined");
	
	calloutHeader.innerHTML = headerHtml;
	calloutContents.innerHTML = contentsHtml;
	callout.glassID = this.selectedControl;
	
	// Place the callout near the object and show it
	var screenpos = this.getObjectScreenPosition(this.SelectedControl);
	
	// dinamički setujem stil za callout div
	// non => block
	callout.style.display = "block";
	callout.style.left = (screenpos.x - callout.offsetWidth / 2)+ "px";
	callout.style.top = (screenpos.y + Shipster.CALLOUT_Y_OFFSET) + "px";

}



Control.prototype.handleMouseDown = function(x, y, position)
{
	if (!this.selected)
	{
		this.select();
	}
	else
	{
		this.deselect();
	}
}

Control.prototype.select = function()
{
	if (!this.savedposition)
	{
		this.savedposition = this.mesh.position.clone();
	}
	
	new TWEEN.Tween(this.mesh.position)
    .to({
        x : 0,
        y : 0,
        z: 2
    	}, 500).start();
	
	this.selected = true;
	this.publish("selected", this, true);
}

Control.prototype.deselect = function()
{
	new TWEEN.Tween(this.mesh.position)
    .to({ x: this.savedposition.x, 
    	  y: this.savedposition.y,
    	  z: this.savedposition.z
    	}, 500).start();
	
	this.selected = false;
	this.publish("selected", this, false);
}


// ooou ja ovo nista ne kontam
SelectGlassApp.prototype.getObjectScreenPosition = function(object)
{	
	debugger;
	
	var mat = object.object3D.matrixWorld;
	var pos = new THREE.Vector3();
	pos = mat.multiplyVector3(pos);

	projected = pos.clone();
	this.projector.projectVector(projected, this.camera);

	var eltx = (1 + projected.x) * this.container.offsetWidth / 2 ;
	var elty = (1 - projected.y) * this.container.offsetHeight / 2;

	var offset = $(this.renderer.domElement).offset();	
	eltx += offset.left;
	elty += offset.top;
		
	return { x : eltx, y : elty };
}


// --------------------------------------
// vrste stakla
Control.ID_NONE = -1;
Control.ID_G1 = 0;
Control.ID_G2 = 1;

