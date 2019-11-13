
import helpers from './helpers';
/**
 *  @file mvc.js
 *  @github https://github.com/w3cj/vanilla-js-mvc
 */
 
/**
 *  @brief Router
 *  
 *  @param [in] app Description for app
 *  @return Return description
 *  
 *  @details More details       
 */
class Router {
  constructor(app) {
    this.app = app;
    this.routes = [];
    this.hashChange = this.hashChange.bind(this);    
    
    window.addEventListener('hashchange', this.hashChange);
    window.addEventListener('locationchange', this.hashChange);
    window.addEventListener('load', this.hashChange);
    
  }
  addRoute(name, urlPattern) {
    this.routes.push({
      name,
      urlPattern
    });
  }
  hashChange() {

    const path = window.location.pathname;
    const route = this.routes.find(route => path.match(new RegExp(route.urlPattern)));
    console.log(route);
    if(route) {
      //this.params = new RegExp(route.url).exec(path);
      this.app.showComponent(route.name);
    }
  }
  injectEventLocationChange(){

    (function() {
      if (typeof window.CustomEvent === "function") return false; // If not IE
      function CustomEvent(event, params) {
        params = params || {bubbles: false, cancelable: false, detail: null};
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
      }
      window.CustomEvent = CustomEvent;
    })();

    (function() {
      history.pushState = function (f) {
        return function pushState() {
          var ret = f.apply(this, arguments);
          window.dispatchEvent(new CustomEvent("pushState"));
          window.dispatchEvent(new CustomEvent("locationchange"));
          return ret;
        };
      }(history.pushState);
      history.replaceState = function (f) {
        return function replaceState() {
          var ret = f.apply(this, arguments);
          window.dispatchEvent(new CustomEvent("replaceState"));
          window.dispatchEvent(new CustomEvent("locationchange"));
          return ret;
        };
      }(history.replaceState);
      window.addEventListener("popstate", function() {
        window.dispatchEvent(new CustomEvent("locationchange"));
      });
    })();

  }
}

/**
 *  @brief Brief description
 *  
 *  @param [in] selector Description for selector
 *  @return Return description
 *  
 *  @details More details
 */
class App {
  constructor(selector) {
    this.appElement = document.querySelector(selector);
    this.componentsByName = {};
  }
  addComponent(component) {
    this.componentsByName[component.name] = component;
    component.model = this.proxify(component.model);
  }
  showComponent(name) {
    this.timestamp = new Date().getTime();
        
    this.currentComponent = this.componentsByName[name];
    console.log(name);
    if(this.currentComponent) {
        this.currentComponent.model.state = {'id':this.timestamp,'name':name};        
        this.currentComponent.controller(this.currentComponent.model,this.currentComponent.view);
    }
  }
  proxify(model) {
    const self = this;
    return new Proxy(model, {
      set(target, property, value) {
        if (target[property] !=undefined){
            chrome.storage.sync.get('name',item=>{
                if (item.name ==value.name)
                    value.id=undefined                
            })

        }
        chrome.storage.sync.set(value);  
        console.log('Changing', property, 'from', target[property], 'to', value);
        target[property] = value;
        //self.updateView();
        return true;
      }
    });
  }
}

export {App,Router}