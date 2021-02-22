main();
//ÜÇGEN ÇİZDİRME
function main() {

	const canvas= document.querySelector("#glcanvas");
	
	//initialize the gl context
	const gl=canvas.getContext("webgl");
	
	//only continue if webgl is available and working
	if(!gl){
		alert("Unable to initialize webgl. Your browser or machine may not support it.");
		
		return ;
		
	}
	var vertShdr;
	var fragShdr;

	var vertElem = document.getElementById( "vertex-shader" );
	if ( !vertElem ) {
		alert( "Unable to load the vertex shader!" );
		return -1;
	}
	else {
	vertShdr = gl.createShader( gl.VERTEX_SHADER );
	gl.shaderSource( vertShdr, vertElem.text );
	gl.compileShader( vertShdr );
	
	if ( !gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS) ) {
      alert( "Vertex shader failed to compile!" );
      return -1;
	}
	}
	
	var fragElem = document.getElementById( "fragment-shader" );
	if ( !fragElem ) {
		alert( "Unable to load fragment shader!" );
		return -1;
	}
	else {
		fragShdr = gl.createShader( gl.FRAGMENT_SHADER );
		gl.shaderSource( fragShdr, fragElem.text );
		gl.compileShader( fragShdr );
   if ( !gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS) ) {
      alert( "Fragment shader failed to compile!" );
      return -1;
   }
}

	var program = gl.createProgram();
	gl.attachShader( program, vertShdr );
	gl.attachShader( program, fragShdr );
	gl.linkProgram( program );

	if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
		alert( "Shader program failed to link!" );
		return -1;
	}
	gl.useProgram( program );


	// Three Vertices
	var vertices = new Float32Array( 
			[ -1, -1,
			   1, -1,
			   0,  1  ]);
			   
			   
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );
	
	// Associate out shader variables with our data buffer
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );



	//set clear color (arkaplan rengi)
	gl.clearColor(0.0,0.0,0.0,1.0);
	
	//clear the color buffer with specified clear color
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	gl.drawArrays( gl.TRIANGLES, 0, 3 );

	
}