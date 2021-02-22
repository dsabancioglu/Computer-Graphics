
//programı fonklara ayırdığım için gl değişkenini de global yaptım. Önceden eski mainimiz (şimdiki initimizin) içindeydi,
// eğer orda kalmaya devam etseydi render fonktan hata alırdık.
var gl; 
var numPoints = 5000;


	function triangle(a, b, c,color) {	
	
		colors.push(baseColors[color]);
		points.push(a); 
		colors.push(baseColors[color]);
		points.push(b); 
		colors.push(baseColors[color]);
		points.push(c);
	}
	
	function pyramid (a,b,c,d,e) {
		triangle(a,b,c,0);
		triangle(a,c,e,1);
		triangle(a,d,e,2);
		triangle(a,b,d,3);
		triangle(b,c,d,4);
		triangle(c,d,e,4);
		
		
	}
	
	
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
	

	
	gl.useProgram( program );

	
	
	var vertices = [
	vec3(0.4,0,-0.4),
	vec3(0.4,0,-0.2),
	vec3(0.2,0,-0.2),
	vec3(0.2,0,-0.4),
	vec3(0.3,0.2,-0.3)
	];

	var baseColors=[
	vec3(1.0,.0,.0),
	vec3(.0,1.0,.0),
	vec3(.0,.0,1.0),
	vec3(.0,.0,.0),
	vec3(1.0,1.0,1.0)
	];
	
	var points[];
	
	
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW ); 	

	var vBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW ); 
	//flatten methodu->mv.jsde tanımlanan bir method, burada flatten(poinits)
																			//dediğimizde stacke eklediğimiz pointleri 32floatarray'e çeviriyo
	// Associate out shader variables with our data buffer					//geçen hafta orda vertices yazıyodu direkt flatten'a ihtiyaç duymadık, çünkü benim
	var vPosition = gl.getAttribLocation( program, "vPosition" );			//koordinatlarım direkt float32 tipinde set ediliyodu.
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(vColor);


	//set clear color (arkaplan rengi)
	gl.clearColor(0.0,0.0,0.0,1.0);
	
	render();
	
	}; //yukarıya window.onload dediğim için buraya ; ekliyorum, önceden yoktu.
	
	
	function render(){ 
	//render işlemlerini(yani ekrana görüntü getirme) tek bi fonk'da topladım. 
	//Böylece initialization kısmıyla render kısmını (3 kısımdan oluşuyodu ->initialization,geometric arrangements,rendering) ayırmış oldum.
		
		//clear the color buffer with specified clear color
		gl.clear(gl.COLOR_BUFFER_BIT); //arkaplan boyama
	
		gl.drawArrays( gl.TRIANGLES, 0,5); //içi dolu üçgen çizdirme		//önceden 3 yazıyodu 3 koordinatım old için, şimdi oraya numpoints değişkenini yazcam
	}
	
	

