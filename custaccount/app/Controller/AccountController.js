'use strict';

var _ = require('underscore')

function areValidParams(params) {
  return _.isObject(params)
}

module.exports = class AccountsController {
   constructor(AccountService) {
    this.accountService = AccountService
  }

getUserAccounts(params, callback){
//function getUserAccounts(params) {
  console.log("Inside getUserAccounts");
      console.log(params)
      var custId = params.custID;
      this.accountService.fetchOne(custId, (err, account) => {
        if (err) {
          
          callback(err)
        } else {
          console.log("getUserAccounts log");
          console.log(account)
          callback(null, account)
        }
      }); 
}


create(params, callback) {
          this.accountService.save(params, (err, account) => {
            if (err) {
                return err;
              } else {
                console.log(account)
          callback(null, account)
              }
          });
    }

};