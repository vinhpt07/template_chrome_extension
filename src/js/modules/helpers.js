//

import './prototypes'

const helpers = {};

helpers.parseHTML = (html) => {
    let t = document.createElement('template');
        t.innerHTML = html;
    return t.content.cloneNode(true);
};

helpers.html = (tag,content='',options) => {
    options = options || {};
	let node = document.createElement(tag);
	if (content){
		let textNode = document.createTextNode(content);
		node.appendChild(textNode);
	}
	if (Object.entries(options).length !== 0 && options.constructor === Object){
		options.forEach( (key,value) => {			
			node.setAttribute(key,value);
		})
	}
	return node;
}

helpers.ajax = (url, method, data) => {
    /**
        
        helpers.ajax('https://some-url.com/posts')
	.then(function (posts) {
		console.log('Success!', posts);
	})
	.catch(function (error) {
		console.log('Something went wrong', error);
	});
               
    
    **/
	var request = new XMLHttpRequest();

	// Return it as a Promise
	return new Promise( (resolve, reject) => {

		// Setup our listener to process compeleted requests
		request.onreadystatechange = function () {

			// Only run if the request is complete
			if (request.readyState !== 4) return;

			// Process the response
			if (request.status >= 200 && request.status < 300) {
				// If successful
				resolve(request);
			} else {
				// If failed
				reject({
					status: request.status,
					statusText: request.statusText
				});
			}

		};

		// Setup our HTTP request
		request.open(method || 'GET', url, true);

		// Send the request
		request.send(data);

	});
}

helpers._param = query => {    
    return new URLSearchParams(window.location.search).get(query);
}
helpers.dateDiff = {

    inDays: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2-t1)/(24*60*60*1000));
    },

    inWeeks: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2-t1)/(24*60*60*1000*7));
    },

    inMonths: function(d1, d2) {
        var d1Y = d1.getFullYear();
        var d2Y = d2.getFullYear();
        var d1M = d1.getMonth();
        var d2M = d2.getMonth();

        return (d2M+12*d2Y)-(d1M+12*d1Y);
    },

    inYears: function(d1, d2) {
        return d2.getFullYear()-d1.getFullYear();
    }
}
helpers.injectCode = function(f,active){
	var injectedCode = f.toString();
	var script = document.createElement('script');
    if (active)
        script.appendChild(document.createTextNode('('+ injectedCode +')();'));
    else
        script.appendChild(document.createTextNode(injectedCode));    
	(document.body || document.head || document.documentElement).appendChild(script);
    
    if(active){
        //var script = Array.from(document.querySelectorAll('script')).find()
        //console.log(script);
        script.remove();
    }
        
}


export default helpers;

