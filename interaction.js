
//programı fonklara ayırdığım için gl değişkenini de global yaptım. Önceden eski mainimiz (şimdiki initimizin) içindeydi,
// eğer orda kalmaya devam etseydi render fonktan hata alırdık.
var gl; 
var theta;
var thetaLoc;
var isDirClockWise= false;//default olarak false şeklinde tanımladım
var delay=100;

function buttonPressFunc() {
	isDirClockWise = !isDirClockWise;
	
	}

window.onload= function init() { //init fonk bir nevi callback function 

	const canvas= document.querySelector("#glcanvas");
	
	//initialize the gl context
	gl= WebGLUtils.setupWebGL(canvas); //manuel yaptığımız işlemi otomatik yaptık (otomatik set etme olayını gerçekleştirmiş olduk
										//ilgili canvasta
										
	//only continue if webgl is available and working
	if(!gl){
		alert("Unable to initialize webgl. Your browser or machine may not support it.");
		
		return ;
		
	}
	
	var program=initShaders(gl,"vertex-shader","fragment-shader"); //INITSHADERS FONU ÇAĞIRIP DÖNDÜRDÜm PROG U PROGRAM DEĞİŞKENİNE ATADIK
	
	gl.useProgram( program );
	
	var myButton = document.getElementById("DirectionButton"); //ilgili butonumu buluyorum onu bir değişkene atayıp erişilebilir hale getiriyorum. (ıdsi üzerinden)
	//myButton.addEventListener("click", function() {isDirClockWise = !isDirClockWise;}); //click yaptığım zaman fonksiyonu çalıştır. (fonksiyonda yapılan iş eğer
																						//benim isDirClockWise ım true ise false yapıyorum, false ise true yapıyorum						
																						//yani her butona click edildiğinde benim yönüm değişecek.
	//35.satırdaki yerine yukarda fonk tanımlayarak 2.parametrede direkt fonk çağırdık.																					
	myButton.addEventListener("click",buttonPressFunc );
	
	var m = document.getElementById("mymenu");
	m.addEventListener("click", function() {
		switch (m.selectedIndex) {
			case 0:
				isDirClockWise = !isDirClockWise;   //yukarda yaptığımız gibi yönünü değiştirme
				break;
			case 1:
				delay /= 2.0;
				break;
			case 2:
				delay *= 2.0;
				break;
		}
	});


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
	gl.clearColor(0.8,0.8,0.8,1.0); //arkaplan rengini set ettik 
	  
	requestAnimFrame(render);  //bir timer oluşturuyo ve belli aralıklara benim fonksiyonumu tekrar tekrar çağırcak. Bu aralığı da ikinci parametreyle belirliyoruz milisaniye 
							//cinsinden. 16 milisaniye. ilk parametre de çağırmak istediğim fonksiyonumun adı 
	
	}; //yukarıya window.onload dediğim için buraya ; ekliyorum, önceden yoktu.
	
	
	function render(){ 
	//render işlemlerini(yani ekrana görüntü getirme) tek bi fonk'da topladım. 
	//Böylece initialization kısmıyla render kısmını (3 kısımdan oluşuyodu ->initialization,geometric arrangements,rendering) ayırmış oldum.
		
		setTimeout(function(){ 
		gl.clear(gl.COLOR_BUFFER_BIT); //arkaplan boyama
	
		theta += (isDirClockWise ? -0.1 : 0.1);  //dönme yönümü belirliyorum, isDirClockWise true ise saat yönünde döncek (negatif yönde),
												//false ise saat yönünün tersinde 0.1 derecelik açıyla dönecek. 
												//Hatırlıyorsan saat yönünde dönmek negatifti, saat yönünün tersinde dönmek pozitifti. (pozitif açı)
		gl.uniform1f(thetaLoc, theta);
		gl.drawArrays(gl.LINE_LOOP, 0, 4);
		
		requestAnimFrame(render);
		},delay);   //100 ms aralıklarla function()  ı çağırıyo (ilk parametredeki) 


	}
	
	

