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
    
	this.setPosition(this.pos.x, this.pos.y + this.height/2, this.pos.z);
	
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

	
Glass.IDG1 = 1;
Glass.IDG2 = 2;
Glass.IDG3 = 3;
Glass.IDG4 = 4;

Glass.CALLOUT_Y_OFFSET = 50;

