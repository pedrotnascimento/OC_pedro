var TEST = true; // set to true for testing
var pilots = {}; //dicionário de pilotos
var ordemChegada = [];
TAM_CORRIDA = 4; //quantidade de voltas
var fimCorrida = false; //flag de fim corrida
var primeiraInstancia;//assim evita futura ordenação
var PilotPack = require('./Pilot.js');
var Pilot = PilotPack.Pilot;
var pilotSort = PilotPack.pilotSort;
var toSeconds = PilotPack.toSeconds;
var toTime =    PilotPack.toTime;
var myTrunc =   PilotPack.myTrunc;

function main(arg){
   
    var path;
    if(typeof arg!="undefined")
        path = arg.path;
    else
        path = "problem.csv";
    
    // console.log(path);
    var ctj = require("csvtojson");
    ctj({delimiter:"\t"}).
    fromFile(path).
    on('json', (jsonObj) =>{
        
        var pilotIndex = jsonObj["Piloto"]; 
        if(pilotIndex in pilots){//true: atualiza piloto
            pilots[pilotIndex].updatePilot(jsonObj);
            if(pilots[pilotIndex]["Hora"].length==TAM_CORRIDA && (!fimCorrida)){//true:acabou a corrida
                fimCorrida = true;
                //obtem pilotos e ordena
                // console.log(pilots[pilotIndex]);
                var temp_pilots =[]
                for(var i in pilots){
                    temp_pilots.push(pilots[i]);
                }
                temp_pilots = pilotSort(temp_pilots);
                for(var i in temp_pilots)
                    ordemChegada.push(temp_pilots[i]);
            }
        }else{//adiciona novo piloto
            pilots[pilotIndex] = Pilot(jsonObj);
            if(!primeiraInstancia){//logo obtem o primeiraInstancia, necessário varias vezes para o problema{
                primeiraInstancia = pilots[pilotIndex];
                
            }
            if(fimCorrida)// obtem o piloto não tenha cumprido uma volta antes de terminar a corrida
                ordemChegada.push(pilots[pilotIndex]);
        }
        
    }).on("done", (error) => {
                
        calcMelhoresVoltas();
        velocidadeMediaTotal();
        tempoDeChegadaDepoisDoFim();
        
        if(!TEST)
            mostraReport();

    });
    
}

        
function calcTempoTotal(){
    var tempoInicio = primeiraInstancia["HoraNum"][0]-primeiraInstancia["Tempo VoltaNum"][0];
    var temposFim = [];
    for(var i in pilots){
        len = pilots[i]["HoraNum"].length;
        temposFim.push(pilots[i]["HoraNum"][len-1]);
    }
    temposFim.sort(function(a,b){ 
        return b-a});
        // console.log(temposFim[0], tempoInicio, temposFim[0]-tempoInicio, toTime(temposFim[0]-tempoInicio));
        tempoTotal = temposFim[0]-tempoInicio;
    return toTime(tempoTotal);
}

function calcMelhoresVoltas(){
    for(var p in pilots)
        pilots[p].calcMelhorVolta();
}

function getMelhorVolta(){
    var min = 0xdeadbeaf;
    var minPil = "";
    for(var i in pilots){
        var curr=pilots[i]["melhorVoltaNum"];
        min = (min>curr&&(minPil=i)&&curr)||min; //um pouco de golfecode =D
    }
    return {nome:minPil, tempo:toTime(min)};
}


function velocidadeMediaTotal(){
    for(var i in pilots)
        pilots[i].calcVelocidadeMediaTotal();               
}

function tempoDeChegadaDepoisDoFim(){
    for(var p in pilots){
        var len = pilots[p]["HoraNum"].length;
        var chegada = pilots[p]["HoraNum"][len-1];        
        var primeiraInstancia = ordemChegada[0];
        var lenPrimeiro =primeiraInstancia["HoraNum"].length;
        var chegadaPrimeiro = primeiraInstancia["HoraNum"][lenPrimeiro-1];
        pilots[p].setTempoDepois(chegada - chegadaPrimeiro);
    }        
}

function mostraReport(){
    var header = "Posição\tNome\tVoltas\tMelhor Volta\tVelocidade Média\tAtraso"; 
    console.log(header);
    for(var i=0 ; i<ordemChegada.length;i++){
        var cod = ordemChegada[i]["Código"];
        var nome= ordemChegada[i]["Nome"];
        var voltas = ordemChegada[i]["Hora"].length;
        var pilotoMelhorVolta = ordemChegada[i]["melhorVolta"];
        var velocidadeMedia = ordemChegada[i]["velocidadeMediaTotal"];
        var atraso = ordemChegada[i]["tempoDepois"];
        pilotoMsg = (i+1)+"\t"+cod+" – "+nome+"\t"+voltas+"\t"+pilotoMelhorVolta+"\t"+velocidadeMedia+"\t"+atraso;
        console.log(pilotoMsg);
    }
    var tempoTotal = calcTempoTotal();
    console.log("Tempo total da prova", tempoTotal);
    melhorVolta = getMelhorVolta();
    console.log("Melhor Volta da corrida", melhorVolta.nome, melhorVolta.tempo);
    
}

!TEST && main();


module.exports.main = main;
module.exports.pilots = pilots;
module.exports.ordemChegada = ordemChegada;
module.exports.pilots = pilots; 
module.exports.primeiraInstancia = primeiraInstancia; 
module.exports.getMelhorVolta = getMelhorVolta;
module.exports.calcTempoTotal = calcTempoTotal;
