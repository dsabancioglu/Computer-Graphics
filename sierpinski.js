
//programı fonklara ayırdığım için gl değişkenini de global yaptım. Önceden eski mainimiz (şimdiki initimizin) içindeydi,
// eğer orda kalmaya devam etseydi render fonktan hata alırdık.
var gl; 
var numPoints = 5000;

window.onload= function init() { //eskiden yukarda main() 'i çağırıyodum,aynı işlemi bu şekilde de yapabilirim (hatta bi tık daha sağlıklı)
//mainin adıın init (initialization) ile değiştirdim. Programı daha anlaşılır hale getirmeye çalışıyorum, render ve initialization kısmı ayrı şu an.
//bu bölümleri ayırmak isteme sebeplerimiz, eğer ben birden fazla frame çizmek istersem, render kısmını ayırarak diğer frame ler için de kullanabilirim.

	const canvas= document.querySelector("#glcanvas");
	
	//initialize the gl context
	gl=canvas.getContext("webgl");
	
	//only continue if webgl is available and working
	if(!gl){
		alert("Unable to initialize webgl. Your browser or machine may not support it.");
		
		return ;
		
	}
	
	var program=initShaders(gl,"vertex-shader","fragment-shader"); //INITSHADERS FONU ÇAĞIRIP DÖNDÜRDÜÜ PROG U PROGRAM DEĞİŞKENİNE ATADIK
	
	/*
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
		return -1;															BURAYI TAMAMEN SİLDİK YERİNE İNİTSHADERS.JS DOSYASINI EKLEDİK(AYNI GÖREVİ YAPIYO)
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
	*/
	
	gl.useProgram( program );

	/*BURAYI SİLİP YERİNE GENERATING SIERPINSKI GASKET KODUNU EKLİYORUM SLAYTTAKİ
	// Three Vertices
	var vertices = new Float32Array( 
			[ -1, -1,     //Buradaki vertexlerle (koordinatlarla)oynayabiliriz.
			   1, -1,     //üçgenin 1 köşesinin koordinatlarını ifade eder.
			   0,  1  ]);
			   
	*/
	
	
	var vertices = [ vec2(-1.0, -1.0), 
					vec2(0.0, 1.0),
					vec2(1.0, -1.0) ];

	var u = scale(0.5, add(vertices[0], vertices[1]));				//GENERATING SIERPINSKI GASKET KODU
	var v = scale(0.5, add(vertices[0], vertices[2]));
	var p = scale(0.5, add(u, v));
	points = [ p ];

	for (var i = 1; i < numPoints; ++i) { 	//NUMPOINTS YUKARDA GLOBAL OLARAK TANIMLI
		var j = Math.floor(Math.random() * 3);
		p = scale(0.5, add(points[i-1], vertices[j]));
		points.push(p);
	}


	
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW ); 		//flatten methodu->mv.jsde tanımlanan bir method, burada flatten(poinits)
																			//dediğimizde stacke eklediğimiz pointleri 32floatarray'e çeviriyo
	// Associate out shader variables with our data buffer					//geçen hafta orda vertices yazıyodu direkt flatten'a ihtiyaç duymadık, çünkü benim
	var vPosition = gl.getAttribLocation( program, "vPosition" );			//koordinatlarım direkt float32 tipinde set ediliyodu.
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );



	//set clear color (arkaplan rengi)
	gl.clearColor(0.0,0.0,0.0,1.0);
	
	render();
	
	}; //yukarıya window.onload dediğim için buraya ; ekliyorum, önceden yoktu.
	
	
	function render(){ 
	//render işlemlerini(yani ekrana görüntü getirme) tek bi fonk'da topladım. 
	//Böylece initialization kısmıyla render kısmını (3 kısımdan oluşuyodu ->initialization,geometric arrangements,rendering) ayırmış oldum.
		
		//clear the color buffer with specified clear color
		gl.clear(gl.COLOR_BUFFER_BIT); //arkaplan boyama
	
		gl.drawArrays( gl.POINTS, 0, numPoints); //içi dolu üçgen çizdirme		//önceden 3 yazıyodu 3 koordinatım old için, şimdi oraya numpoints değişkenini yazcam
	}
	
	

