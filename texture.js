var canvas;
var gl;

var meshVertices = []; // To keep the vertices in the correct order for triangles   
var meshNormals = [];  //same for normals
var meshTexCoords = []; //same for textureCoordinates

var modelViewMatrix, projectionMatrix; //bunları initialize edip loclara aticam
var modelViewMatrixLoc, projectionMatrixLoc; //html dosyasıdan değer çekiyorum burada kullanabilmek için, bunlar üzerinden kullancam.

var ambientLight = vec4(0.2, 0.2, 0.2, 1.0); //ORTAM ışığının rengi
var lightlColor = vec4(1.0, 1.0, 1.0, 1.0); //ışık kaynağının rengi (diffuse ve spec için kullanıcaz) BEYAZ SEÇTİK IŞIK KAY RENGİNİ
var lightlDirection = vec4(-1.0, -1.0, -1.0, 0.0); //ışık kaynağının yönü
										//4.ye sıfır verdik çünkü bu bize vektör veriyor
//ambient diffuse and specular colors for the material (i.e., Ka,Kd,Ks)
var ambientColor = vec4(0.9, 0.0, 0.7, 1.0); //Ka		//YANİ OBJENİN  MATERYAL RENGİ VERİLMİŞ OLUYOR (YÜZEYİN YANSITMA ÖZELLİĞİ)
var diffuseColor = vec4(0.9,0.0,0.7,1.0);	//Kd
var specularColor = vec4(1.0,1.0,1.0,1.0); //Ks
var materialShininess = 1000.0;

var ambientProduct, diffuseProduct, specularProduct; //aşağıda hesaplicaz

// TEAPOT DATA  = BU DATALAR OBJ UZANTILI DOSYADAN ALINDI
//ASLINDA BU ARRAYLERİN HEPSİ TEK BOYUTLU ARRAYDİR.
var vertices = [ 
	7.0000,0.0000,12.0000,  //İNDİSİ 1 OLAN VERTİCE
	4.9700,-4.9700,12.0000, //İNDİSİ 2 OLAN VERTİCE
	4.9811,-4.9811,12.4922, 
	7.0156,0.0000,12.4922, 
	5.3250,-5.3250,12.0000, 
	7.5000,0.0000,12.0000, 
	0.0000,-7.0000,12.0000, 
	0.0000,-7.0156,12.4922, 
	0.0000,-7.5000,12.0000, 
	-5.1387,-4.9700,12.0000, 
	-5.0022,-4.9811,12.4922, 
	-5.3250,-5.3250,12.0000, 
	-7.0000,0.0000,12.0000, 
	-7.0156,0.0000,12.4922, 
	-7.5000,0.0000,12.0000, 
	-4.9700,4.9700,12.0000,
	-4.9811,4.9811,12.4922,
	-5.3250,5.3250,12.0000,
	0.0000,7.0000,12.0000,
	0.0000,7.0156,12.4922,
	0.0000,7.5000,12.0000,
	4.9700,4.9700,12.0000,
	4.9811,4.9811,12.4922,
	5.3250,5.3250,12.0000,
	6.5453,-6.5453,8.1094,
	9.2188,0.0000,8.1094,
	7.1000,-7.1000,4.5000,
	10.0000,0.0000,4.5000,
	0.0000,-9.2188,8.1094,
	0.0000,-10.0000,4.5000,
	-6.5453,-6.5453,8.1094,
	-7.1000,-7.1000,4.5000,
	-9.2188,0.0000,8.1094,
	-10.0000,0.0000,4.5000,
	-6.5453,6.5453,8.1094,
	-7.1000,7.1000,4.5000,
	0.0000,9.2188,8.1094,
	0.0000,10.0000,4.5000,
	6.5453,6.5453,8.1094,
	7.1000,7.1000,4.5000,
	6.2125,-6.2125,1.9219,
	8.7500,0.0000,1.9219,
	5.3250,-5.3250,0.7500,
	7.5000,0.0000,0.7500,
	0.0000,-8.7500,1.9219,
	0.0000,-7.5000,0.7500,
	-6.2125,-6.2125,1.9219,
	-5.3250,-5.3250,0.7500,
	-8.7500,0.0000,1.9219,
	-7.5000,0.0000,0.7500,
	-6.2125,6.2125,1.9219,
	-5.3250,5.3250,0.7500,
	0.0000,8.7500,1.9219,
	0.0000,7.5000,0.7500,
	6.2125,6.2125,1.9219,
	5.3250,5.3250,0.7500,
	4.5595,-4.5595,0.2344,
	6.4219,0.0000,0.2344,
	0.0000,0.0000,0.0000,
	0.0000,-6.4219,0.2344,
	-4.5595,-4.5595,0.2344,
	-6.4219,0.0000,0.2344,
	-4.5595,4.5595,0.2344,
	0.0000,6.4219,0.2344,
	4.5595,4.5595,0.2344,
	-8.0000,0.0000,10.1250,
	-7.7500,-1.1250,10.6875,
	-12.5938,-1.1250,10.4766,
	-12.0625,0.0000,9.9844,
	-14.2500,-1.1250,9.0000,
	-13.5000,0.0000,9.0000,
	-7.5000,0.0000,11.2500,
	-13.1250,0.0000,10.9688,
	-15.0000,0.0000,9.0000,
	-7.7500,1.1250,10.6875,
	-12.5938,1.1250,10.4766,
	-14.2500,1.1250,9.0000,
	-13.1719,-1.1250,6.2695,
	-12.6875,0.0000,6.7500,
	-9.7500,-1.1250,3.7500,
	-13.6563,0.0000,5.7891,
	-9.5000,0.0000,3.0000,
	-13.1719,1.1250,6.2695,
	-9.7500,1.1250,3.7500,
	8.5000,0.0000,7.1250,
	8.5000,-2.4750,5.0625,
	12.6875,-1.7062,8.1094,
	11.9375,0.0000,9.0000,
	15.0000,-0.9375,12.0000,
	13.5000,0.0000,12.0000,
	8.5000,0.0000,3.0000,
	13.4375,0.0000,7.2187,
	16.5000,0.0000,12.0000,
	8.5000,2.4750,5.0625,
	12.6875,1.7062,8.1094,
	15.0000,0.9375,12.0000,
	15.6328,-0.7500,12.3340,
	14.1250,0.0000,12.2813,
	15.0000,-0.5625,12.0000,
	14.0000,0.0000,12.0000,
	17.1406,0.0000,12.3867,
	16.0000,0.0000,12.0000,
	15.6328,0.7500,12.3340,
	15.0000,0.5625,12.0000,
	1.1552,-1.1552,14.9063,
	1.6250,0.0000,14.9063,
	0.0000,0.0000,15.7500,
	0.7100,-0.7100,13.5000,
	1.0000,0.0000,13.5000,
	0.0000,-1.6250,14.9063,
	0.0000,-1.0000,13.5000,
	-1.1552,-1.1552,14.9063,
	-0.7100,-0.7100,13.5000,
	-1.6250,0.0000,14.9063,
	-1.0000,0.0000,13.5000,
	-1.1552,1.1552,14.9063,
	-0.7100,0.7100,13.5000,
	0.0000,1.6250,14.9063,
	0.0000,1.0000,13.5000,
	1.1552,1.1552,14.9063,
	0.7100,0.7100,13.5000,
	2.9288,-2.9288,12.7500,
	4.1250,0.0000,12.7500,
	4.6150,-4.6150,12.0000,
	6.5000,0.0000,12.0000,
	0.0000,-4.1250,12.7500,
	0.0000,-6.5000,12.0000,
	-2.9288,-2.9288,12.7500,
	-4.6150,-4.6150,12.0000,
	-4.1250,0.0000,12.7500,
	-6.5000,0.0000,12.0000,
	-2.9288,2.9288,12.7500,
	-4.6150,4.6150,12.0000,
	0.0000,4.1250,12.7500,
	0.0000,6.5000,12.0000,
	2.9288,2.9288,12.7500,
	4.6150,4.6150,12.0000
]; 

//ilgili verticelere ait normaller tutuluyor (normal ve vertice sayısı eşit olmakzorunda değil
var normals = [ //ışık hesaplarında kullanıyoruz.
	-0.9995,0.0000,0.0317,
	-0.7067,0.7067,0.0319,
	-0.0966,0.0966,0.9906,
	-0.1416,0.0000,0.9899,
	0.5936,-0.5936,0.5435,
	0.8400,0.0000,0.5425,
	-0.0010,0.9996,0.0283,
	-0.0008,0.1421,0.9899,
	0.0000,-0.8400,0.5425,
	0.7268,0.6636,-0.1773,
	0.0816,0.2165,0.9729,
	-0.5949,-0.5971,0.5381,
	0.9994,-0.0148,0.0317,
	0.1496,-0.0134,0.9886,
	-0.8403,0.0004,0.5422,
	0.7067,-0.7067,0.0319,
	0.0966,-0.0966,0.9906,
	-0.5936,0.5936,0.5435,
	0.0000,-0.9995,0.0317,
	0.0000,-0.1416,0.9899,
	0.0000,0.8400,0.5425,
	-0.7067,-0.7067,0.0319,
	-0.0966,-0.0966,0.9906,
	0.5936,0.5936,0.5435,
	0.6738,-0.6738,0.3034,
	0.9532,0.0000,0.3025,
	0.7028,-0.7028,-0.1107,
	0.9939,0.0000,-0.1105,
	0.0000,-0.9532,0.3025,
	0.0000,-0.9939,-0.1105,
	-0.6738,-0.6738,0.3034,
	-0.7028,-0.7028,-0.1107,
	-0.9532,0.0000,0.3025,
	-0.9939,0.0000,-0.1105,
	-0.6738,0.6738,0.3034,
	-0.7028,0.7028,-0.1107,
	0.0000,0.9532,0.3025,
	0.0000,0.9939,-0.1105,
	0.6738,0.6738,0.3034,
	0.7028,0.7028,-0.1107,
	0.5792,-0.5792,-0.5735,
	0.8198,0.0000,-0.5726,
	0.4157,-0.4157,-0.8089,
	0.5888,0.0000,-0.8083,
	0.0000,-0.8198,-0.5726,
	0.0000,-0.5888,-0.8083,
	-0.5792,-0.5792,-0.5735,
	-0.4157,-0.4157,-0.8089,
	-0.8198,0.0000,-0.5726,
	-0.5888,0.0000,-0.8083,
	-0.5792,0.5792,-0.5735,
	-0.4157,0.4157,-0.8089,
	0.0000,0.8198,-0.5726,
	0.0000,0.5888,-0.8083,
	0.5792,0.5792,-0.5735,
	0.4157,0.4157,-0.8089,
	0.2016,-0.2016,-0.9585,
	0.2850,0.0000,-0.9585,
	0.0000,0.0000,-1.0000,
	0.0000,-0.2850,-0.9585,
	-0.2016,-0.2016,-0.9585,
	-0.2850,0.0000,-0.9585,
	-0.2016,0.2016,-0.9585,
	0.0000,0.2850,-0.9585,
	0.2016,0.2016,-0.9585,
	0.0384,0.0031,-0.9993,
	-0.0182,-0.9619,0.2727,
	-0.0190,-0.9786,0.2047,
	0.2817,0.0145,-0.9594,
	-0.2938,-0.9475,0.1264,
	0.9324,0.0422,-0.3590,
	-0.0473,-0.0015,0.9989,
	-0.4420,-0.0127,0.8969,
	-0.9859,-0.0106,0.1669,
	-0.0177,0.9631,0.2685,
	-0.0097,0.9839,0.1786,
	-0.2735,0.9565,0.1013,
	-0.1217,-0.9875,-0.0998,
	0.8176,0.0138,0.5756,
	-0.3352,-0.7946,-0.5061,
	//0.6216,0.0294,0.7828,
	-0.7747,-0.0079,-0.6322,
	-0.5711,-0.0076,-0.8208,
	-0.1055,0.9904,-0.0889,
	-0.3009,0.8200,-0.4869,
	-0.4862,0.0074,0.8738,
	0.3271,-0.9145,-0.2382,
	0.1595,-0.9869,0.0246,
	-0.6970,-0.0236,0.7167,
	-0.0062,-0.9245,0.3812,
	-0.7234,-0.0562,0.6881,
	0.6538,0.0025,-0.7567,
	0.7677,0.0173,-0.6406,
	0.6465,0.0447,-0.7616,
	0.3456,0.9087,-0.2343,
	0.1845,0.9828,0.0081,
	0.0506,0.9476,0.3154,
	0.2319,-0.5821,0.7793,
	0.0415,-0.0704,0.9967,
	0.3158,0.9477,-0.0454,
	0.9011,-0.0135,-0.4334,
	0.9533,0.0371,0.2997,
	-0.3219,0.0032,0.9468,
	0.3655,0.5783,0.7294,
	0.3394,-0.9333,-0.1174,
	0.6774,-0.6773,0.2871,
	0.9576,-0.0001,0.2882,
	0.0000,0.0000,1.0000,
	0.5955,-0.5952,0.5396,
	0.8436,-0.0002,0.5370,
	-0.0001,-0.9576,0.2882,
	-0.0002,-0.8436,0.5370,
	-0.6773,-0.6774,0.2871,
	-0.5952,-0.5955,0.5396,
	-0.9576,0.0001,0.2882,
	-0.8436,0.0002,0.5370,
	-0.6774,0.6773,0.2871,
	-0.5955,0.5952,0.5396,
	0.0001,0.9576,0.2882,
	0.0002,0.8436,0.5370,
	0.6773,0.6774,0.2871,
	0.5952,0.5955,0.5396,
	0.1942,-0.1942,0.9616,
	0.2754,0.0000,0.9613,
	0.2121,-0.2121,0.9539,
	0.3011,0.0000,0.9536,
	0.0000,-0.2754,0.9613,
	0.0000,-0.3011,0.9536,
	-0.1942,-0.1942,0.9616,
	-0.2121,-0.2121,0.9539,
	-0.2754,0.0000,0.9613,
	-0.3011,0.0000,0.9536,
	-0.1942,0.1942,0.9616,
	-0.2121,0.2121,0.9539,
	0.0000,0.2754,0.9613,
	0.0000,0.3011,0.9536,
	0.1942,0.1942,0.9616,
	0.2121,0.2121,0.9539
]; 

var textureCoords = [	//texture mapping te kullanıyoruz  (s,t,0) 2d olduğu için son koordinat 0
	2.00,2.00,
	1.50,2.00, 	//2d texture kullandığımız için son koordinatlar hep 0
	1.50,1.95,			//değerler 0-2 arasında değişiyo (0-min,2-max)
	2.00,1.95,
	1.50,1.90,
	2.00,1.90,
	1.00,2.00,
	1.00,1.95,
	1.00,1.90,
	0.50,2.00,
	0.50,1.95,
	0.50,1.90,
	0.00,2.00,
	0.00,1.95,
	0.00,1.90,
	1.50,1.45,
	2.00,1.45,
	1.50,1.00,
	2.00,1.00,
	1.00,1.45,
	1.00,1.00,
	0.50,1.45,
	0.50,1.00,
	0.00,1.45,
	0.00,1.00,
	1.50,0.70,
	2.00,0.70,
	1.50,0.40,
	2.00,0.40,
	1.00,0.70,
	1.00,0.40,
	0.50,0.70,
	0.50,0.40,
	0.00,0.70,
	0.00,0.40,
	1.50,0.20,
	2.00,0.20,
	1.50,0.00,
	1.00,0.20,
	1.00,0.00,
	0.50,0.20,
	0.50,0.00,
	0.00,0.20,
	0.00,0.00,
	0.75,1.00,
	0.75,0.75,
	1.00,0.75,
	0.75,0.50,
	1.00,0.50,
	0.50,0.75,
	0.50,0.50,
	0.25,1.00,
	0.25,0.75,
	0.25,0.50,
	0.00,0.75,
	0.00,0.50,
	0.75,0.25,
	1.00,0.25,
	0.75,0.00,
	0.50,0.25,
	0.25,0.25,
	0.25,0.00,
	0.00,0.25,
	0.75,0.45,
	0.50,0.45,
	0.75,0.90,
	0.50,0.90,
	1.00,0.45,
	1.00,0.90,
	0.25,0.45,
	0.00,0.45,
	0.25,0.90,
	0.00,0.90,
	0.75,0.95,
	0.50,0.95,
	1.00,0.95,
	0.25,0.95,
	0.00,0.95
];

var quads = [ //4 boyutlu face elementleri bulunuyor, 4genleri tanımlayan face elementleri (yani quadratic=4gensel) (vertice,texture coordinate,normal vek)
// indices for vertex1, textureCoord of vertex1, normal of vertex1, vertex2, ...
// each index starts from 1, we will probably need to subtract 1 from each
	1,1,1,2,2,2,3,3,3,4,4,4,
	4,4,4,3,3,3,5,5,5,6,6,6,
	2,2,2,7,7,7,8,8,8,3,3,3,		//3ERLİ GRUPTAN TOPLAM 12 ELEMAN VAR (4 KÖŞE OLD İÇİN)
	3,3,3,8,8,8,9,9,9,5,5,5,
	7,7,7,10,10,10,11,11,11,8,8,8,
	8,8,8,11,11,11,12,12,12,9,9,9,
	10,10,10,13,13,13,14,14,14,11,11,11,
	11,11,11,14,14,14,15,15,15,12,12,12,
	13,1,13,16,2,16,17,3,17,14,4,14,
	14,4,14,17,3,17,18,5,18,15,6,15,
	16,2,16,19,7,19,20,8,20,17,3,17,
	17,3,17,20,8,20,21,9,21,18,5,18,
	19,7,19,22,10,22,23,11,23,20,8,20,
	20,8,20,23,11,23,24,12,24,21,9,21,
	22,10,22,1,13,1,4,14,4,23,11,23,
	23,11,23,4,14,4,6,15,6,24,12,24,
	6,6,6,5,5,5,25,16,25,26,17,26,
	26,17,26,25,16,25,27,18,27,28,19,28,
	5,5,5,9,9,9,29,20,29,25,16,25,
	25,16,25,29,20,29,30,21,30,27,18,27,
	9,9,9,12,12,12,31,22,31,29,20,29,
	29,20,29,31,22,31,32,23,32,30,21,30,
	12,12,12,15,15,15,33,24,33,31,22,31,
	31,22,31,33,24,33,34,25,34,32,23,32,
	15,6,15,18,5,18,35,16,35,33,17,33,
	33,17,33,35,16,35,36,18,36,34,19,34,
	18,5,18,21,9,21,37,20,37,35,16,35,
	35,16,35,37,20,37,38,21,38,36,18,36,
	21,9,21,24,12,24,39,22,39,37,20,37,
	37,20,37,39,22,39,40,23,40,38,21,38,
	24,12,24,6,15,6,26,24,26,39,22,39,
	39,22,39,26,24,26,28,25,28,40,23,40,
	28,19,28,27,18,27,41,26,41,42,27,42,
	42,27,42,41,26,41,43,28,43,44,29,44,
	27,18,27,30,21,30,45,30,45,41,26,41,
	41,26,41,45,30,45,46,31,46,43,28,43,
	30,21,30,32,23,32,47,32,47,45,30,45,
	45,30,45,47,32,47,48,33,48,46,31,46,
	32,23,32,34,25,34,49,34,49,47,32,47,
	47,32,47,49,34,49,50,35,50,48,33,48,
	34,19,34,36,18,36,51,26,51,49,27,49,
	49,27,49,51,26,51,52,28,52,50,29,50,
	36,18,36,38,21,38,53,30,53,51,26,51,
	51,26,51,53,30,53,54,31,54,52,28,52,
	38,21,38,40,23,40,55,32,55,53,30,53,
	53,30,53,55,32,55,56,33,56,54,31,54,
	40,23,40,28,25,28,42,34,42,55,32,55,
	55,32,55,42,34,42,44,35,44,56,33,56,
	44,29,44,43,28,43,57,36,57,58,37,58,
	43,28,43,46,31,46,60,39,60,57,36,57,
	46,31,46,48,33,48,61,41,61,60,39,60,
	48,33,48,50,35,50,62,43,62,61,41,61,
	50,29,50,52,28,52,63,36,63,62,37,62,
	52,28,52,54,31,54,64,39,64,63,36,63,
	54,31,54,56,33,56,65,41,65,64,39,64,
	56,33,56,44,35,44,58,43,58,65,41,65,
	66,21,66,67,45,67,68,46,68,69,47,69,
	69,47,69,68,46,68,70,48,70,71,49,71,
	67,45,67,72,23,72,73,50,73,68,46,68,
	68,46,68,73,50,73,74,51,74,70,48,70,
	72,23,72,75,52,75,76,53,76,73,50,73,
	73,50,73,76,53,76,77,54,77,74,51,74,
	75,52,75,66,25,66,69,55,69,76,53,76,
	76,53,76,69,55,69,71,56,71,77,54,77,
	71,49,71,70,48,70,78,57,78,79,58,79,
	79,58,79,78,57,78,80,59,80,34,40,81,
	70,48,70,74,51,74,81,60,82,78,57,78,
	78,57,78,81,60,82,82,42,83,80,59,80,
	74,51,74,77,54,77,83,61,84,81,60,82,
	81,60,82,83,61,84,84,62,85,82,42,83,
	77,54,77,71,56,71,79,63,79,83,61,84,
	83,61,84,79,63,79,34,44,81,84,62,85,
	85,42,86,86,59,87,87,64,88,88,65,89,
	88,65,89,87,64,88,89,66,90,90,67,91,
	86,59,87,91,40,92,92,68,93,87,64,88,
	87,64,88,92,68,93,93,69,94,89,66,90,
	91,44,92,94,62,95,95,70,96,92,71,93,
	92,71,93,95,70,96,96,72,97,93,73,94,
	94,62,95,85,42,86,88,65,89,95,70,96,
	95,70,96,88,65,89,90,67,91,96,72,97,
	90,67,91,89,66,90,97,74,98,98,75,99,
	98,75,99,97,74,98,99,45,100,100,23,101,
	89,66,90,93,69,94,101,76,102,97,74,98,
	97,74,98,101,76,102,102,21,103,99,45,100,
	93,73,94,96,72,97,103,77,104,101,78,102,
	101,78,102,103,77,104,104,52,105,102,25,103,
	96,72,97,90,67,91,98,75,99,103,77,104,
	103,77,104,98,75,99,100,23,101,104,52,105,
	106,49,107,105,48,106,108,59,109,109,40,110,
	105,48,106,110,51,111,111,42,112,108,59,109,
	110,51,111,112,54,113,113,62,114,111,42,112,
	112,54,113,114,56,115,115,44,116,113,62,114,
	114,49,115,116,48,117,117,59,118,115,40,116,
	116,48,117,118,51,119,119,42,120,117,59,118,
	118,51,119,120,54,121,121,62,122,119,42,120,
	120,54,121,106,56,107,109,44,110,121,62,122,
	109,21,110,108,45,109,122,48,123,123,49,124,
	123,49,124,122,48,123,124,59,125,125,40,126,
	108,45,109,111,23,112,126,51,127,122,48,123,
	122,48,123,126,51,127,127,42,128,124,59,125,
	111,23,112,113,52,114,128,54,129,126,51,127,
	126,51,127,128,54,129,129,62,130,127,42,128,
	113,52,114,115,25,116,130,56,131,128,54,129,
	128,54,129,130,56,131,131,44,132,129,62,130,
	115,21,116,117,45,118,132,48,133,130,49,131,
	130,49,131,132,48,133,133,59,134,131,40,132,
	117,45,118,119,23,120,134,51,135,132,48,133,
	132,48,133,134,51,135,135,42,136,133,59,134,
	119,23,120,121,52,122,136,54,137,134,51,135,
	134,51,135,136,54,137,137,62,138,135,42,136,
	121,52,122,109,25,110,123,56,124,136,54,137,
	136,54,137,123,56,124,125,44,126,137,62,138
];

var triangles = [ //3 boyutlu, 3genleri tanımlayan face elementleri(3gensel)
// indices for vertex1, textureCoord of vertex1, normal of vertex1, vertex2, ...
// each index starts from 1, we will probably need to subtract 1 from each
	58,37,58,57,36,57,59,38,59,
	61,41,61,62,43,62,59,44,59,
	57,36,57,60,39,60,59,40,59,
	60,39,60,61,41,61,59,42,59,		//3ERLİ ELEMANDAN TOPLAM 3 GRUP VAR(3 KÖŞE OLD İÇİN)
	62,37,62,63,36,63,59,38,59,
	63,36,63,64,39,64,59,40,59,
	64,39,64,65,41,65,59,42,59,
	65,41,65,58,43,58,59,44,59,
	105,48,106,106,49,107,107,21,108,
	110,51,111,105,48,106,107,45,108,
	112,54,113,110,51,111,107,23,108,
	114,56,115,112,54,113,107,52,108,
	116,48,117,114,49,115,107,21,108,
	118,51,119,116,48,117,107,45,108,
	120,54,121,118,51,119,107,23,108,
	106,56,107,120,54,121,107,52,108
];

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 ); //ARKAPLAN RENGİ TANIMLANIYO (beyaz yaptım)
	
	gl.enable(gl.DEPTH_TEST);
	
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	
	
	
	prepareTeapot(); //indices arrayine çizdireceğimiz üçgen indislerini ekliyoruz.
	
	//ASLINDA PROG ÇALIŞMASINDA KULLANILACAK ARRAYLERİMİN BUFFERINI CREATE ETTİM (O DEĞERLERİ KULLANCAM VE KULLANABİLMEM İÇİN GPU'YA GÖNDERMEM GEREKİYOR.
	//normal bufferı oluşturuyoruz. YANİ NORMALLERİMİ GPU'DA BU BUFFERDA TUTUYORUM.
	var nBuffer = gl.createBuffer();	//IŞIK HESAPLAMASINDA KULLANACAĞIM NORMALLERİ
	gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(meshNormals), gl.STATIC_DRAW); //float32array= float (32 bitini ifade ediyor ama önemsiz)
	
	var vNormal = gl.getAttribLocation( program, "vNormal"); //vertex shaderda kullanılan vNormal ile bağlantı kuruyoruz.
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0); //3ER FLOAT DEĞER GÖNDERİYORUZ(YANİ NORMAL KOORDİNATLARI)
    gl.enableVertexAttribArray( vNormal);
	
	
	
	var vBuffer = gl.createBuffer();	//vertice için buffer yaratıyoruz.
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(meshVertices), gl.STATIC_DRAW); //vertices array'i GPU ya gönderiliyor.

    var vPosition = gl.getAttribLocation( program, "vPosition"); //vertex shaderda kullanılan vposition ile bağlantı kuruyoruz.
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0); //3er float değer gönderiyoruz. (yani vertex koordları gönderiyprum
    gl.enableVertexAttribArray( vPosition);
	
	
	//vertex shader'a göndereceğimiz(attr olarak tanımlanan her değer için buffer oluşturuyoruz.
	
	var tBuffer = gl.createBuffer();	//vertice için buffer yaratıyoruz.
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(meshTexCoords), gl.STATIC_DRAW); //vertices array'i GPU ya gönderiliyor.

    var vTexCoords = gl.getAttribLocation( program, "vTexCoords"); //vertex shaderda kullanılan vposition ile bağlantı kuruyoruz.
    gl.vertexAttribPointer( vTexCoords, 2, gl.FLOAT, false, 0, 0); //3er float değer gönderiyoruz. (yani vertex koordları gönderiyprum
    gl.enableVertexAttribArray( vTexCoords);
	
	var texSize = 64; //128
	var numRows = 8;
	var numCols = 8;

	var myTexels = new Uint8Array(4*texSize*texSize);
	
	for(var i=0; i < texSize ; ++i){
		
		for(var j=0; j < texSize; ++j){
			
			var patchx = Math.floor(i/(texSize/numRows));
			var patchy = Math.floor(j/(texSize/numCols));
			
			var c = (patchx%2 !== patchy%2 ? 255 : 0); //255=white,0=black
			
			myTexels[4*i*texSize + 4*j] = c;
			myTexels[4*i*texSize + 4*j +1] = c;
			myTexels[4*i*texSize + 4*j +2] = c;
			myTexels[4*i*texSize + 4*j +3] = 255;
		}
		
	}
	
	//create a texture object and make it the current texture
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	
	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,texSize,texSize,0,gl.RGBA,gl.UNSIGNED_BYTE, myTexels);
	gl.generateMipmap(gl.TEXTURE_2D); //this was necessary to fix the format error (bunu yazmazsan error alırsın)
	
	gl.uniform1i(gl.getUniformLocation(program, "texMap"), 0); //def olarak 0 gönderiyoruz
	
	
	//MODELVİEW MATRİSİ -90LA İNİTİALİZE ETTİK, YANİ KAMERA BAŞLANGIÇTA -90 DAN BAKIYOR
	modelViewMatrix = rotateX(-90);	//YUKARDA TANIMLAMIŞTIK İNİTİALİZE ETTİK. //kamera bakış açısını tutuyo (kamera hareketlerini tutuyo olarak düşünebiliriz
	projectionMatrix = ortho(-20.0, 20.0, -20.0, 20.0, -20.0, 20.0); //vertices arrayimdeki değerlere bakarsan -20 20 arasında değerler vermişiz. 
		//GÖRÜNTÜLEME KÜBÜ HACMİNİ OLUŞTURDUK						//ortho yu silip mat4(); yazarsak def olarak -1 1 arasındaki verticeleri gösterecektir.
		//4X4LÜK DÖNÜŞÜM MATRİSİ VERDİ BİZE							//ortho aslında projection view u verir bize görüntüleme kübünü veriyor.
	
	modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );	//SHADER VERTEXTE TANIMLADIKLARIMIZI DOSYADAN ÇEKTİK VE BURADAKİ DEĞİŞKENE ATADIK (KULLANABİLMEK İÇİN)
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix));	//modelViewMatrix teki değeri vertex shader a gönderiyorum (modelViewMatrixLoc'a)
	gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix));
	
    document.getElementById("XButton").onclick = function(){ //KAMERA X YÖNÜNDE ROTATE
		modelViewMatrix = mult(rotateX(5), modelViewMatrix); //ASLINDA BEN CİSMİ DEĞİL KAMERAYI ROTATE EDİYORUM.
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix));
		render();
	};
    document.getElementById("YButton").onclick = function(){//KAMERA Y YÖNÜNDE ROTATE
		modelViewMatrix = mult(rotateY(5), modelViewMatrix);
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix));
		render();
	};
    document.getElementById("ZButton").onclick = function(){ //KAMERA Z YÖNÜNDE ROTATE
		modelViewMatrix = mult(rotateZ(5), modelViewMatrix);
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix));
		render();
	};
	
	//calculting components for light calculations
	ambientProduct = mult(ambientLight, ambientColor); //Ka.Ia
	diffuseProduct = mult( lightlColor, diffuseColor); //Kd.I1
	specularProduct = mult(lightlColor, specularColor);	//Ks.I1
	
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
	flatten(ambientProduct));
	
	gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
	flatten(diffuseProduct));
	
	gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
	flatten(specularProduct));
	
	gl.uniform4fv(gl.getUniformLocation(program, "lightDirection"),
	flatten(lightlDirection));
	
	gl.uniform1f(gl.getUniformLocation(program, "shininess"),materialShininess);
	
	
	render();
};

// This function goes over the given teapot data and 
// does the necessary index organization tasks.
// The main task is to convert the given indices for polygons (quads and triangles)
// into meshVertices,meshNormals,meshTexCoords
function prepareTeapot() {
	for (var i = 0; i < quads.length; i+=12) { //satır satır atlamak için i+12 yapıyoruz
		//first triangle
		addTriangleVertexForIndices(quads[i]-1, quads[i+1]-1, quads[i+2]-1); //çizdireceğim ilk üçgenin indislerini aldım
		addTriangleVertexForIndices(quads[i+3]-1, quads[i+4]-1, quads[i+5]-1); 		//çizdireceğim 2.üçgenin indislerini aldım
		addTriangleVertexForIndices(quads[i+6]-1, quads[i+7]-1, quads[i+8]-1);
		//second triangle
		addTriangleVertexForIndices(quads[i]-1, quads[i+1]-1, quads[i+2]-1);
		addTriangleVertexForIndices(quads[i+6]-1, quads[i+7]-1, quads[i+8]-1);
		addTriangleVertexForIndices(quads[i+9]-1, quads[i+10]-1, quads[i+11]-1);
	}
	for (var i = 0; i < triangles.length; i+=9) { //1 satırda 9 eleman olduğu için i+9 yazdık (satır atlamak için)
		addTriangleVertexForIndices(triangles[i]-1, triangles[i+1]-1, triangles[i+2]-1); //çizdireceğim üçgenlerin indisini aldım.
		addTriangleVertexForIndices(triangles[i+3]-1, triangles[i+4]-1, triangles[i+5]-1); 
		addTriangleVertexForIndices(triangles[i+6]-1, triangles[i+7]-1, triangles[i+8]-1); 
	}
}

//adds coordinates to meshVertices, texture coordinates to meshTexCoords,
//and normal components to meshNormals for given indices (indices start at 0)
function addTriangleVertexForIndices(vIndex, tIndex, nIndex){
	//add x,y,z coordinates
	meshVertices.push( vertices[3*vIndex], vertices[3*vIndex+1],vertices[3*vIndex+2]);
	//add s,t texture Coordinates
	meshTexCoords.push(textureCoords[2*tIndex],textureCoords[2*tIndex+1]);
	//add x,y,z components of normal
	meshNormals.push(normals[3*nIndex],normals[3*nIndex+1],normals[3*nIndex+2]);
}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawArrays( gl.TRIANGLES, 0, ((meshVertices.length)/3) ); //wireframe yapısını görebilmek için line loop la çalıştırdık
}