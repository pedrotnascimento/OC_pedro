
/*
construtor de Piloto
Tempo Volta -> array de voltas
Hora -> array de tempos
Velocidade média da volta -> array de velocidade média

todos os parâmetros que tem sufixo Num representam em segundos o tempo
sem o sufixo Num é a representação do input em string( [HH:]MM:SS.mmm )
a duplicação da representação tem base no custo de pagar em memória 
mas economizar em processamento e legibilidade do código, evitando muitas chamadas de função
*/
function Pilot(params){
    var self = {}
    var temp = params["Piloto"].split("–");
    self["Código"] = temp[0].trim();
    self["Nome"] = temp[1].trim();
    //array de v
    self["Tempo Volta"] = [params["Tempo Volta"]]; 
    self["Tempo VoltaNum"] = [toSeconds(params["Tempo Volta"])];
    self["Hora"] = [params["Hora"]];
    self["HoraNum"] = [toSeconds(params["Hora"], true)];
    self["Velocidade média da volta"] = [params["Velocidade média da volta"]];
    self["Velocidade média da voltaNum"] = [params["Velocidade média da volta"].replace(",",".")*1];
    
    
    var addLap = function(lap){
        self["Tempo Volta"].push(lap);
        self["Tempo VoltaNum"].push(toSeconds(lap));
    }
    var addHour = function(hour){
        self["Hora"].push(hour);
        self["HoraNum"].push(toSeconds(hour, true));
    }
    var addVelocidadeMedia = function(vmedia){
        self["Velocidade média da volta"].push(vmedia);
        self["Velocidade média da voltaNum"].push(toSeconds(vmedia));
    }
    
    self.updatePilot = function(obj){
        addLap(obj["Tempo Volta"]);
        addHour(obj["Hora"]);
        addVelocidadeMedia(obj["Velocidade média da volta"]);
    }
    
    self.calcMelhorVolta = ()=>{
        var tempos = self["Tempo VoltaNum"].slice();//faz cópia
        tempos.sort((a,b) => {return a-b});
        self.melhorVoltaNum= tempos[0];                
        self.melhorVolta= toTime(tempos[0]);
    }
                
    self.calcVelocidadeMediaTotal= ()=>{
        var medias =0;
        for(var i in self["Velocidade média da voltaNum"])
            medias += self["Velocidade média da voltaNum"][i];
        self["velocidadeMediaTotalNum"] = medias/self["Velocidade média da voltaNum"].length;
        self["velocidadeMediaTotal"] = toTime(self["velocidadeMediaTotalNum"]);
    }
    
    //tempo em segundos
    self.setTempoDepois = (tempo) => {
        self["tempoDepoisNum"] = tempo;
        self["tempoDepois"] = toTime(self["tempoDepoisNum"]);
    }
    
    return self;
}


//baseado no RadixSort -> ordena cada piloto separadamente por voltas depois por tempo
function pilotSort(pilots){
    //dicionário de pilotos separados por volta
    var lapNum = {}
    for(var i =0 ; i< pilots.length; i++){
        var currLapNum = pilots[i]["Hora"].length;//erro detectado por teste
        if(currLapNum in lapNum){
            lapNum[currLapNum].push(pilots[i]);
        }
        else{
            lapNum[currLapNum] = [];
            lapNum[currLapNum].push(pilots[i]);
        }
    }
    //necessario para saber quais voltas existem 
    //e concatenar ao final na ordem certa(inversa)
    var laps = []; 
    for(var i in lapNum){
        laps.push(i);
        lapNum[i].sort(function(a,b){
            var la = a["HoraNum"].length-1;
            var lb = b["HoraNum"].length-1;
            return a["HoraNum"][la]- b["HoraNum"][lb];
            });
    }
    
    laps.sort((a,b) => {return a-b});
    laps.reverse();
    
    var sortedPilots = [];
    for(var i in laps){
        sortedPilots = sortedPilots.concat(lapNum[laps[i]]);
    }
    
    return sortedPilots;
}

//recebe input e transforma em segundos
function toSeconds(str){
    // console.log(str);
    str = str.replace(/[:.]/g,",").split(",");
    // console.log(str);
    var seconds = str[str.length-1]*1/1000;
    seconds += str[str.length-2]*1
    
    if(typeof str[str.length-3] != 'undefined')
        seconds += str[str.length-3]*60;
    if(typeof str[str.length-4] != 'undefined')
        seconds+=str[str.length-4]*60*60;
    return seconds;
}

//mostra tempo no estilo do input
function toTime(num){
    var isHour = num >= 3600;
    var hour = 0,
        minf,
        min ;
    if(isHour){
        var hourf = num/(60*60);
        hour =myTrunc(hourf);
        var minf = (hourf - hour)*60;
        hour += ":";
        var min = myTrunc(minf);
    }
    else {
        hour = "";
        minf = num/60;
        min = myTrunc(minf);
    }
    
    var secf = (minf - min)*60;
    min = min<10 && isHour? "0"+min:min;
    var sec = myTrunc(secf*1000)/1000;
    
    var milif = secf - sec;
    sec = sec<10? "0"+sec: sec;
    sec = milif== 0 ? sec+".000":sec;
    
    return hour+ min+":"+sec;
    
}

//corrige aproximações não desejáveis:
// Math.floor(1.999999999) -> 1 ERRADO
// myTrunc(1.999999999) -> 2 OK
function myTrunc(num){
    
    if( num -Math.floor(num) > 0.999)
        return Math.floor(num)+1;
    return Math.floor(num);
}



module.exports.Pilot = Pilot;
module.exports.pilotSort = pilotSort;
module.exports.toSeconds = toSeconds;
module.exports.toTime = toTime;
module.exports.myTrunc = myTrunc;