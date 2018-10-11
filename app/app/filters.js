var myApp = angular.module('myApp');

myApp.filter('inputSelected', function() {
    return function(formData) {
        var keyArr = [];
        var word = [];
        if (formData) {
            Object.keys(formData).forEach(function(key) {
                if (formData[key]) {
                    var keyCap = key.charAt(0).toUpperCase() + key.slice(1);
                    for (var char = 0; char < keyCap.length; char++) {
                        if (keyCap[char] == keyCap[char].toUpperCase()) {
                            var spacedLetter = ' ' + keyCap[char];
                            word.push(spacedLetter);
                        } else {
                            word.push(keyCap[char]);
                        }
                    }
                }
                keyArr.push(word.join(''))
                word = [];
            })
            return keyArr.toString();
        }
    }
});

myApp.filter('filterLongObj', function($filter) {
    return function(formObj) {
        if (Object.keys(formObj).length > 1 && formObj.constructor === Object) {
            var pretty = JSON.stringify(formObj).replace(/{|}|"/g, "");
            return pretty;
        } else if (formObj.constructor === Object) {
            return $filter('inputSelected')(formObj);
        } else {
            return formObj;
        }
    }
});

myApp.filter('newlines', function($sce) {
    return function(formObj) {
        if (formObj) {
          return $sce.trustAsHtml(formObj.replace(/,/g, '<br>'));
        }
    }
});

myApp.filter('timestamp', function() {
    return function(formObj) {
        var timestamp = formObj._id.toString().substring(0, 8);
        var date = new Date(parseInt(timestamp, 16) * 1000);
        return date;
    }
});

myApp.filter('tableToFormName', function() {
    return function(tableName) {
        if (tableName === 'memberapp') {
            return 'Membership'
        } else if (tableName === 'volunteerapp') {
            return 'Volunteer'
        } else if (tableName === 'nonriderapp') {
            return 'Non-Rider'
        } else if (tableName === 'contactform') {
            return 'Contact'
        } else {
            return 'Other'
        }
    }
});

myApp.filter('reverse', function() {
    return function(items) {
      if (items){
        return items.slice().reverse();
      }
    };
});