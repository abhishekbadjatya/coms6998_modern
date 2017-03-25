'use strict';

const Account = require('../models/account');

/*
 * TODO: Move these mapping functions to a data layer. The service shouldn't 
 * know about them.
 */
function mapDbObjectToAccountAttributes(dbObject) {
  return {
    accountNumber: dbObject.accountNumber,
    accountType: dbObject.accountType,
    accountBalance: dbObject.accountBalance,
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

  /**
   * Builds a Account object, with all its dependencies. Does not persist it.
   * @input - attributes used to build the Account.
   * Throws InputValidationException.
   **/
  create(input) {
    if (input instanceof Account) {
      return input;
    } else {
      return new Account(input);
    }
  }

  /**
   * Saves the given Account to persistence.
   * @account - a valid Account object.
   * @callback - callback function with parameters (err, account).
   * Throws InputValidationException.
   **/
  save(account, callback) {
    try {
      account.validate();
    } catch (err) {
      return callback(err);
    }
    console.log(sprintf("Proceeding to save Account %s.", JSON.stringify(account)));
    var accountDbObject = mapAccountToDbObject(account);
    console.log(sprintf("Ready to persist: %s.", JSON.stringify(accountDbObject)));
    dao.connectToDB();
    return account(mapAccountToDbObject(account)).save()
    /*this.dao.persist(createAccountKey(account.accountNumber), accountDbObject,
    (err, item) => {
            if (err) {
              console.log(sprintf("Error while trying to persist: %s.",
                JSON.stringify(accountDbObject)));
              return callback(err);
            } else {
              callback(null, account);
            }
   });*/
   .catch(function(err){
        dao.disConnectFromDB();
        console.log(err);
        res.status(500).send({error:"INTERNAL_SERVER_ERROR"});
  });
  }

  /**
   * Fetches Account objects from persistence and returns them.
   * @id - id corresponding to the Customer that needs to be fetched.
   * If nothing is provided then it returns all Customers.
   * @callback - callback function with parameters (err, customers).
   **/
  fetch(id, callback) {
    if (id) {
      // Fetch just one.
      try {
        var account = new Account({ id: id });
      } catch (err) {
        return callback(err);
      }

      var queryResult = this.dao.fetch({ id: account.id },
        (err, accountDbObject) => {

          if (err) {
            return callback(err);
          }

          if (_.isEmpty(accountDbObject)) {
            return callback(null, {});
          } else {
            var accountAttributes = mapDbObjectToCustomerAttributes(
              accountDbObject);

            try {
              var account = this.create(accountAttributes);
            } catch (err) {
              return callback(err);
            }

            console.log("Successfully fetched Account with id: " +
              account.id);
            return callback(null, account);
          }
        });

    } else {
      // Fetch all.
      this.dao.fetch(null, (err, accountDbObjects) => {

        if (err) {
          return callback(err);
        }

        var accounts = [];

        for (var accountDbObject of accountDbObjects) {
          var accountAttributes = mapDbObjectToAccountAttributes(
            accountDbObject);
          try {
            var account = this.create(accountAttributes);
          } catch (err) {
            return callback(err);
          }
          accounts.push(account);
        }

        console.log("Successfully fetched all Customers.");
        return callback(err, accounts);
      });
    }
  }

}