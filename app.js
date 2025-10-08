const express = require("express")
const mysql = require('mysql2');

const contrInstrumento = require("./controllers/instrumento.js")

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'instrumentosMusicais',
});

const app=express()
app.use(express.static('view'))
app.use(express.json())
app.get("/",(req,res)=>{res.sendFile(__dirname+"/view/index.html")})

app.get("/instrumentosMusicais",(req,res)=>{contrInstrumento.getInstrumento(req,res)})
app.post("/instrumentosMusicais",(req,res)=>{contrInstrumento.incluiInstrumento(req,res)})
app.put("/instrumentosMusicais/:id",(req,res)=>{contrInstrumento.alteraInstrumento(req,res)})
app.delete("/instrumentosMusicais/:id",(req,res)=>{contrInstrumento.apagaInstrumento(req,res)})
app.listen(8080,()=>{
    console.log("\n\n escutando a porta 8080")
})