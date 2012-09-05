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
    this.controls.push(g1);

    // Create the Control and add it to our sim
    var info = new Control();
    info.init({ id : Control.ID_G2, icon : "images/solar_tr.png" });
    this.addObject(info);
    this.controls.push(info);

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

Control.prototype.handleMouseOut = function(x, y)
{
	this.mesh.scale.set(1, 1, 1);
	this.mesh.material.ambient.setRGB(.667, .667, .667);
	//this.object3D.rotation.x = + Math.PI / 12;
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

Control.ID_NONE = -1;
Control.ID_G1 = 0;
Control.ID_G2 = 1;
