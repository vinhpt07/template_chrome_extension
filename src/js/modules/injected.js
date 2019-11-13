
export default () => ((function(xhr) {

    var XHR = XMLHttpRequest.prototype;

    var open = XHR.open;
    var send = XHR.send;
    var setRequestHeader = XHR.setRequestHeader;

    XHR.open = function(method, url) {
        this._method = method;
        this._url = url;
        this._requestHeaders = {};
        this._startTime = (new Date()).toISOString();

        return open.apply(this, arguments);
    };

    XHR.setRequestHeader = function(header, value) {
        this._requestHeaders[header] = value;
        return setRequestHeader.apply(this, arguments);
    };

    XHR.send = function(postData) {

        this.addEventListener('load', function() {
            var endTime = (new Date()).toISOString();

            var myUrl = this._url ? this._url.toLowerCase() : this._url;
            if(/venue_management/.test(myUrl)) {
                var parseHTML = (html) => {
                    let t = document.createElement('template');
                        t.innerHTML = html;
                    return t.content.cloneNode(true);
                };
                if (postData) {
                    if (typeof postData === 'string') {
                        try {
                            // here you get the REQUEST HEADERS, in JSON format, so you can also use JSON.parse
                            this._requestHeaders = postData;    
                        } catch(err) {
                            console.log('Request Header JSON decode failed, transfer_encoding field could be base64');
                            console.log(err);
                        }
                    } else if (typeof postData === 'object' || typeof postData === 'array' || typeof postData === 'number' || typeof postData === 'boolean') {
                            // do something if you need
                    }
                }

                // here you get the RESPONSE HEADERS
                var responseHeaders = this.getAllResponseHeaders();

                if ( this.responseType != 'blob' && this.responseText) {
                    // responseText is string or null
                    try {

                        // here you get RESPONSE TEXT (BODY), in JSON format, so you can use JSON.parse
                        var arr = this.responseText;

                        // printing url, request headers, response headers, response body, to console

                        //console.log(this._url);
                        //console.log(JSON.parse(this._requestHeaders));
                        //console.log(responseHeaders);
                        arr = JSON.parse(arr).venues;
                        console.log(arr);                        

                    } catch(err) {
                        console.log("Error in responseType try catch");
                        console.log(err);
                    }
                    var shadow;
                    document.querySelectorAll('.card-title').forEach(el=>{
                        if (el.innerHTML=="Search results")
                        shadow = el.closest('div.shadow.card');
                    })
                    var score = (shadow.querySelector('tr').childNodes[1].innerText=="Score")
                    ?shadow.querySelector('tr').childNodes[1]
                    :parseHTML(`<th class="MuiTableCell-root MuiTableCell-head" scope="col">
                                                  <span class="MuiButtonBase-root MuiTableSortLabel-root" tabindex="0" role="button">Score
                                                  <svg class="MuiSvgIcon-root MuiTableSortLabel-icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                                                  <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"></path></svg></span></th>`);
                    shadow.querySelector('tr').insertBefore(score,shadow.querySelector('tr').childNodes[1]);
                    shadow.querySelectorAll('table tr[role]').forEach((tr,key)=>{

                        let node = (parseFloat(tr.childNodes[1].innerText) >=0)                        
                        ?tr.childNodes[1]
                        :document.createElement('td');
                        node.setAttribute("class","MuiTableCell-root MuiTableCell-body");
                        node.innerHTML = arr[key].score;
                        
                        tr.insertBefore(node,tr.childNodes[1]);
                        
                        
                    });
                    let lastChecked = null;    
                    document.querySelectorAll('input[type="checkbox"]').forEach((el,k)=>    {
                        if (k ==0) return;
                        el.addEventListener('click',function(e){
                            if(!lastChecked) {
                                lastChecked = this;
                                document.getElementById('showselected').innerHTML=document.querySelectorAll('input[type="checkbox"]:checked').length;
                                return;
                            }
                            if(e.shiftKey) {
                                //let start = Array.from($chkboxes).indexOf(this);
                                //let end = Array.from($chkboxes).indexOf(lastChecked);

                                //Array.from($chkboxes).slice(Math.min(start,end), Math.max(start,end)+ 1).forEach(cel=>{cel.setAttribute("checked", lastChecked.checked)});
                                var that = lastChecked;
                                while(true){
                                    if (this.getBoundingClientRect().top - that.getBoundingClientRect().top >0){
                                        that = that.closest('tr').nextElementSibling.querySelector('input[type=checkbox]');
                                    }else{
                                        that = that.closest('tr').previousElementSibling.querySelector('input[type=checkbox]');
                                    }                                        
                                    that.click();
                                    
                                    if (that==this)
                                        break;
                                }
                                
                                    
                                

                            }

                            lastChecked = this;
                            document.getElementById('showselected').innerHTML=document.querySelectorAll('input[type="checkbox"]:checked').length;
                        })
                    });
                }

            }
        });

        return send.apply(this, arguments);
    };
    
    XHR.isInjected = true;
})(XMLHttpRequest)
);