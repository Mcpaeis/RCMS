var DbName ='Mcpaeis';
var Connection = new JsStore.Instance();
$(document).ready(function(){
  initJsStore();
  $('#test').
  on('click', '.add_item', insertItem).
  on('click', '.update_item', updateItem).
  on('click', '.delete_item', deleteItem).
  on('click', '.select_item', selectItem)
});
function getDbSchema() {
  var TblRecommenders = {
    Name: 'Recommenders',
    Columns: [
      {
          Name: 'Id',
          PrimaryKey: true,
          AutoIncrement: true
      }, 
      {
          Name: 'FirstName',
          NotNull: true
      },
      {
          Name: 'LastName',
          NotNull: true
      },  
      {
          Name: 'EmailAddress',
          NotNull: true
      }, 
      {
          Name: 'UserPassword',
          NotNull: true
      },
      {
          Name: 'DateAdded',
          NotNull: true
      },
      {
          Name: 'AccountStatus',
          NotNull: true
      } 
    ]
  };
  var TblAdmin = {
    Name: 'Admin',
    Columns: [
      {
          Name: 'Id',
          PrimaryKey: true,
          AutoIncrement: true
      }, 
      {
          Name: 'FirstName',
          NotNull: true
      },
      {
          Name: 'LastName',
          NotNull: true
      },  
      {
          Name: 'EmailAddress',
          NotNull: true
      }, 
      {
          Name: 'UserPassword',
          NotNull: true
      },
      {
          Name: 'DateAdded',
          NotNull: true
      },
      {
          Name: 'AccountStatus',
          NotNull: true
      },
      {
          Name: 'UserId',
          NotNull: true
      }  
    ]
  };
  var TblRecommendations = {
    Name: 'Recommendations',
    Columns: [
      {
          Name: 'Id',
          PrimaryKey: true,
          AutoIncrement: true
      }, 
      {
          Name: 'AuthorisationId',
          NotNull: true
      },
      {
          Name: 'RequesterReference',
          NotNull: true
      },  
      {
          Name: 'NumberOfCopies',
          NotNull: true
      }, 
      {
          Name: 'Amount',
          NotNull: false
      },
      {
          Name: 'DateRequested',
          NotNull: true
      },
      {
          Name: 'DateIssued',
          NotNull: false;
      },
      {
          Name: 'Status',
          NotNull: true
      }  
    ]
  };
  var TblRecSettings = {
    Name: 'RecSettings',
    Columns: [
      {
          Name: 'Id',
          PrimaryKey: true,
          AutoIncrement: true
      }, 
      {
          Name: 'Category',
          NotNull: true
      },
      {
          Name: 'DefaultAmountPerCopy',
          NotNull: true
      },  
      {
          Name: 'DiscountLimit',
          NotNull: true
      }, 
      {
          Name: 'AmountAfterDiscLimit',
          NotNull: true
      },
      {
          Name: 'DateAdded',
          NotNull: true
      } 
    ]
  };
  var Db = {
      Name: DbName,
      Tables: [TblRecommenders]
  };
  return Db;
}
function initJsStore() {
  JsStore.isDbExist(DbName, function(isExist) {
    if (isExist) {
      Connection.openDb(DbName);
    } else {
      var Database = getDbSchema();
      Connection.createDb(Database);
    }
  }, function(err) {
    console.error(err);
  })
}
var Value = {
  FirstName:'Sixtus',
  LastName: "Dakurah",
  EmailAddress: "dakurahsixtus@gmail.com",
  UserPassword: "2019hello",
  DateAdded: "20190112",
  AccountStatus: "Active"
}
//since Id is autoincrement column, so the value will be automatically generated.
function insertItem (tableName, Value) {
  // body...
  Connection.insert({
    Into: tableName,
    Values: [Value],
    OnSuccess: function(rowsInserted) {
      if (rowsInserted > 0) {
        //alert('successfully added');
        return true;
      }
    },
    OnError: function(err) {
      console.log(err);
      //alert(err.Message);
      return false;
    }
  });
}
function selectItem (tableName, ref, value) {
  // body...
  Connection.select({
    From: tableName,
    Where: {
      ref: value
    },
    OnSuccess: function(results) {
      //first check the length of the results returned
        console.log(results);
        return results;
      //alert(results.length + ' record found');
    },
    OnError: function(err) {
      console.log(err);
      //alert(err.Message);
      //return false;
    }
  });
}

function updateItem (tableName, ref, value, cRef, cValue) {
  // body...
  Connection.update({
    In: tableName,
    Where: {
      ref: value
    },
    Set: {
      cRef: cValue
    },
    OnSuccess: function(rowsUpdated) {
      //alert(rowsUpdated + ' rows updated')
      return true;
    },
      OnError: function(err) {
        console.log(err);
        //alert(err.Message);
        return false;
      }
  });
}
function deleteItem (tableName, ref, value) {
  // body...
  Connection.remove({
    From: tableName,
    Where: {
      ref: value
    },
    OnSuccess: function(rowsDeleted) {
      console.log(rowsDeleted + ' record deleted');
      return true;
    },
    OnError: function(err) {
      console.log(err);
      //alert(err.Message);
      return false;
    }
  });
}
