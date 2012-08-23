window.addEventListener("load", function() {
	onLoad();
}, false)

function onLoad()
{
	debugger;
	
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
    camera.position.set( 0, 0, 3.3333 );
    scene.add( camera );

    // Now, create a rectangle and add it to the scene
    var geometry = new THREE.PlaneGeometry(1, 1);               
    var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( ) );
    scene.add( mesh );

    // Render it
    renderer.render( scene, camera );
}