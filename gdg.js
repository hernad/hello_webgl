
// Glass-Distancer-Glass object
GDG = function()
{
	Sim.Object.call(this);
};

GDG.prototype = new Sim.Object();

GDG.prototype.init = function(app, geom, pos)
{
	
    this.height = geom.height || 10;
	this.width = geom.width || 10;
	this.depth_out = geom.depth_out || 2;
	this.depth_in = geom.depth_in || 2;
	this.depth_distancer = geom.depth_distancer || 1;
	
	this.pos = pos;
	this.parent = null;
	
	var id = this.id;
	
	// staklo ne postoji u matrici stakala, dodaj ga
	if (!(id in app.glasses)) {
	     app.glasses.push(this);
	     id = app.glasses.length;
	     this.id = id;
	}
	else {
		delete app.glasses[id];
		app.glasses[id] = this;
	}
	
    this.glass_out = new Glass();
	this.glass_out.init(app, 
        {width: this.width, height: this.height, depth: this.depth_out}, 
        {x: pos.x, y: pos.y, z: pos.z}, this);


	this.distancer = new Distancer();
	this.distancer.init(app, 
	   {width: this.width, height: this.height, depth: this.depth_distancer}, 
	   {x: pos.x, y: pos.y, z: pos.z + this.depth_out/2 + this.depth_distancer/2}, this);

	
	this.glass_in = new Glass();
	this.glass_in.init(app, 
        {width: this.width, height: this.height, depth: this.depth_in}, 
		{x: pos.x, y: pos.y, z: pos.z + this.depth_out/2 + this.depth_distancer + this.depth_in/2 }, this);

	
};
