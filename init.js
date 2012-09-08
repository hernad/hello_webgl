var renderer = null, 
	scene = null, 
	camera = null,
	cube = null,
	animating = false;

window.addEventListener("load", function()
{

	var canvas = document.getElementById("webglcanvas");
	
	/*
	var gl = initWebGL(canvas);
	initViewport(gl, canvas);
	initMatrices();
	var square = createSquare(gl);
	initShader(gl);
	draw(gl, square);
	*/
	
    // Create the Three.js renderer, add it to our div
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild( renderer.domElement );


  
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Put in a camera
    camera = new THREE.PerspectiveCamera( 45, container.offsetWidth / container.offsetHeight, 1, 4000 );
    camera.position.set( 0, 0, 3 );

    // Create a directional light to show off the object
	var light = new THREE.DirectionalLight( 0xffffff, 1.5);
	light.position.set(0, 0, 1);
	scene.add( light );

    // Create a shaded, texture-mapped cube and add it to the scene
    // First, create the texture map
    var mapUrl = "../images/molumen_small_funny_angry_monster.jpg";
    var map = THREE.ImageUtils.loadTexture(mapUrl);
	
	
    // Now, create a Phong material to show shading; pass in the map
    var material = new THREE.MeshPhongMaterial({ map: map });

    // Create the cube geometry
    var geometry = new THREE.CubeGeometry(1, 1, 1);

    // And put the geometry and material together into a mesh
    cube = new THREE.Mesh(geometry, material);

    // Turn it toward the scene, or we won't see the cube shape!
    cube.rotation.x = Math.PI / 5;
    cube.rotation.y = Math.PI / 5;

    // Add the cube to our scene
    scene.add( cube );

    // Add a mouse up handler to toggle the animation
    addMouseHandler();

    // Run our render loop
    run();
  
  
}, false);

function initWebGL(canvas) {

    var gl;
    try 
    {
        gl = canvas.getContext("experimental-webgl");
    } 
    catch (e)
    {
        var msg = "Error creating WebGL Context!: " + e.toString();
        alert(msg);
        throw Error(msg);
    }

    return gl;        
 }

function initViewport(gl, canvas)
{
    gl.viewport(0, 0, canvas.width, canvas.height);
}

var projectionMatrix, modelViewMatrix;

function initMatrices()
{
   // The transform matrix for the square - translate back in Z for the camera
   modelViewMatrix = new Float32Array(
           [1, 0, 0, 0,
            0, 1, 0, 0, 
            0, 0, 1, 0, 
            0, 0, -3.333, 1]);
       
   // The projection matrix (for a 45 degree field of view)
   projectionMatrix = new Float32Array(
           [2.41421, 0, 0, 0,
            0, 2.41421, 0, 0,
            0, 0, -1.002002, -1, 
            0, 0, -0.2002002, 0]);
	
}

// Create the vertex data for a square to be drawn
function createSquare(gl) {
	
	
    var vertexBuffer;
	vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    var verts = [
         .5,  .5,  0.0,
        -.5,  .5,  0.0,
         .5, -.5,  0.0,
        -.5, -.5,  0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    var square = {buffer:vertexBuffer, vertSize:3, nVerts:4, primtype:gl.TRIANGLE_STRIP};
    return square;
}

function createShader(gl, str, type) {
    var shader;
    if (type == "fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == "vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}
    
var vertexShaderSource =	
	"    attribute vec3 vertexPos;\n" +
	"    uniform mat4 modelViewMatrix;\n" +
	"    uniform mat4 projectionMatrix;\n" +
	"    void main(void) {\n" +
	"		// Return the transformed and projected vertex value\n" +
	"        gl_Position = projectionMatrix * modelViewMatrix * \n" +
	"            vec4(vertexPos, 1.0);\n" +
	"    }\n";

var fragmentShaderSource = 
	"    void main(void) {\n" +
	"    // Return the pixel color: always output white\n" +
    "    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n" +
	"}\n";


var shaderProgram, shaderVertexPositionAttribute, shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

function initShader(gl) {

	// load and compile the fragment and vertex shader
    //var fragmentShader = getShader(gl, "fragmentShader");
    //var vertexShader = getShader(gl, "vertexShader");
    var fragmentShader = createShader(gl, fragmentShaderSource, "fragment");
    var vertexShader = createShader(gl, vertexShaderSource, "vertex");

    // link them together into a new program
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // get pointers to the shader params
    shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);
        
    shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");

        
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
}

function draw(gl, obj) {

     // clear the background (with black)
     gl.clearColor(0.0, 0.0, 0.0, 1.0);
     gl.clear(gl.COLOR_BUFFER_BIT);

	 // set the vertex buffer to be drawn
     gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);

     // set the shader to use
     gl.useProgram(shaderProgram);

	// connect up the shader parameters: vertex position and projection/model matrices
     gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);
     gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
     gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, modelViewMatrix);

     // draw the object
     gl.drawArrays(obj.primtype, 0, obj.nVerts);
}
          