
//programı fonklara ayırdığım için gl değişkenini de global yaptım. Önceden eski mainimiz (şimdiki initimizin) içindeydi,
// eğer orda kalmaya devam etseydi render fonktan hata alırdık.
var gl; 
var theta;
var thetaLoc;

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
	
	var program=initShaders(gl,"vertex-shader","fragment-shader"); //INITSHADERS FONU ÇAĞIRIP DÖNDÜRDÜm PROG U PROGRAM DEĞİŞKENİNE ATADIK
	
	gl.useProgram( program );

	var vertices = [ vec2(-.6, -.6), 		//karenin koordinatlarını ekledim(döndürülecek olan kare)
					vec2(.6, -.6),
					vec2(.6, .6), 
					vec2(-.6, .6)];
				
				
	
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW ); 	//flatten'a (float32 tipine çeviren fonk) vertices'i yolluyorum.	
																			
	// Associate out shader variables with our data buffer					
	var vPosition = gl.getAttribLocation( program, "vPosition" );	//shaderdaki vpositiona erişim elde ediyoruz (vpositionı erişilebilir hale getirdik)		
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );   //vpositiona 2 float değer gööndericem diyorum, çünkü yukardaki her bir vec2 jsde 2 boyutlu vektörler,onları
	gl.enableVertexAttribArray( vPosition );						// float halinde göndermem gerekiyor (koordinat şeklinde)
	//son satırda vpositionı enable hale getirdik, current bufferla associate ettik.

	thetaLoc = gl.getUniformLocation(program, "theta"); //theata isimli değişkene thetaLoc üzerinden erişim elde ettim.
	theta=0; //thetaya ilk değerini atadım. 0 açıyla döndürme =yerinde bırakma
	gl.uniform1f(thetaLoc, theta); //burdaki theta benim global olarak tanımladığım değer (jsdeki theta) , theta değerini thetaloc a gönderiyorum.



	//arkaplanı beyaz yaptım
	gl.clearColor(1.0,1.0,1.0,1.0);
	
	setInterval(render, 50)  //bir timer oluşturuyo ve belli aralıklara benim fonksiyonumu tekrar tekrar çağırcak. Bu aralığı da ikinci parametreyle belirliyoruz milisaniye 
							//cinsinden. 16 milisaniye. ilk parametre de çağırmak istediğim fonksiyonumun adı 
	
	}; //yukarıya window.onload dediğim için buraya ; ekliyorum, önceden yoktu.
	
	
	function render(){ 
	//render işlemlerini(yani ekrana görüntü getirme) tek bi fonk'da topladım. 
	//Böylece initialization kısmıyla render kısmını (3 kısımdan oluşuyodu ->initialization,geometric arrangements,rendering) ayırmış oldum.
		
		gl.clear(gl.COLOR_BUFFER_BIT); //arkaplan boyama
	
		theta += 0.1;
		gl.uniform1f(thetaLoc, theta);
		gl.drawArrays(gl.LINE_LOOP, 0, 4);


	}
	
	

