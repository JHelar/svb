// Includes util functions: find, map, iterator, assign and console
// How to use?
// Copy paste the snippet bellow to your script
// inject('/modules/utils.js')

var iterator = function(array, itemCallback){ // Helper to iterate given array correctly. If itemCallback returns true, it will break the iteration.
    var indx = 0;
    if(array.hasNext){// Array is iterator
        while(array.hasNext()) {
            if(itemCallback(array.next(), indx)) return true;
            indx++;
        }
    } else if (array.length){ // Array is JS-array
        for(indx = 0; indx < array.length; indx++) {
            if(itemCallback(array[indx], indx)) return true;
        }
    } else if(array.size) { // Array is Java-list
        for(indx = 0; indx < array.size(); indx++){
            if(itemCallback(array.get(indx), indx)) return true;
        }
    }
    // All fails return.
    return false;
}

var map = function(array, mapFunc){ // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map 
    var newArray = [];
    iterator(array, function(item, indx){
        newArray.push(mapFunc(item, indx));
        return false;
    });
    return newArray;
}

var find = function(array, findFunc){ // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
    var foundItem = null;
    iterator(array, function(item){
        if(findFunc(item)){
            foundItem = item;
            return true;
        }
        return false;
    });
    return foundItem;
}

var assign = function(target, sources){ // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
    for(var key in sources){
        if(!(key in target)){
            target[key] = sources[key];
        }
    }
    return target;
}

var filter = function(array, filterFunc) { // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Filter
    var newArray = [];
    iterator(array, function(item){
        if(filterFunc(item)) newArray.push(item)
    })
    return newArray;
}

var reduce = function(array, reducer, initialValue){ // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
    var cleanArray = map(array, function(item){ return item; });
    if(!initialValue){
        iterator(array, function(item){ // Fetch first item in array, if no initialValue
            initialValue = item; 
            return true; 
        })
        cleanArray = cleanArray.slice(1); // Just array 1 item since initial value is the first item.
    }
    var accumulator = initialValue;

    iterator(cleanArray, function(item, indx) { 
        accumulator = reducer(accumulator, item, indx);
    })
    return accumulator;
}

var console = (function(){
	var VersionUtil = require('VersionUtil');
	var isEdit = VersionUtil.getCurrentVersion() === VersionUtil.OFFLINE_VERSION;
	return {
		log: function(msg){
			out.println(msg);
		},
		debug: function(msg) {
			if(isEdit) {
				out.println(msg)
			}
		}
	}
})()
var getCookie = function(cookieName) {
	var cookies = request.getCookies();
	return find(cookies, function(cookie) {
		return cookie.getName() == cookieName
	});
}

var isCookieSet = function(cookieName, cookieValue) {
    try {
		var cookie = getCookie(cookieName);
		return cookie && cookie.getValue() == cookieValue ;
    } catch(e){
        return false;
    }
}
