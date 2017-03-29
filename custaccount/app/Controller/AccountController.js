'use strict';

function areValidParams(params) {
  return _.isObject(params)
}

module.exports = class AccountsController {
  constructor(AccountService) {
    this.Service = AccountService;
  }

  getUserAccounts(params) {
    if (areValidParams(params)) {
      var containsId = _.isString(params.custId);

      if (containsId) {
        var custId = params.custId;
        this.accountService.fetchOne(custId, (err, account) => {
          if (err) {
            return callback(err);
          } else {
            return account;
          }
        }); 
      }
      else {
      // Invalid params.
      // Raise error.
    }
  }
}

  accountById(params) {
    if (areValidParams(params)) {
      var containsId = _.isString(params.accountId);

      if (containsId) {
        var accountId = params.accountId;
        this.accountService.fetchOne(accountId, (err, account) => {
          if err {
            return err;
          } else {
            return account;
          }
        }); 
      }
      else {
      // Invalid params.
      // Raise error.
    }
   }
 }


  create(params, callback) {
    if (areValidParams(params)) {
      this.buildAccountFromParams(params, (err, customer) => {
        if (err) {
          return err;
        } else {
          this.accountService.save(customer, (err, account) => {
            if (err) {
                return err;
              } else {
                return account;
              }
          });
          this.accountService.save(customer, (err, account) => {
            if (err) {
                return err;
              } else {
                return account;
              }
          });
        }
      });
    } else {
      // Invalid params.
      // Raise error.
    }
  }


  buildAccountFromParams(params, callback) {
    var accountAttributes = this.accountSerializer.deserialize(params);
    console.log(sprintf("Account attributes received %s.",
      JSON.stringify(accountAttributes)));

    try {
      var account = this.accountService.create(accountAttributes);
    } catch (err) {
      return err;
    }

    console.log(sprintf("Account object created %s.", JSON.stringify(account)));
    return account;
  }
};