
// Glass-Distancer-Glass object
GDG = function()
{
	Sim.Object.call(this);
};

GDG.prototype = new Sim.Object();

GDG.prototype.init = function(app, geom, pos)
{

	this.app = app;
    this.height = geom.height || 10;
	this.width = geom.width || 10;
	this.depth_out = geom.depth_out || 2;
	this.depth_in = geom.depth_in || 2;
	this.depth_distancer = geom.depth_distancer || 1;

	this.pos = pos;
	
	// setuj pos.x koordinatu
	this.set_x();

	
	this.parent = null;
	
	var id = this.id;
	
	// staklo ne postoji u matrici stakala, dodaj ga
	if (!(id in app.glasses)) {
	     app.glasses.push(this);
	     id = app.glasses.length;
	     this.id = id;
	}
	else {
		delete app.glasses[id-1];
		app.glasses[id-1] = this;
	}


	// stavimo jednu tacku prema pos koordinati da ona bude nosilac ovog slozenog objekta
	var geometry = new THREE.Geometry();
	var v1 = new THREE.Vector3(- this.width/2, 1, 0);
	geometry.vertices.push(new THREE.Vertex(v1));
	
	var v2 = new THREE.Vector3(this.width/2, 1, 0);
	geometry.vertices.push(new THREE.Vertex(v2)); 
	
	var material = new THREE.LineBasicMaterial({ color: 0xff0000, opacity: 0.01, linewidth: 2 });
    var mesh = new  THREE.Line( geometry, material );
	
    this.setObject3D(mesh);
    this.mesh = mesh;
    app.addObject(this);
    

    // child objekti imaju koordinate uvijek RELATIVNE u odnosu na master obejakt 
    this.glass_out = new Glass();
	this.glass_out.init(app, 
        {width: this.width, height: this.height, depth: this.depth_out}, 
        {x: 0, y: 0, z: 0}, this);

	this.addChild(this.glass_out);
	
	this.distancer = new Distancer();
	this.distancer.init(app, 
	   {width: this.width, height: this.height, depth: this.depth_distancer}, 
	   {x: 0, y: 0, z: 0 + this.depth_out/2 + this.depth_distancer/2}, this);

	this.addChild(this.distancer);
	
	
	this.glass_in = new Glass();
	this.glass_in.init(app, 
        {width: this.width, height: this.height, depth: this.depth_in}, 
		{x: 0, y: 0, z: 0 + this.depth_out/2 + this.depth_distancer + this.depth_in/2 }, this);

	this.addChild(this.glass_in);

	this.setPosition(this.pos.x, this.pos.y, this.pos.z);
	

	
	
	
};

GDG.prototype.animate = function(on)
{
	if (this.animator !== undefined)
	   delete this.animator;
	
	this.rotationValues = [ { x: this.mesh.rotation.x},
	                        { x: this.mesh.rotation.x + Math.PI},
	                        { x: this.mesh.rotation.x + Math.PI/2},
	                        { x: this.mesh.rotation.x}
	                     ];
	
	this.positionValues = [ { x: this.pos.x, y: this.pos.y +  0, z: this.pos.z}, 
	                        { x: this.pos.x, y: this.pos.y + 10, z: this.pos.z},
	                        { x: this.pos.x, y: this.pos.y + 15, z: this.pos.z},
	                        { x: this.pos.x, y: this.pos.y +  0, z: this.pos.z}
	                     ];
	
	this.animator = new Sim.KeyFrameAnimator;
	this.animator.init({ 
		interps:
			[ 
		       { keys:GDG.positionKeys, values:this.positionValues, target:this.object3D.position },
		       { keys:GDG.rotationKeys, values:this.rotationValues, target:this.object3D.rotation } 
			],
		loop: GDG.loopAnimation,
		duration: GDG.animation_time
	});
	
   this.addChild(this.animator);
   this.animator.subscribe("complete", this, this.onAnimationComplete);
		
   if (on)
   {
	  this.animator.loop = GDG.loopAnimation;
      this.animator.start();
   }
   else
   {
	  this.animator.stop();
   }
};

GDG.prototype.onAnimationComplete = function()
{
   this.publish("complete");
};

GDG.positionKeys = [0, 0.5, 0.75, 1];

GDG.rotationKeys = [0, 0.5, 0.75, 1];


GDG.prototype.set_x = function() {
	
	if (this.pos.x === null)
    {

	   if (this.app.glasses.length > 0)
	      this.app.x += this.width/2;
	      
	   this.pos.x = this.app.x;   
	   this.app.x += this.width / 2 + GlassApp.X_DELTA;
    }
	
	
};

GDG.prototype.update_x = function(x) {
	
	var y = this.mesh.position.y;
	var z = this.mesh.position.z;
	
	this.pos.x = x;
	this.setPosition(x, y, z);
	
};


GDG.prototype.remove_me = function()
{
	this.app.removeObject(this);
	
};

GDG.prototype.decrement_id = function()
{
   this.id -= 1;
   this.glass_out.id -= 1;
   this.distancer.id -= 1;
   this.glass_in.id -= 1;
};
