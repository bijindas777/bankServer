// import token
const jwt = require('jsonwebtoken')
db = {
    1000:{"acno":1000,"username":"sreekanth","password":1000,"balance":5000,transaction:[]},
    1001:{"acno":1001,"username":"aswin","password":1000,"balance":3000,transaction:[]},
    1002:{"acno":1002,"username":"ajesh","password":1000,"balance":2000,transaction:[]},

  }
//login
  const login = (acno,pswd)=>{
    

  
    if(acno in db ){
      if(pswd == db[acno]["password"]){
        currentUser=db[acno]["username"]
        currentAcno=acno
        //token
        token=jwt.sign({
          currentAcno:acno
        },'supersecretket123')
        return {
          status:true,
          message:" login succcefully",
          statusCode:200,
          currentUser,
          currentAcno,
          token
        } 
      }
      else{
        return {
          status:false,
          message:"Incorrect password",
          statusCode:401
        }
      }
    }
    else{
      return {
        status:false,
        message:"User does not exist",
        statusCode:401
      }
    }
}
  //register
 const register = (username,acno,password)=>{
    if(acno in db){
      return {
        status:false,
        message:"Already registered...please log in",
        statusCode:401
      }
    }
    else{
      // insert in db
      db[acno]={
        acno,
        username,
        password,
        "balance":0,
        transaction:[]
      }
      console.log(db)
      return {
      status:true,
      message:" registered succcefully",
      statusCode:200
    }
    }
  }
  //deposit api
   const deposit=(acno,password,amt)=>{
    var amount = parseInt(amt)
    if(acno in db){
      if(password==db[acno]["password"]){
        db[acno]["balance"]+=amount
        db[acno].transaction.push({
          type:"CREDIT",
          amount:amount
        })
        return {
          status:true,
          message:amount+" deposited succcefully ...new balance is"+db[acno]["balance"],
          statusCode:200
        } 

      }
      else{
        return {
          status:false,
          message:"Incorrect Password",
          statusCode:401
        }
      }
      
    }
    else{
      return {
        status:false,
        message:"User does not exist",
        statusCode:401
      }
    }
  }
  //Withdraw API
   const withdraw =(acno,password,amt)=>{
    var amount = parseInt(amt)
    if(acno in db){
      if(password==db[acno]["password"]){
        if( db[acno]["balance"]>amount){
  
        db[acno]["balance"]-=amount
        db[acno].transaction.push({
          type:"DEBIT",
          amount:amount
        })
        return {
          status:true,
          message:amount+" Withdraw succcefully ...new balance is"+db[acno]["balance"],
          statusCode:200
        }       }
      else{
        return {
          status:false,
          message:"Insufficant Balance",
          statusCode:422
        }
      }
      
    }
    else{
      return {
        status:false,
        message:"Incorrect Password",
        statusCode:401
      }
    }
  }
  else{
    return {
      status:false,
      message:"User does not exist",
      statusCode:401
    }
  }
  }
  //Transaction
   const getTransaction =(acno)=>{
     if(acno in db){
       return{
         status:true,
         statusCode:200,
         transaction:db[acno].transaction
       }
     }
     else{
       return{
        status:false,
        message:"user does not exist",
        statusCode:401
       }
     }
  
  }
 
  
  //EXPORT

  module.exports={
      register,
      login,
      deposit,
      withdraw,
      getTransaction
  }