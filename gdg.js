
// Glass-Distancer-Glass object
GDG = function()
{
	Sim.Object.call(this);
};

GDG.prototype = new Sim.Object();

GDG.prototype.init = function(app, geom, pos, id)
{
	
    this.height = geom.height || 10;
	this.width = geom.width || 10;
	this.depth_out = geom.depth_out || 2;
	this.depth_in = geom.depth_in || 2;
	this.depth_distancer = geom.depth_distancer || 1;
	
	this.pos = pos;
	
	this.id = id;

    this.glass_out = new Glass();
	this.glass_out.init(app, 
        {width: this.width, height: this.height, depth: this.depth_out}, 
        {x: pos.x, y: pos.y, z: pos.z}, -1);



	this.distancer = new Distancer();
	this.distancer.init(app, 
	   {width: this.width, height: this.height, depth: this.depth_distancer}, 
	   {x: pos.x, y: pos.y, z: pos.z + this.depth_out/2 + this.depth_distancer/2}, -1);

	
	
	this.glass_in = new Glass();
	this.glass_in.init(app, 
        {width: this.width, height: this.height, depth: this.depth_in}, 
		{x: pos.x, y: pos.y, z: pos.z + this.depth_out/2 + this.depth_distancer + this.depth_in/2 }, -1);


	
	// dodaj u matricu ovo staklo
	if (!(id in app.glasses))
	     app.glasses.push(this);
	else {
		delete app.glasses[id];
		app.glasses[id] = this;
	}
	
};
