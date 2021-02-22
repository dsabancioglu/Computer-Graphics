
var gl; 
var theta=0;
var scalevalue=1;
var shapecolor;
var thetaLoc;
var isDirClockWise= false;
var xs=0.5;
var ys=0.5;
var zs=0.5;
var ws=1;
var u_colorLocation;
var transLoc;
var transLoc2;


function transs(){
	
	gl.uniform1f(transLoc,transvalueleftright);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 45);
	
	
	
}


function transs2(){
	
	gl.uniform1f(transLoc2,transvalueupdown);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 45);
	
	
	
}



function colorshape(){
		
		gl.uniform4f(u_colorLocation, xs, ys, zs, 1.0);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 45);
	}	


function Rotation(){ 
	
	
		gl.uniform1f(thetaLoc, theta);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 45);
		
		
	
	}
	
function Scaling(){ 
	
	
		gl.uniform1f(scalingValue, scalevalue);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 45);
		
		
	
	}
	
	
	
	
	
window.onload= function init() { 

	const canvas= document.querySelector("#glcanvas");
	
	//initialize the gl context
	gl=canvas.getContext("webgl");
	
	//only continue if webgl is available and working
	if(!gl){
		alert("Unable to initialize webgl. Your browser or machine may not support it.");
		
		return ;
		
	}
	
	var program=initShaders(gl,"vertex-shader","fragment-shader"); //INITSHADERS FONU ÇAĞIRIP DÖNDÜRDÜM PROG U PROGRAM DEĞİŞKENİNE ATADIK
	
	gl.useProgram( program );
	
	
	thetaLoc = gl.getUniformLocation(program, "theta"); //theata isimli değişkene thetaLoc üzerinden erişim elde ettim.
	theta=0; //thetaya ilk değerini atadım. 0 açıyla döndürme =yerinde bırakma
	gl.uniform1f(thetaLoc, theta); //burdaki theta benim global olarak tanımladığım değer (jsdeki theta) , theta değerini thetaloc a gönderiyorum.
	
	scalingValue = gl.getUniformLocation(program, "scalevalue"); 
	scalevalue=1; 
	gl.uniform1f(scalingValue, scalevalue); 
	
	u_colorLocation=gl.getUniformLocation(program,"u_Color");
	u_Color=(0.5,0.5,0.5,0.5); //gri verdim
	gl.uniform4f(u_colorLocation, xs, ys,zs, 1.0); //opaklığı değiştirmek istemediğim için 1 verdim.
	
	transLoc = gl.getUniformLocation(program, "transvalueleftright"); 
	transvalueleftright=0; 
	gl.uniform1f(transLoc, transvalueleftright); 
	
	transLoc2 = gl.getUniformLocation(program, "transvalueupdown"); 
	transvalueupdown=0; 
	gl.uniform1f(transLoc2, transvalueupdown); 
	
	
	
	var coloring=document.getElementById("Colors");
	
	coloring.addEventListener("click", function() {
		switch (coloring.selectedIndex) {
			case 0:
				xs+=0.1;
				colorshape();		//red
				break;
				
			case 1:
				xs+=-0.1;
				colorshape();
				break;
			case 2: 
				ys+=0.1;
				colorshape();		//green
				break;
			case 3: 
				ys+=-0.1;
				colorshape();
				break;
				
			case 4:
				zs+=0.1;
				colorshape();			//blue
				break;
				
			case 5:
				zs+=-0.1;
				colorshape();
				break;
			
		}
	});
	
	
	var rotate = document.getElementById("Rotation");  //js dosyasındaki Rotation selectimi çektim (erişim elde ettim.)
	
	rotate.addEventListener("click", function() {  //her clickte benim fonksiyonum çalışacak
		switch (rotate.selectedIndex) {  //hangi indexe tıklandığına baktım
			case 0: //sağa dönme
				theta+=0.1;
				Rotation();
				break;
			case 1: //sola dönme
				theta+=-0.1;
				Rotation();
				break;
			
		}
	});
	
	var resize = document.getElementById("Resize");//js dosyasındaki Resize selectimi çektim (erişim elde ettim.)
	
	resize.addEventListener("click", function() {
		switch (resize.selectedIndex) {
			case 0: //büyüme
				scalevalue+=0.1;
				Scaling();
				break;
			case 1: //küçülme
				scalevalue+=-0.1;
				Scaling();
				break;
			
		}
	});
	
	
	window.addEventListener("keydown", function(event) {		//sağa sola hareket ettirme klavyeden
		switch (event.keyCode) {
			case 37: //sol ok tuşu
				transvalueleftright +=- 0.1;
				transs();
				break;
				
			case 39: //sağ ok tuşu
				transvalueleftright += 0.1;
				transs();
				break;
			
		}
	});
	
	
	window.addEventListener("keydown", function(event) {		//klavyeden yukarı aşağı hareket ettirme
		switch (event.keyCode) {
			case 38: //yukarı ok tuşu
				transvalueupdown += 0.1;
				transs2();
				break;
				
			case 40:	//aşağı ok tuşu
				transvalueupdown += -0.1;
				transs2();
				break;
			
		}
	});




	

	var vertices = [ vec2(-0.5, .6), 		//karenin koordinatlarını ekledim(döndürülecek olan kare)
					vec2(-0.4, .6),
					vec2(-0.5, 0), //1
					
					vec2(-0.4, .6), 
					vec2(-0.5, 0), 
					vec2(-0.4, 0), //2
					
					vec2(-0.4, 0), 
					vec2(-0.3, 0), 
					vec2(-0.4, .1), //3
					
					vec2(-0.4, 0.1), 
					vec2(-0.3, 0), 
					vec2(-0.2, 0.3), //4
					
					vec2(-0.2, 0.3), 
					vec2(-0.1, 0.25), 
					vec2(-0.3, 0),  //5
					
					vec2(-.2, .3), 
					vec2(-.1, 0.25), 
					vec2(-.1, .35),  //6
					
					vec2(-.2, .3), 
					vec2(-.1, .35), 
					vec2(-.3, .6),   //7
				
					vec2(-.2, .3), 
					vec2(-.3, .6), 
					vec2(-.4, .5),  //8
					
					vec2(-.4, .5), 
					vec2(-.3, .6), 
					vec2(-.4, .6),  //9  D HARFİ BİTTİ
					
					vec2(.1, .6),
					vec2(.2, .6),
					vec2(.1, .0), //1
					
					vec2(.2, .6),
					vec2(.1, .0),
					vec2(.2, .0), //2
					
					vec2(.2, .1),
					vec2(.2, .0),
					vec2(.5, .1), //3
					
					vec2(.2, .0),
					vec2(.5, .0),
					vec2(.5, .1), //4
					
					vec2(.5, .1),
					vec2(.4, .1),
					vec2(.5, .6), //5
					
					vec2(.4, .6),
					vec2(.5, .6),
					vec2(.4, .1)]; //6    U HARFİ BİTTTİ
					
					
				
				
	//sending data to gpu
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId ); //current buffer belirledim
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW ); 	//flatten'a (float32 tipine çeviren fonk) vertices'i yolluyorum. Benim vertices noktalarım 2 boyutlu
																			//o yüzden float32 tipine çevirmek istiyorum. (html dosyasındaki işlemleri yaptırabilmek için 
																			//float şeklinde göndermem gerekiyor.)
	// data bufferımla shader variable larını associate ettim				
	var vPosition = gl.getAttribLocation( program, "vPosition" );	//shaderdaki vpositiona erişim elde ediyoruz (vpositionı erişilebilir hale getirdik)		
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );   //vpositiona 2 float değer gööndericem diyorum, çünkü yukardaki her bir vec2 jsde 2 boyutlu vektörler,onları
	gl.enableVertexAttribArray( vPosition );						// float halinde göndermem gerekiyor (koordinat şeklinde)
	//son satırda vpositionı enable hale getirdik, current bufferla associate ettik.
	



	//arkaplanı beyaz yaptım
	gl.clearColor(1.0,1.0,1.0,1.0);
	
	
	render();
	
	
	
	}; //yukarıya window.onload dediğim için buraya ; ekliyorum, önceden yoktu.
	
	function render(){ 
	//render işlemlerini(yani ekrana görüntü getirme) tek bi fonk'da topladım. 
	//Böylece initialization kısmıyla render kısmını (3 kısımdan oluşuyodu ->initialization,geometric arrangements,rendering) ayırmış oldum.
		gl.clear(gl.COLOR_BUFFER_BIT); //canvası yukarda set edilen renge boyadım
		
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 45); //45 tane noktam var
		
	}
	
	
	


	

	

