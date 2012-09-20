// ------------------------------------
// Glass object
Glass = function()
{
	Sim.Object.call(this);
};

Glass.prototype = new Sim.Object();

Glass.prototype.init = function(app, geom, pos, parent)
{
	this.app = app;
    this.height = geom.height || 10;
	this.width = geom.width || 10;
	this.depth = geom.depth || 2;

	if (pos.x === null)
    {

	   if (app.glasses.length > 0)
	      app.x += this.width/2;
	      
	   pos.x = app.x;   
	   app.x += this.width / 2 + GlassApp.X_DELTA;
    }
	
	this.pos = pos;
	
	var id = 0;
	if (parent instanceof GDG) {
		id = parent.id;
	    this.parent = parent;
	}
	else {
		id = this.id;
	    this.parent = null;
	}
	
	this.id = id;
	

	this.update_geometry(this.width, this.height, this.depth);
    
	this.setPosition(this.pos.x, this.pos.y + this.height/2, this.pos.z);
	
	// ako staklo nije samostalno ne dodaje se u matricu;
	if (parent instanceof GDG)
		return;
	
	// dodaj u matricu ovo staklo
	if (!(id in app.glasses)) {
	     app.glasses.push(this);
	     id = app.glasses.length;
	     this.id = id;
	}
	else {
		delete app.glasses[id];
		app.glasses[id-1] = this;
	}
	
};

Glass.prototype.update_x = function(x) {
	var y = this.mesh.position.y;
	var z = this.mesh.position.z;
	
	this.setPosition(x, y, z);
};

Glass.prototype.update_geometry = function(width, height, depth)
{
	
    var geometry = new THREE.CubeGeometry(width, height, depth);
	
	var material = new THREE.MeshPhongMaterial({color: 0xffffff, ambient: 0xffffff, transparent: true, reflectivity: 1, opacity: 0.65} );		
    var mesh = new THREE.Mesh( geometry, material );

    //mesh.doubleSided = true;
	
    this.setObject3D(mesh);
    this.mesh = mesh;
	
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

Glass.prototype.remove_me = function()
{
	this.app.removeObject(this);
	delete app.glasses[this.id - 1];
	
};

Glass.prototype.decrement_id = function()
{
   this.id = this.id - 1;	
};
	
Glass.CALLOUT_Y_OFFSET = 50;

