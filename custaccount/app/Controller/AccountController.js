'use strict';

function areValidParams(params) {
  return _.isObject(params)
}

module.exports = class AccountsController {
  constructor(AccountService, customerSerializer) {
    this.Service = AccountService;
    this.accountSerializer = accountSerializer;
  }

  allaccounts(params, callback) {
    if (areValidParams(params)) {
        // Return all accounts.
        this.accountService.fetchAll(null, (err, customers) => {
          if (err) {
            return callback(err);
          } else if (_.isEmpty(customers)) {
            callback(null, {});
          } else {
            this.customerSerializer.render(customers, callback);
          }
        });
    } 
    else {
      // Invalid params.
      // Raise error.
    }
  }

  alluserAccounts(params, callback) {
    if (areValidParams(params)) {
      var userId = _.isString(params.email);

      if (containsEmail) {
        var userId = params.userId;
        this.accountService.fetchOne(userId, (err, account) => {
          if (err) {
            return callback(err);
          } else {
            this.customerSerializer.render(account, callback);
          }
        }); 
      }
      else {
      // Invalid params.
      // Raise error.
    }
  }
}

  accountById(params, callback) {
    if (areValidParams(params)) {
      var containsId = _.isString(params.accountId);

      if (containsId) {
        var accountId = params.accountId;
        this.accountService.fetchOne(accountId, (err, account) => {
          if (err) {
            return callback(err);
          } else {
            this.customerSerializer.render(account, callback);
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
      this.buildCustomerFromParams(params, (err, customer) => {
        if (err) {
          return callback(err);
        } else {
          this.accountService.save(customer, (err, account) => {
            if (err) {
                return callback(err);
              } else {
                this.customerSerializer.render(account, callback);
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
    console.log(sprintf("Customer attributes received %s.",
      JSON.stringify(accountAttributes)));

    try {
      var account = this.accountService.create(accountAttributes);
    } catch (err) {
      return callback(err);
    }

    console.log(sprintf("Account object created %s.", JSON.stringify(account)));
    callback(null, account);
  }
};