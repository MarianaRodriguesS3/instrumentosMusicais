const model = require("../models/instrumento.js")
function verificaInstrumento(instrumento){
    if(instrumento.instrumento.length == 0) return 'selecione um instrumento'
    if(instrumento.quantidade == 0) return 'selecione a quantidade'
    if(instrumento.tipo !== 'canhoto' && instrumento.tipo !== 'destro') return 'selecione a opção de canhoto ou destro'
    return 'ok'
}
function getInstrumento(req,res){
    model.getInstrumento()
    .then((instrumentos)=>{
        console.log(instrumentos)
        res.status(200).send(instrumentos)
    })
    .catch((err)=>{
        console.log(err)
        res.status(400).send(err)
    })
}
function incluiInstrumento(req,res){
    var novo=req.body;
    var confere=verificaInstrumento(novo)
    if(confere=='ok'){
        model.incluiInstrumento(novo)
        .then((result)=>{
            res.status(200).send(result);
        })
        .catch((err)=>{
            res.status(400).send(err);
        })
    }else{
        res.status(400).send(confere);
    }
}
function alteraInstrumento(req,res){
    var novo=req.body;
    var confere=verificaInstrumento(novo);
    if(confere=='ok'){
        model.alteraInstrumento(novo)
        .then((result)=>{
            res.status(200).send(result);
        })
        .catch((err)=>{
            res.status(400).send(err)
        })
    }else{
        res.status(400).send(confere)
    }
}
function apagaInstrumento(req,res){
    var id=req.params.id;
    model.apagaInstrumento(id)
    .then((result)=>{
        res.status(200).send(result)
    })
    .catch((err)=>{
        res.status(400).send(err)
    })
}

module.exports = {
    getInstrumento,
    incluiInstrumento,
    alteraInstrumento,
    apagaInstrumento
};