// import token
const jwt = require('jsonwebtoken')
//IMPORT db.js
const db = require('./db')
// db = {
//     1000:{"acno":1000,"username":"sreekanth","password":1000,"balance":5000,transaction:[]},
//     1001:{"acno":1001,"username":"aswin","password":1000,"balance":3000,transaction:[]},
//     1002:{"acno":1002,"username":"ajesh","password":1000,"balance":2000,transaction:[]},

//   }
//login
  const login = (acno,pswd)=>{
    return db.User.findOne({
      acno,
      password:pswd
    }).then(user=>{
      if(user){
        currentUser=user.username
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
              message:"invalid account number and password",
              statusCode:401
            }
          }    
    })
  }
  

  //register
 const register = (username,acno,password)=>{
   //asynchronus
   return db.User.findOne({
     acno
   }).then(user=>{
console.log(user);
  
    if(user){
      return {
        status:false,
        message:"Already registered...please log in",
        statusCode:401
      }
    }
    else{
      // insert in db
      const newUser = new db.User({
        acno,
        username,
        password,
        balance:0,
        transaction:[]
      })
    newUser.save()
      return {
      status:true,
      message:" registered succcefully",
      statusCode:200
    }
    }
  })
}

  //deposit api
   const deposit=(req,acno,password,amt)=>{
    var amount = parseInt(amt)
     return db.User.findOne({
       acno,
       password
     }).then(user=>{
      if(user){
        if(acno!=req.currentAcno){
          return {
            status:false,
            message:"Permission Denied",
            statusCode:401
        }
      }
        user.balance +=amount
        user.transaction.push({
          type:"CREDIT",
          amount:amount
        })
        user.save()
        return {
          status:true,
          message:amount+" credited succcefully ...new balance is"+user.balance,
          statusCode:200
        } 

      }
      else{
        return {
          status:false,
          message:"invalid account number or password",
          statusCode:401
        
      }
      
    }

     })
    }
  //Withdraw API
   const withdraw =(req,acno,password,amt)=>{
    var amount = parseInt(amt)
    return db.User.findOne({
      acno,
      password
    }).then(user=>{
      if(user){
        if(acno!=req.currentAcno){
          return {
            status:false,
            message:"Permission Denied",
            statusCode:401
          }
        }
       if(user.balance>amount){
        user.balance-=amount
        user.transaction.push({
          type:"DEBIT",
          amount:amount
        })
        user.save()
        return {
          status:true,
          message:amount+" debited succcefully ...new balance is"+user.balance,
          statusCode:200
        }   
      }
      else{
        return {
          status:false,
          message:"Insufficent balance",
          statusCode:401
        }
      }
  
      }
      else{
        return {
          status:false,
          message:"Invalid account number and password",
          statusCode:401
        }
    }
   
  })
   }
  //Transaction
   const getTransaction =(acno)=>{
     return db.User.findOne({
       acno
      
     }).then(user=>{
       if(user){
        return{
          status:true,
          statusCode:200,
          transaction:user.transaction
        }
       }
       else{
        return{
          status:false,
          message:"user does not exist",
          statusCode:401
         }
       }
     })
    }
     //delete
     const deleteAcc=(acno)=>{
      return db.User.deleteOne({
        acno
      }).then(user=>{
        if(!user){
          return{
            status:false,
          message:"operation failed",
          statusCode:401
          }
        }
        return{
          status:true,
          statusCode:200,
          message:"Succesfully deleted"
        }
      })
     }
     
  
  
 
  
  //EXPORT

  module.exports={
      register,
      login,
      deposit,
      withdraw,
      getTransaction,
      deleteAcc
  }