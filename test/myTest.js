var expect = require("chai").expect;
describe("test",function(){
    delete require.cache[require.resolve('../solver.js')];
    var  solver= require('../solver.js');;
    solver.main({path:"problem.csv"});
    
    describe("When loads the default scenario",function(){
        
        beforeEach(function(done){
            setTimeout(function(){
                done();
            }, 1000);
        });
    
        it("Should have this classification",function(done){

            expect("038").to.equal(solver.ordemChegada[0]["Código"]);
            expect("033").to.equal(solver.ordemChegada[1]["Código"]);
            expect("002").to.equal(solver.ordemChegada[2]["Código"]);
            expect("023").to.equal(solver.ordemChegada[3]["Código"]);
            expect("015").to.equal(solver.ordemChegada[4]["Código"]);
            expect("011").to.equal(solver.ordemChegada[5]["Código"]);
            
            done();
        });
        it("Should have the best lap with F.Massa",function(done){
            var nome = solver.getMelhorVolta().nome;
            var tempo = solver.getMelhorVolta().tempo;
           expect("038 – F.MASSA").to.equal(nome);
           expect("1:02.769").to.equal(tempo)
           done();
        });
        
        it("myTest2",(done)=>{
            
            delete require.cache[require.resolve('../solver.js')];
            var  solver= require('../solver.js');
            solver.main({path:"test_input.csv"});
            describe("When running a simple test set",function(){
                beforeEach(function(done){
                    setTimeout(function(){
                        done();
                    },1000);
                });
                it("should be all good with the start and end of the circuit",function(done){
                    expect("2:00:00.000").to.equal(solver.calcTempoTotal());
                    
                    done();
                });
                it("must have the average speed as 41.5 for barrichello",function(done){
                   var barrichelloAvSpeed = solver.pilots["033 – R.BARRICHELLO"]["velocidadeMediaTotalNum"]
                   expect(41.5).to.equal(barrichelloAvSpeed);
                   done();
                });
                it("must have F. Massa as the last in the order, and vettel in first",function(done){
                    // console.log(solver.ordemChegada);
                    // console.log(solver.primeiro);
                   expect("011").to.equal(solver.ordemChegada[0]["Código"]);//vettel
                   expect("038").to.equal(solver.ordemChegada[5]["Código"]);//massa
                   done();
                });
            
            });
            done();

        });
    });    
});
