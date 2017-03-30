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
      console.log(params)
      var custId = params.custId;
      this.accountService.fetchOne(custId, (err, account) => {
        if (err) {
          
          callback(err)
        } else {
          console.log(account)
          callback(null, account)
        }
      }); 
}

 //  accountById(params) {
 //      if (containsId) {
 //        var accountId = params.accountId;
 //        this.accountService.fetchOne(accountId, (err, account) => {
 //          if (err) {
 //            return err;
 //          } else {
 //            return account;
 //          }
 //        }); 
 //      }
 // }

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


// buildAccountFromParams(params, callback) {
//     console.log(sprintf("Account attributes received %s.",
//       JSON.stringify(params)));

//     try {
//       var account = this.accountService.create(params);
//     } catch (err) {
//       return err;
//     }

//     console.log(sprintf("Account object created %s.", JSON.stringify(account)));
//     return account;
//   }
};