window.addEventListener("load", function() {
    debugger;
	onLoad();
}, false);

function onLoad()
{

	// Grab our container div
    var container = document.getElementById("container");

    // Create the Three.js renderer, add it to our div
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild( renderer.domElement );

    // Create a new Three.js scene
    var scene = new THREE.Scene();

    // Create a camera and add it to the scene
    var camera = new THREE.PerspectiveCamera( 45, container.offsetWidth / container.offsetHeight, 1, 4000 );
  
  
    camera.position.set( 1, 1, 10 );
    scene.add( camera );

	
    //mesh = create_rectangle(2, 2);
    //scene.add( mesh );
    

	var cube = create_cube();
	
	
	// Add the cube to our scene
	scene.add( cube );

    // Render it
    renderer.render( scene, camera );
	
	
}

function create_rectangle (width, height) {
    // Now, create a rectangle and add it to the scene
    var geometry = new THREE.PlaneGeometry(width, height);               
    var r = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( ) );
	
	return r;
}

function create_cube()
{
	var mapUrl = "./kobo_Knife.png";
	var map = THREE.ImageUtils.loadTexture(mapUrl);
        
	// Now, create a Phong material to show shading; pass in the map
	//var material = new THREE.MeshPhongMaterial({ map: map });
	//var color = new THREE.Color();
	//color.setRGB(0.5, 1, 1);
	debugger;
	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true, wireframe_linewidth: 10 });
	
    //var material = new THREE.MeshPhongMaterial( {ambient: 0x808080, color: 0x00ff00  });

	// Create the cube geometry
	var geometry = new THREE.CubeGeometry(1, 1, 1);

	// And put the geometry and material together into a mesh
	var cube = new THREE.Mesh(geometry, material);

	// Turn it toward the scene, or we won't see the cube shape!
	cube.rotation.x = Math.PI / 5;
	cube.rotation.y = Math.PI / 5;

    return cube;	
}
