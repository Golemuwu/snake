var sentido   = 1;
var direccion = 1;
var pausa     = 0;

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
            console.log("APS: " + buclePrincipal.aps + "/ FPS: " + buclePrincipal.fps);
            buclePrincipal.fps = 0;
            buclePrincipal.aps = 0;
            buclePrincipal.CPA=0;
        }
    },
    detener: function() {

    },
    actualizar: function(registroTemporal) {
        console.log(teclado.teclas[0]);

        if(teclado.teclas=="ArrowUp"){
            if(direccion!=1){
            direccion  =1;
            sentido    =1;
            };
            pausa      =0;
        };
        if(teclado.teclas=="ArrowDown"){
            if(direccion!=1){
            direccion  =1;
            sentido    =0;
            };
            pausa      =0;
        };
        if(teclado.teclas=="ArrowLeft"){
            if(direccion!=0){
            direccion  =0;
            sentido    =1;
            };
            pausa      =0;
        };
        if(teclado.teclas=="ArrowRight"){
            if(direccion!=0){
            direccion  =0;
            sentido    =0;
            };
            pausa      =0;
        };
        if(teclado.teclas=="p"){
            pausa      =1;
        };

        teclado.reiniciar();
        buclePrincipal.aps++;
        buclePrincipal.CPA++;
        if(buclePrincipal.CPA >= 20){
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


                if(Grilla[X+XDir][Y+YDir]==0){
                    Grilla[X+XDir][Y+YDir]=Puntos+1;

                    for(i=0; i<Grilla.length;i++ ){
                        for(j=0; j<Grilla[i].length;j++){
                            if(Grilla[i][j]>0){
                                Grilla[i][j]-=1;
                            };
                        };
                    };
                    pasoAlgo=1;
                    
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
                    pasoAlgo=1;
                };
            };

            if(pausa==1){pasoAlgo=1};

            if(pasoAlgo==0){
                console.log("No paso nadaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
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
            };
            //console.log(document.onkeydown);
            console.log("Holawa"+Grilla[X+XDir][Y]);
        };
        //step();
    },
    dibujar: function(registroTemporal) {
        buclePrincipal.fps++;
        stk = document.querySelector("canvas").getContext("2d");
        stk.fillStyle="black";
        stk.fillRect(0,0,escala*11,escala*12);


        for(i=0;i<NUMX;i++){
            for(j=0;j<NUMY;j++){


                if (Grilla[i][j]>0){
                stk.fillStyle="white";
                stk.fillRect(      2.5+(i)*295/17       ,           0.5+(j)*149/13 ,             0.9*295/17     ,            0.9*149/13     );
                };

                if (Grilla[i][j]<0){
                    stk.fillStyle="red";
                    stk.fillRect(      2.5+(i)*295/17       ,           0.5+(j)*149/13 ,             0.9*295/17     ,            0.9*149/13     );
                    };
            };
        };
        //stk.fillStyle="cyan";
        //stk.fillRect(2.5,0.5,295,149);
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
Puntos=PUNTINI;

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
