//server creation
// 1. import express
 const express = require('express')
const res = require('express/lib/response')
 // import token
const jwt = require('jsonwebtoken')
//import cors
const cors = require('cors')
 //import dataservice
 const dataService= require('./services/data.service')
 // server app creat using express
 const app = express()
 //cors use in server app
 app.use(cors({
     origin:'http://localhost:4200'
 }))
 //parse json data
 app.use(express.json())
 //application specific middleware
 const appMiddleware = (req,res,next)=>{
     console.log("application specific middleware");
     next()
 }


//use middleware in app
app.use(appMiddleware)

 //bank server
 const jwtMiddleware = (req,res,next)=>{
 try{    //fetch token
     token=req.headers['x-token']
     //verify token
 const data =jwt.verify(token,'supersecretket123')
 console.log(data);
 next()}
 
 catch{
     res.status(401).json({
         status:false,statusCode:401,
         message:'Please Login In'
     })
 }
}
 // register API
 app.post('/register',(req,res)=>{
     // register solving
     console.log(req.body);
      dataService.register(req.body.username,req.body.acno,req.body.password)
      .then(result=>{
        res.status(result.statusCode).json(result)
        // res.send("sucess")

      })
    

 })
//login API
 app.post('/login',(req,res)=>{
    // login solvoing asynchronus
    dataService.login(req.body.acno,req.body.pswd)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})

//Deposit API
app.post('/deposit',jwtMiddleware,(req,res)=>{
    // deposit solvoing asynchronus
    dataService.deposit(req.body.acno,req.body.password,req.body.amt)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })   

})

//Withdraw API
app.post('/withdraw',jwtMiddleware,(req,res)=>{
    // deposit solvoing
     dataService.withdraw(req.body.acno,req.body.password,req.body.amt)
     .then(result=>{
        res.status(result.statusCode).json(result)   
     
})
})
//Transaction API

app.post('/transaction',jwtMiddleware,(req,res)=>{
    // deposit solvoing
    dataService.getTransaction(req.body.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)   
     
})   

})


 //user requst resolving
 //GET reqst-to fetch data
 app.get('/',(req,res)=>{
     res.send("GET REQUEST")
 })
  //POST reqst-TO CREATE DATA
  app.post('/',(req,res)=>{
    res.send(" POST REQUEST")
})
 //PUT reqst-to modify entire data
 app.put('/',(req,res)=>{
    res.send("PUT REQUEST")
})
 //PATCH reqst-to modify partially
 app.patch('/',(req,res)=>{
    res.send("PATCH REQUEST")
})
 //DELETE reqst-to delete data
 app.delete('/',(req,res)=>{
    res.send("DELETE REQUEST")
})
 // set up port number to the server app
 app.listen(3000,()=>{
     console.log("server started at 3000");
 })