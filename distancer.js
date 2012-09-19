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
    
	this.setPosition(this.pos.x, this.pos.y, this.pos.z);
	
	
	// dodaj u matricu ovaj distancer
	if (!(id in app.glasses))
	     app.glasses.push(this);
	else {
		delete app.glasses[id];
		app.glasses[id] = this;
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
	/*
	 
	// ovo henlidra app objekat
	// on se pretplatio na "over" dogadjaj
	this.publish("over", this.id);
	
	*/
	
};

Distancer.IDD1 = 1;
Distancer.IDD2 = 2;