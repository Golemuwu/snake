var sentido            =     1;
var direccion          =     1;
var pausa              =     0;
var ultimaDrieccion    =     1;
var Velocity           =    15;
var color              =     0;
var MaxPuntos          =     3;
var Sonidos            = [261,277,293,311,329,349,369,392,415,440,466,493];
var context = new (window.AudioContext || window.webkitAudioContext)();
var mute               =     1;

function Sonido(nota,time){
    //creamos oscilador
   var osc = context.createOscillator();

   // admite: sine, square, sawtooth, triangle
   osc.type = 'sine'; 

   osc.frequency.value=Sonidos[nota];

   //asignamos el destino para el sonido
   osc.connect(context.destination);
   //iniciamos la nota
   osc.start();
   //detenemos la nota medio segundo despues
   osc.stop(context.currentTime + mute * !(pausa) * time/ Sonidos[nota]);

};

var html2 = document.getElementById("Score").innerHTML;


var teclawa=2;

var teclado={
    teclas: new Array,
    iniciar: function(){
        document.onkeydown=teclado.guardarTecla;
    },
    guardarTecla: function(e){
        teclado.teclas.push(e.key);
        //console.log(e.key);
    },
    teclaPulsada: function(codigoTecla){
        return (teclado.teclas.indexOf(codigoTecla) !== -1) ? true : false;
    },
    reiniciar: function(){
        teclado.teclas = new Array;
    }
}

teclado.iniciar();



//------------------------
function screenfun(tilesX,tilesY, crear){
    var dimensiones = {
        ancho: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        alto: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
        };
    
    if ( dimensiones.ancho/tilesX < dimensiones.alto/tilesY) {
            escala= dimensiones.ancho/tilesX;
    } else {
            escala= dimensiones.alto/tilesY;
    };

    

    if(crear == 1){
    var html = document.getElementById("juego").innerHTML;
    var div= "<canvas id= screen></canvas>";
    document.getElementById("juego").innerHTML = html + div;
    };
    

    var margenGrosor = 1;

    document.getElementById("screen").style.width  = (Math.floor(escala * tilesX * 0.9)+ "px");
    document.getElementById("screen").style.height = (Math.floor(escala* tilesY * 0.9)+ "px");
    document.getElementById("screen").style.border = margenGrosor + "px solid #000000";
    //console.log(dimensiones.alto);                                     console.log
    //-----------------Centrar
    document.getElementById("juego").style.position = "absolute";
    document.getElementById("juego").style.left = Math.floor((dimensiones.ancho - (escala * tilesX) * 0.9)* 0.5) - margenGrosor+ "px" ;//aca va lo de sumarle pixeles
    document.getElementById("juego").style.top  = Math.floor((dimensiones.alto  - (escala * tilesY) * 0.9)* 0.5) - margenGrosor+ "px" ;//aca va lo de sumarle pixeles
    //----------------/Centrar

};
    //----------------/Matriz con las tiles

   

/////// Lo de bucle principal viste? me parece obvio
var buclePrincipal = {
    idEjecucion: null,
    ultimoRegistro: 0,
    aps: 0,
    fps: 0,
    CPA: 0,
    iterar: function(registroTemporal) {
        buclePrincipal.idEjecucion = window.requestAnimationFrame(buclePrincipal.iterar);

        buclePrincipal.actualizar(registroTemporal);
        buclePrincipal.dibujar();
        screenfun(16,12,0);

        if(registroTemporal - buclePrincipal.ultimoRegistro > 999) {
            buclePrincipal.ultimoRegistro = registroTemporal;
            //console.log("APS: " + buclePrincipal.aps + "/ FPS: " + buclePrincipal.fps);
            buclePrincipal.fps = 0;
            buclePrincipal.aps = 0;
            buclePrincipal.CPA=0;
        }
    },
    detener: function() {

    },
    actualizar: function(registroTemporal) {
        //console.log(teclado.teclas[0]);

        var arriba   =  ( teclado.teclas=="ArrowUp"||teclado.teclas=="w");
        var abajo    =  (teclado.teclas=="ArrowDown"||teclado.teclas=="s");
        var izquierda =  (teclado.teclas=="ArrowLeft"||teclado.teclas=="a");
        var derecha  =  (teclado.teclas=="ArrowRight"||teclado.teclas=="d");

        direccion = direccion + ((arriba||abajo) && ultimaDrieccion!=1) * (1-direccion)+ ((izquierda||derecha) && ultimaDrieccion!=0) * (0-direccion);
        sentido   = sentido   + ((arriba && ultimaDrieccion!=1) || (izquierda && ultimaDrieccion!=0)) * (1-sentido) + ((abajo && ultimaDrieccion!=1) || (derecha && ultimaDrieccion!=0)) * (0-sentido);

        Sonido(3,20* (teclado.teclas=="p"));
        pausa = pausa + (teclado.teclas=="p") * (1-pausa) + (arriba || abajo || izquierda || derecha)* (0-pausa);

        color = color + (teclado.teclas=="W") * (0-color) + (teclado.teclas=="R") * (1-color) + (teclado.teclas=="G") * (2-color) + (teclado.teclas=="B") * (3-color) + (teclado.teclas=="C") * (4-color) + (teclado.teclas=="Y") * (5-color) + (teclado.teclas=="S") * (6-color);

        //if(mute==0 && teclado.teclas=="m"){mute=1};
        //if(mute==1 && teclado.teclas=="m"){mute=0};

        mute= mute + (mute==0 && teclado.teclas=="m") * (1-mute) + (mute==1 && teclado.teclas=="m") * (0-mute);

        //if(mute==0){
        //Sonido(3,20* (teclado.teclas=="p"));
        //}

        teclado.reiniciar();
        buclePrincipal.aps++;
        buclePrincipal.CPA++;
        if(buclePrincipal.CPA >= Velocity+50*pausa){
            buclePrincipal.CPA=0;

            var X=0;
            var Y=0;
            var XDir=(-direccion+1)*(1-2*sentido);
            var YDir=direccion*(1-2*sentido);
            var pasoAlgo=0;
            var hability=0;


            //Busco Cabeza
            for(i=0; i<Grilla.length;i++ ){
                for(j=0; j<Grilla[i].length;j++){
                    if(Grilla[i][j]==Puntos){
                        X=i;
                        Y=j;
                    };
                };
            };

            if(X+XDir < Grilla.length && 0 <= X+XDir){
                hability=1;
            };
            
            

            if (hability==1 && pausa==0){
            //Si esta vacio en frente


                if(Grilla[X+XDir][Y+YDir]== 0||Grilla[X+XDir][Y+YDir]== 1){
                    Grilla[X+XDir][Y+YDir]=Puntos+1;

                    for(i=0; i<Grilla.length;i++ ){
                        for(j=0; j<Grilla[i].length;j++){
                            Grilla[i][j]= (Grilla[i][j]-1) * (Grilla[i][j]>0) +(Grilla[i][j]<=0) * Grilla[i][j] ;
                        };
                    };
                    pasoAlgo=1;
                    ultimaDrieccion=direccion;
                };

                


                //Si hay fruta en frente
                if(Grilla[X+XDir][Y+YDir]==-1){
                    Grilla[X+XDir][Y+YDir]=Puntos+1;
                    Puntos+=1;

                    var CantidadDeHuecos=0;

                    //Cuento la cantidad de ceros y genero un numero aleatorio entre ellos para hacer una manzana
                    for(i=0;i<Grilla.length;i++){
                        for(j=0;j<Grilla[i].length;j++){
                            if(Grilla[i][j]==0){
                                CantidadDeHuecos++;
                            };
                        };
                    };
                    var Number = Math.floor(Math.random()*(CantidadDeHuecos)+1);

                    CantidadDeHuecos=0;

                    for(i=0;i<Grilla.length;i++){
                        for(j=0;j<Grilla[i].length;j++){
                            if(Grilla[i][j]==0){
                                CantidadDeHuecos++;
                                if(CantidadDeHuecos==Number){
                                    Grilla[i][j]=-1;
                                }
                            };
                        };
                    };

                    /*for(i=0;i<Grilla.length;i++){
                        for(j=0;j<Grilla[i].length;j++){
                            if(Grilla[i][j]==0);{
                                Number--;
                                if(Number==0){
                                    Grilla[i][j]=-1;
                                }*/
                                //if(Number==0){
                                //    Grilla[i][j]=-1;
                                //    Number=-1;
                                //}
                                //Number--;
                            //}
                    // }
                    //}
                    MaxPuntos= (Puntos) * (Puntos >= MaxPuntos)+ (Puntos<MaxPuntos)* MaxPuntos;
                    pasoAlgo=1;
                    ultimaDrieccion=direccion;
                    Sonido(6,20);
                };
            };

            if(pausa==1){pasoAlgo=1};

            if(pasoAlgo==0){
                //console.log("No paso nadaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
                for(i=0;i<Grilla.length;i++){
                    for(j=0;j<Grilla[i].length;j++){
                        Grilla[i][j]=0;
                        Puntos=PUNTINI;
                        Grilla[POSX][POSY]=PUNTINI;
                        sentido=1;
                        direccion=1;
                        Grilla[4][POSY]=-1
                    };
                };
                Sonido(0,40);
            };
            //console.log(document.onkeydown);
            //console.log("Holawa"+Grilla[X+XDir][Y]);
        };
        //step();
    },
    dibujar: function(registroTemporal) {
        buclePrincipal.fps++;
        stk = document.querySelector("canvas").getContext("2d");
        stk.fillStyle="black";
        stk.fillRect(0,0,escala*11,escala*12);

        var div2 = "<h1><font face="+ '"Arial"'+ ">Score: "+ (Puntos-3).toString()+"</h1>";
        document.getElementById("Score").innerHTML = div2;

        


        for(i=0;i<NUMX;i++){
            for(j=0;j<NUMY;j++){
                


                if (Grilla[i][j]>0){
                stk.fillStyle="white";
                if(color!=0){
                var puntosLocales = Grilla[i][j];
                //if (puntosLocales==Puntos){puntosLocales--};
                puntosLocales = puntosLocales- (puntosLocales==Puntos);
                var colorLocal  = Math.floor(puntosLocales*5*17/(Puntos-1))  * (puntosLocales/Puntos>2/7) + (puntosLocales/Puntos<=2/7 && puntosLocales != 1) * Math.floor(15 * (puntosLocales-1)/(2/7*Puntos-1)+20);
                colorLocal = colorLocal * (puntosLocales != 1)+ 16 * (puntosLocales==1);
                };
                //if(puntosLocales/Puntos<=2/7){colorLocal=20};

                var R,G,B;

                R= colorLocal + 170 * (color==1 || color==5 || color ==6);
                G= colorLocal + 170 * (color==2 || color==5 || color ==4);
                B= colorLocal + 170 * (color==3 || color==4 || color ==6);

                stk.fillStyle="#"+ R.toString(16,2)+G.toString(16,2)+B.toString(16,2);


                stk.fillRect(      2.5+(i)*295/17       ,           0.5+(j)*149/13 ,             0.9*295/17     ,            0.9*149/13     );
                };

                if (Grilla[i][j]<0){
                    stk.fillStyle="red";
                    stk.fillRect(      2.5+(i)*295/17       ,           0.5+(j)*149/13 ,             0.9*295/17     ,            0.9*149/13     );
                    };
            };
        };
        stk.fillStyle="cyan";
        //stk.fillRect(2.5,0.5,295,149);
        //stk.fillRect(0,0,300,150);
        if(pausa==1){
            stk.fillRect(75,37.5,150,75);
            stk.fillStyle="black";
            stk.fillText("Pause",130,50);
            stk.fillText("Score: "+( Puntos-3),80,60);
            stk.fillText("MaxScore: "+( MaxPuntos-3),80,70);
            stk.fillText("Color: Shift + W/R/G/B/S/C/Y",80,80);
            var muted="on";
            if(mute==1){muted="off"}
            stk.fillText("Mute("+ muted + "): M"  ,80,90);
        };
    },
}


screenfun(16,12,1);

//---------------------------------------------FRONTERAAAAAAAA

const NUMX=17;
const NUMY=13;

stk = document.querySelector("canvas").getContext("2d");
stk.fillStyle="black";
stk.fillRect(0,0,escala*11,escala*12);

Grilla = [];



const POSX=16;
const POSY=12;

const PUNTINI=3;
var Puntos=PUNTINI;

for(i = 0; i<NUMX; i++){
    var owo = [];
    for(j=0;j<NUMY;j++){
        owo.push(0);
    };
    Grilla.push(owo);
};

Grilla[POSX][POSY] = PUNTINI;
Grilla[4][POSY] = -1;

console.log(Grilla);

var InitialGrilla = Grilla;

buclePrincipal.iterar();
