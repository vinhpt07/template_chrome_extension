/**
 *  @file reload.js
 *  @brief For tracking version and update Package
 */
 
import {default as helpers} from '../helpers';


/**
 *  @brief PackageModel
 *  
 *  @details More details
 */

class PackageModel
{
    constructor(){
        this.manifestData = chrome.runtime.getManifest();
    }
    
    get version(){
        return this.manifestData.version;
    }
    
}
/**
 *  @brief PackageView on Popup
 *  
 *  @details More details
 */
class PackageView
{
    constructor(){
        let span = helpers.html('span','Reload');
        this.btn_reload = helpers.html('button','',{'class':'button'});        
        this.btn_reload.appendChild(span);
    }
    
    displayButton(){
        let content = document.querySelector('.contents');
        content.appendChild(this.btn_reload);
    }
    
    bindButtonReload(handler) {
      this.btn_reload.addEventListener('click', event => {
          event.preventDefault();
          handler();

      })
    }    
}
/**
 *  @brief Package Controller
 *  
 *  @param model
 *  @param view
 *
 *  @details More details
 */
class PackageController
{
    constructor(model,view){
        this.model = model
        this.view = view       
    }
    
    handleDisplayBadget(){
        //background
        chrome.browserAction.setBadgeText({"text":this.model.version});
    }
    
    onDisplayButton(){
        this.view.displayButton();        
    }
    
    handleButtonReload(){
        //message to background
        chrome.runtime.sendMessage({action:'reload'});
    }
    
    handleMessageReceived(){
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
            if (request.action == 'reload'){
                chrome.runtime.reload();
                console.log('reload');
            }
        })
    }
    popup(){
        //do binding
        this.view.bindButtonReload(this.handleButtonReload);
        //do render
        this.onDisplayButton();        
    }
    
    background(){
        this.handleDisplayBadget();
        this.handleMessageReceived();
    }
}


export default () => {
    return new PackageController(new PackageModel, new PackageView);
}