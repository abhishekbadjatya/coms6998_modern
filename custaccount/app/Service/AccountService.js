'use strict';

// const  account= require('../models/account');
// const customerAccount = require('../models/customerAccount');
var  account= require('../models/account.js');
var customerAccount = require('../models/customerAccount.js');

var accountModel = account.accountModel;
var customerAccountModel = customerAccount.customeraccountModel;


/*
 * TODO: Move these mapping functions to a data layer. The service shouldn't
 * know about them.
 */
function mapDbObjectToAccountAttributes(dbObject) {
  return {
    "accountNumber": dbObject.accountNumber,
    "accountType": dbObject.accountType,
    "accountBalance": dbObject.accountBalance
  };
}

function mapAccountAttributes(object) {
  return {
    //accountNumber: dbObject.accountNumber,
    "accountType": object.accountType,
    "accountBalance": object.accountBalance
  };
}


function mapCustomerAccountAttributes(dbObject, object) {
  return {
    "accountNumber": dbObject.id,
    "custID": object.custID
  };
}


function createAccountNumber(number) {
  return {
    "accountNumber": number
  };
}

function mapAccountToDbObject(account) {
  var result = {
  }
  if (account.firstName != null) {
    result.accountNumber = account.accountNumber;
  }
  if (account.lastName != null) {
    result.accountType = account.accountType;
  }
  if (account.addressRef != null) {
    result.accountBalance = account.accountBalance;
  }

  return result;
}

module.exports = class AccountService {
  
constructor(dao) {
    this.dao = dao;
  }


save(account, callback) {

  let p = new Promise((resolve, reject)=> {
  console.log("Proceeding to save Account : " + JSON.stringify(account));
  var accountReturn = null;

  this.dao.connectToDB()
  console.log('here1----')
  accountModel({
    "accountType": account.accountType,
    "accountBalance": account.accountBalance
  })
  .save()
  .then(function(accountObj){
    console.log('Here1')
    accountReturn = accountObj;
    return customerAccountModel({
      
    "accountNumber": accountReturn.id,
    "custID": account.custID
  
    })
    .save()
    .then(function(response){
      console.log("account service resposne");
      console.log(response);
      resolve({account:response});
    })
    .catch;
  })
  .then(function(customerAccountObj){
    //this.dao.disConnectFromDB();
    return accountReturn;
  })
  .catch((error) =>{
        console.log("account service error");
        console.log(error);
        reject({error:"INTERNAL_SERVER_ERROR"});
        // return error;
    });
  })

  // });

  p.then(function(res){
    console.log("Inside p then");
    console.log(res);
    callback(null, res);
    // return res;
  });

}


  /**
   * Fetches Account objects from persistence and returns them.
   * @id - id corresponding to the Customer that needs to be fetched.
   * If nothing is provided then it returns all Customers.
   * @callback - callback function with parameters (err, customers).
   **/


//duplicating method : Anand

fetchOne(id, callback) {
  
  let p = new Promise((resolve, reject)=> {
    this.dao.connectToDB();

    customerAccountModel.find({"custID": id}).exec()
    .then(function(customerAccounts){
      console.log(customerAccounts);
      console.log('Here,Here');
      var accountIDs = [];
      for(var i=0; i < customerAccounts.length; i++){
        console.log(customerAccounts[i]);
        accountIDs.push(customerAccounts[i].accountNumber);
      }
      console.log(accountIDs);
      console.log("Done push");
      // return accountModel.find({_id : {$in : accountIDs}}).exec();
      accountModel.find({_id : {$in : accountIDs}})
      .exec()
      .then((response) => {
        console.log("fetchOne resposne");
        console.log(response);
        resolve({account:response});
        // return response;
      })
      .catch((error) =>{
        console.log("fetchOne error");
        console.log(error);
        reject({error:"INTERNAL_SERVER_ERROR"});
        // return error;
      });
    })
    
    });

  p.then(function(res){
    console.log("Inside p then");
    console.log(res);
    callback(null, res);
    // return res;
  });
  

}

}