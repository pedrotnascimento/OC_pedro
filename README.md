# OC_pedro

## Enunciado:
A partir log da corrida (race.log), montar um report com as seguintes informações:

Posição chegada, código, nome e qtd voltas completadas de cada piloto.
Tempo total de prova.
Melhor volta de cada piloto.
Melhor volta da corrida.
Velocidade média de cada piloto durante toda corrida.
Quanto tempo cada piloto chegou após o vencedor.
OBSERVAÇÕES

A corrida termina quando o primeiro colocado completa 4 voltas
SOLUÇÃO

Tente cobrir seu código com testes automatizados.
A visualização do report é importante. Sendo assim, sua solução deve oferecê-la a partir de alguma forma. Terminal, mobile, web, não importa.
ENTREGA

## Solução

- Primeiramente execute no terminal dentro da pasta do projeto: npm install 
- 3 módulos:
     - Pilot: que contém o construtor do piloto e algumas funções.
     - solver: Solução em si.
         - visualização através de terminal.
     - test: Feito em Mocha
         - observação: Não consegui fazer com que o módulo reinicia-se com novos dados a não ser fazendo o reload(deletando cache)
  Não sei se essa é a melhor prática.
         - setar TEST = true, para não mostrar o report ao executar o teste
         - para executar o teste: npm install -g mocha && mocha 
         - os testes cobriram casos como mudança de ordem de chegada, inicio e término da prova, velocidade média.
  
 
