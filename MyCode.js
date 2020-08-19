 // A $( document ).ready() block.
 var _message="";
 $( document ).ready(function() {
    $("#dateOfBirth").datepicker();
});
function GetAge(){
    var dob = $("#dateOfBirth").val();   
 var Mydate = new Date(dob); 
 _message = calcDate(Mydate);
//alert(message);
$("#Age").text(_message);
    
  };

function calcDate(GivenDate) {
    var today = new Date()
    var diff = Math.floor(today.getTime() - GivenDate.getTime());
    var day = 1000 * 60 * 60 * 24;

    var days = Math.floor(diff/day);
    var months = Math.floor(days/31);
    var years = Math.floor(months/12);

    var message ="" ;//= GivenDate.toDateString();
    //message += " was "
    message += days + " days " 
    message += months + " months "
    message += years + " years ago \n"

    return message
    };
   
   
  // CREATE Operation
  // listName: The name of the list you want to get items from
  // weburl: The url of the web that the list is in. 
  // newItemTitle: New Item title.
  // success: The function to execute if the call is sucesfull
  // failure: The function to execute if the call fails
  function CreateNew() {
    var listName = "EMPLOYEE";
    var _name = $("#name").val();
    var _dob = $("#dateOfBirth").val();
    var _age = _message;

      var itemType = GetItemTypeForListName(listName);
      var item = {
          "__metadata": { "type": itemType },
          "DATEOFBIRTH":_dob,
          "NAMEOFEMPLOYEE":_name,
          "Age":_age
      };
   //_spPageContextInfo.webAbsoluteUrl
      $.ajax({
          url: _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items",
          type: "POST",
          contentType: "application/json;odata=verbose",
          data: JSON.stringify(item),
          headers: {
              "Accept": "application/json;odata=verbose",
              "X-RequestDigest": $("#__REQUESTDIGEST").val()
          },
          success: function (data) {
              //success(data);
              alert("Item Inserted !!!")
          },
          error: function (data) {
              failure(data);
          }
      });
      Read();
  };
   
  // Get List Item Type metadata
  function GetItemTypeForListName(name) {
      return "SP.Data." + name.charAt(0).toUpperCase() + name.split(" ").join("").slice(1) + "ListItem";
  }
// occurs when a user clicks the read button

 
// READ operation
// listName: The name of the list you want to get items from
// siteurl: The url of the site that the list is in. 
// success: The function to execute if the call is sucesfull
// failure: The function to execute if the call fails
function Read() {
    var listName = "EMPLOYEE";
    var url = _spPageContextInfo.webAbsoluteUrl;
 
    getListItems(listName, url, function (data) {
        var items = data.d.results;
        if(items.length > 0)
        {
            $("#dataviewer").empty();
        // Add all the new items
        for (var i = 0; i < items.length; i++) {
           // alert(items[i].Title + ":" + items[i].Id);
           var _date = new Date(items[i].DATEOFBIRTH);
           $("#dataviewer").append('<tr><td style="color:black;">'+items[i].NAMEOFEMPLOYEE+'</td><td style="color:black;">'+_date+'</td><td style="color:black;">'+items[i].Age+'</td><td><input type="submit" value="Delete" onclick=Delete('+items[i].Id+')></td></tr>');  
        }
     }
    }, function (data) {
        alert("Ooops, an error occured. Please try again");
    });
};
Read();
   //_spPageContextInfo.webAbsoluteUrl
function getListItems(listName, siteurl, success, failure) {
    $.ajax({
        url: siteurl + "/_api/web/lists/getbytitle('" + listName + "')/items?$select=DATEOFBIRTH,NAMEOFEMPLOYEE,Age,Id",
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            success(data);
        },
        error: function (data) {
            failure(data);
        }
    });
}
// occurs when a user clicks the update button
function Update() {
    var listName = "EMPLOYEE";
    var url = _spPageContextInfo.webAbsoluteUrl;
    var itemId = "1"; // Update Item Id here
    var title = "New Updated Title";
    updateListItem(itemId, listName, url, title, function () {
        alert("Item updated, refreshing avilable items");
    }, function () {
        alert("Ooops, an error occured. Please try again");
    });
}
 
// Update Operation
// listName: The name of the list you want to get items from
// siteurl: The url of the site that the list is in. // title: The value of the title field for the new item
// itemId: the id of the item to update
// success: The function to execute if the call is sucesfull
// failure: The function to execute if the call fails
function updateListItem(itemId, listName, siteUrl, title, success, failure) {
    var itemType = GetItemTypeForListName(listName);
 
    var item = {
        "__metadata": { "type": itemType },
        "Title": title
    };
 
    getListItemWithId(itemId, listName, siteUrl, function (data) {
        $.ajax({
            url: data.__metadata.uri,
            type: "POST",
            contentType: "application/json;odata=verbose",
            data: JSON.stringify(item),
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "X-HTTP-Method": "MERGE",
                "If-Match": data.__metadata.etag
            },
            success: function (data) {
                success(data);
            },
            error: function (data) {
                failure(data);
            }
        });
    }, function (data) {
        failure(data);
    });
}
// occurs when a user clicks the delete button
function Delete(Id) {
    var listName = "EMPLOYEE";
    var url = _spPageContextInfo.webAbsoluteUrl;
    var itemId = Id; // Update Item ID here
    deleteListItem(itemId, listName, url, function () {
        alert("Item deleted successfully");
        Read();
    }, function () {
        alert("Ooops, an error occured. Please try again");
    });
};
 
// Delete Operation
// itemId: the id of the item to delete
// listName: The name of the list you want to delete the item from
// siteurl: The url of the site that the list is in. 
// success: The function to execute if the call is sucesfull
// failure: The function to execute if the call fails
function deleteListItem(itemId, listName, siteUrl, success, failure) {
    getListItemWithId(itemId, listName, siteUrl, function (data) {
        $.ajax({
            url: data.__metadata.uri,
            type: "POST",
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-Http-Method": "DELETE",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "If-Match": data.__metadata.etag
            },
            success: function (data) {
                success(data);
            },
            error: function (data) {
                failure(data);
            }
        });
    },
   function (data) {
       failure(data);
   });
}
// READ SPECIFIC ITEM operation
// itemId: The id of the item to get
// listName: The name of the list you want to get items from
// siteurl: The url of the site that the list is in. 
// success: The function to execute if the call is sucesfull
// failure: The function to execute if the call fails
function getListItemWithId(itemId, listName, siteurl, success, failure) {
    var url = siteurl + "/_api/web/lists/getbytitle('" + listName + "')/items?$filter=Id eq " + itemId;
    $.ajax({
        url: url,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            if (data.d.results.length == 1) {
                success(data.d.results[0]);
            }
            else {
                failure("Multiple results obtained for the specified Id value");
            }
        },
        error: function (data) {
            failure(data);
        }
    });
}
