
/**
 * Object.prototype.forEach() polyfill
 * https://gomakethings.com/looping-through-objects-with-es6/
 * @author Chris Ferdinandi
 * @license MIT
 *
 * prototype.js
 */
 
module.exports=(function () {

	if (!Object.prototype.forEach) {
		Object.defineProperty(Object.prototype, 'forEach', {
			value: function (callback, thisArg) {
				if (this == null) {
					throw new TypeError('Not an object');
				}
				thisArg = thisArg || window;
				for (var key in this) {
					if (this.hasOwnProperty(key)) {
						callback.call(thisArg,  key, this[key],this);
					}
				}
			}
		});
	}
	
}());
//Element
Element.prototype.trigger = function(eventName){
  var event;
  if (window.CustomEvent) {
    event = new CustomEvent(eventName);
  } else {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(eventName, true, true);
  }
  this.dispatchEvent(event);
};
Element.prototype.disable = function(){
    this.value = '';
    this.setAttribute('disabled',true);
    this.style.backgroundColor = 'lightgray';    
};
Element.prototype.enable = function(){
    this.removeAttribute('disabled');
    this.removeAttribute('style'); 
};
Element.prototype.readOnly = function(){
    this.setAttribute('readonly',true);
	this.removeAttribute('disabled'); 
};

//String
String.prototype.toDate = function(format) {
    format = format || "dmy";
    var separator = this.match(/[^0-9]/)[0];
    var re = new RegExp(separator, 'g');
    var components = this.split(separator);
    format = format.replace(re, '');
    var day, month, year;
    for (var key in format) {
        var fmt_value = format[key];
        var value = components[key];
        switch (fmt_value) {
            case "d":
                day = parseInt(value);
                break;
            case "m":
                month = parseInt(value)-1;
                break;
            case "y":
                year = parseInt(value);
            case "Y":
                year = parseInt(value);                
        }
    }
    return new Date(year, month, day);
};

//Date
Date.prototype.format = function(format) {
    format = format || "d/m/Y";
    format = format.replace(/d/,'$2');
    format = format.replace(/m/,'$1');
    format = format.replace(/[yY]/,'$3');
    return this.toLocaleString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit'}).replace(/(\d+)\/(\d+)\/(\d+)/, format)
}
Date.prototype.nearestLastWed = function(){
    let d = this;
  for (let i=0; i<7; i++){
        d.setDate(d.getDate()-i);
    if (d.getDay()==3) return d;
    }  
};