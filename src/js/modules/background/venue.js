
import helpers from '../helpers';
import {default as Build} from './build';


class Venue {
    constructor(model){
        console.log(model.state);
        this.sideContent = document.querySelector('div.module-side-content');
        this.boxContent = document.querySelector('div.module-box-content');
        this.section_testimonials = this.getElementByInnerHTML('Testimonials','span',this.sideContent);
        this.section_services = this.getElementByInnerHTML('Services','span',this.sideContent);
        this.section_pricelist = this.getElementByInnerHTML('Price List','span',this.sideContent);
        this.section_rawdata = this.getElementByInnerHTML('Raw Data','span',this.sideContent);
        this.state = model.state;
        this.rounded = this.boxContent.querySelector('.rounded.mb-3');
        this.build = new Build(model);
        this.build.render();
        document.addEventListener('readystatechange', (event) => {
            console.log(`readystate: ${document.readyState}\n`);
        });        
    }
    getElementByInnerHTML(innerHTML,selector,root){
        let doc = root || document;
        return Array.from(doc.querySelectorAll(selector)).find(el=>el.innerHTML==innerHTML)
    }
    getElementsByInnerHTML(innerHTML,selector,root){
        let doc = root || document;
        return Array.from(doc.querySelectorAll(selector)).filter(el=>el.innerHTML==innerHTML)
    }
    addImageEvent(e){

        const ratiocal = (ratio1,ratio2) =>{
            
            //return ratio1[0]+':'+(parseFloat(ratio1[0])*parseFloat(ratio2[1])/parseFloat(ratio2[0]));
            return ratio1[0]+':'+parseFloat(ratio1[1]);
        }
        let defaultratio = this.defaultRatio.split('x');
        let img = e.target;
        setTimeout((()=>{
            document.querySelector('i[class="zmdi zmdi-crop zmdi-hc-fw "]').closest('button').addEventListener('click',(()=>{
                setTimeout((()=>{
                    let eventinput = new Event('input', { bubbles: true });
                    let cord = document.querySelector('.ReactCrop__crop-selection');
                    let title = document.getElementById('form-dialog-title');
                    let ratio = document.getElementById('ratio-view') || helpers.parseHTML('<h3 class="text-center" id="ratio-view"></h3>');
                    title.appendChild(ratio);
                    let observer = new MutationObserver(function(mutations) {                        
                        let newratio = [cord.style.width.replace('px',''),cord.style.height.replace('px','')]
                        
                        document.getElementById('ratio-view').innerHTML = ratiocal(newratio,defaultratio);
                    });                    
                    observer.observe(cord, {
                        attributes: true
                    });
                    this.getElementByInnerHTML('Aspect ratio','span',document).previousElementSibling.click();
                    
                    this.getElementByInnerHTML('Ratio X','label',document).nextElementSibling.querySelector('input').value=this.defaultRatio.split('x')[0];
                    
                    this.getElementByInnerHTML('Ratio Y','label',document).nextElementSibling.querySelector('input').value=this.defaultRatio.split('x')[1];
                    
                    this.getElementByInnerHTML('Ratio X','label',document).nextElementSibling.querySelector('input').dispatchEvent(eventinput);
                    this.getElementByInnerHTML('Ratio Y','label',document).nextElementSibling.querySelector('input').dispatchEvent(eventinput);
                    //document.querySelector('i[class="zmdi zmdi-crop zmdi-hc-fw "]').closest('button').click();
                    
                }).bind(this),500)
            }).bind(this));
        }).bind(this),500);
    }
    view(){
        this.rounded.classList.add('row');
        let col =  Math.floor(12/this.rounded.childElementCount);
        Array.from(this.rounded.children).forEach(el=>{
            el.style.margin='0';
            el.classList.add('col-'+col);
            el.firstChild.style.background='antiquewhite';
            if(el.firstChild.innerText=='Raw City'){
                
                let node = el.firstChild.nextElementSibling.querySelector('div.MuiExpansionPanelDetails-root');
                console.log(node);
                node.classList.add('pointer');
                node.addEventListener('click',this.copyToClipboard.bind(null,node.innerText,node));
            }
            
        });
        chrome.storage.sync.get(['id','name'],((item)=>{
           console.log(item.id,item.name ,this.state.id);
           if(item.id == this.state.id)
           this.render();           
        }).bind(this))
    }
    copyToClipboard(text,node) {
      const input = document.createElement('input');
      input.style.position = 'fixed';
      input.style.opacity = 0;
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('Copy');
      document.body.removeChild(input);
      //console.log(node);
      //node.style.backgroundColor = 'red';
      let copied = helpers.parseHTML(`<div role="tooltip" class="MuiTooltip-popper" id="mui-tooltip-95591" style="position: absolute; transform: translate3d(100px, 100px, 0px); top: 0px; left: 0px; will-change: transform;" x-placement="bottom">
        <div class="MuiTooltip-tooltip MuiTooltip-tooltipPlacementBottom" style="opacity: 1; transform: none; transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 133ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;">Copied</div>
       </div>`);
       node.appendChild(copied);
       setTimeout((()=>{
           node.lastChild.remove();
       }).bind(node),2000);
    }    
    render(){}    
}
class PageLayout extends Venue
{
    constructor(model){
        super(model);
        this.defaultRatio='400x190';
    }
    render(){
        this.boxContent.querySelectorAll('div.full-drawer').forEach((el)=>{
            el.addEventListener('click',this.addImageEvent.bind(this));
        })        
    }
    
}
class YourBusiness extends Venue
{
    ContentList = [
        'Your Business',
        'Page Layout',
        'Services',
        'Price List',
        'Gallery',
        'Testimonials',
        'Open / Close',
        'SEO',
        'Sections',
        'Raw Data',
        'Tags',
        'Data Connect',
        'Super Admin',        
    ]
    pattern = {
        'INDIA':{
            'code':'IN',
            'zipcode':'\\d{6}',            
        },
        'CANADA':{
            'code':'CA',
            'zipcode':'[ABCEGHJKLMNPRSTVXY]\\d[ABCEGHJ-NPRSTV-Z][ ]?\\d[ABCEGHJ-NPRSTV-Z]\\d'
        },
        'UNITED STATES':{
            'code':'US',
            'zipcode':'\\d{5}([ \\-]\\d{4})?'
        },
        'UNITED KINGDOM':{
            'code':'GB',
            'zipcode':'((?:[gG][iI][rR] {0,}0[aA]{2})|(?:(?:(?:[a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(?:(?:[a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|(?:[a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))',
        }
    }
    cardTemplate = (card)=>{ 
        return `
        <div class="shadow card">
            <div class="card-body">
                <h3 class="card-title"><span>${card.title}</span></h3>
            </div>
            <div class="row">
                <div class="col-md-12 col-12">
                    <label class="col-3">Zipcode</label><input class="col-4" type="text" value="${card.zipcode.value}">
                    <span class="status col-4">${card.zipcode.status}</span>
                <div>
            </div>
            <div class="row">
                <div class="col-md-12 col-12">
                    <label class="col-3">PhoneNumber</label><input class="col-4" type="text" value="${card.phonenumber.value}">
                    <span class="status col-4">${card.phonenumber.status}</span>
                <div>
            </div>  
            <div class="row" style="margin-bottom:30px"></div>    
        </div>
    `}
    constructor(model){
        super(model);
        //this.render();
        this.defaultRatio='400x120';
    }

    render(){
        this.reArrangeSideContent();
        this.unstickAddress();
        setTimeout(this.verifyZipcode.bind(this),1000);
        this.boxContent.querySelectorAll('div.full-drawer').forEach((el)=>{
            el.addEventListener('click',this.addImageEvent.bind(this));
        })
    }
    reArrangeSideContent(){
        let ul = document.createElement('ul');
        ul.classList.add('module-nav');
        //let sideContent = document.querySelector('div.module-side-content');
        this.ContentList.forEach((section)=>{
            let span = this.getElementByInnerHTML(section,'li span',this.sideContent);
            let li = span ? span.closest('li') : null;
            if (li) ul.appendChild(li);
        })
        let oldul = this.sideContent.querySelector('ul');
        Array.from(oldul.children).forEach(el=>{
            ul.appendChild(el);
        });
        this.sideContent.querySelector('.module-side-scroll.scrollbar>div').replaceChild(ul,oldul);
    }
    hotkey(e,left){       
        //e.stopPropogation();
        
        //alert(2);65: A; 68:D  83:S ; 67:C; 76:L; 32:{space}; 9: {tab}; 72 :H
        var key = e.which || e.keyCode;     

        if ((e.ctrlKey || e.altKey) && key == 72){
            e.preventDefault();
            this.left.style.display = this.left.style.display =='none'? null:'none';

        }
  

        return false;

    }
    unstickAddress(){
        try{
            let addressstick = Array.from(document.querySelectorAll('span')).find(el=>el.innerHTML=='Show address: ').parentElement.nextElementSibling.innerHTML;
            console.log(addressstick);
            if (addressstick=='No'){
                if (document.querySelector('input[name=show_street]').closest('.MuiFormControlLabel-root').querySelector('.Mui-checked'))
                    document.querySelector('input[name=show_street]').click();
                if (document.querySelector('input[name=show_postal_code]').closest('.MuiFormControlLabel-root').querySelector('.Mui-checked'))
                    document.querySelector('input[name=show_postal_code]').click();                                
                if (!document.querySelector('input[name=mobile_merchant]').closest('.MuiFormControlLabel-root').querySelector('.Mui-checked'))
                    document.querySelector('input[name=mobile_merchant]').click();                
            }
            if (addressstick=='Yes'){
                if (!document.querySelector('input[name=show_street]').closest('.MuiFormControlLabel-root').querySelector('.Mui-checked'))
                    document.querySelector('input[name=show_street]').click();
                if (!document.querySelector('input[name=show_postal_code]').closest('.MuiFormControlLabel-root').querySelector('.Mui-checked'))
                    document.querySelector('input[name=show_postal_code]').click();                                
                if (document.querySelector('input[name=mobile_merchant]').closest('.MuiFormControlLabel-root').querySelector('.Mui-checked'))
                    document.querySelector('input[name=mobile_merchant]').click();                
            }            
        }
        catch(e){
            
        }
    }
    verifyZipcode(){
        
        this.country = this.boxContent.querySelector('input[placeholder=Country]').value;
        this.zipcode = this.boxContent.querySelector('input[name="address.postal_code"]').value;
        this.phonenumber = this.boxContent.querySelector('input[name="contact.office_number"]').value
                          || this.boxContent.querySelector('input[name="contact.mobile_number"]').value;       
        this.PhoneNumber = require( 'awesome-phonenumber' );
        
        let countrycode = this.pattern[this.country].code;
        const zipcodecheck = ()=>{            
            let zipcodepattern = new RegExp(this.pattern[this.country].zipcode);
            console.log(zipcodepattern);
            console.log(this.zipcode);
            return zipcodepattern.test(this.zipcode)
            ? 'Correct'
            : 'InCorrect';
            
        }
        const phonecheck = () => {
            if (this.phonenumber =='') return;
            let check = (new this.PhoneNumber(this.phonenumber, countrycode )).toJSON()
            return check.valid
            ? 'Correct - '+check.type
            : 'Incorrect';
        }
        let template = helpers.parseHTML(this.cardTemplate({
            'title':'Verify Zipcode and PhoneNumber',
            'zipcode':{
                'value':this.zipcode,
                'status': zipcodecheck(),
            },
            'phonenumber':{
                'value':this.phonenumber,
                'status':phonecheck(),
            }
        }));
        
        let span = this.getElementByInnerHTML('Address','h3.card-title',this.boxContent);
        //console.log(this.boxContent,span);
        span.closest('div.shadow.card').parentElement.appendChild(template);
        
    }

}

class Services  extends Venue
{

    constructor(model){        
        super(model);        
        this.items = ['2','3','4','5','6'];
        this.addButton = 'Add service';
    }

    render(){

        this.deleteAllGroupButton();
        this.boxContent.querySelectorAll('.card-body input[type=text][placeholder]:not([placeholder=Category])').forEach(el=>{el.addEventListener('keydown',this.hotkey);});
        this.boxContent.querySelectorAll('.card-body input[placeholder="Price"]:not([placeholder=Category])').forEach(el=>{ el.addEventListener('focus',this.setPriceZeroToEmpty)});
        this.getElementsByInnerHTML(this.addButton,'span',this.boxContent).forEach(el=>{
            
                el.closest('button').addEventListener('click',(e)=>{
                    e.preventDefault();                    
                    setTimeout((()=>{
                        let lastchild = e.target.closest('div.shadow.card').querySelector('.card-body>div').lastChild;
                        console.log(lastchild);
                        lastchild.querySelectorAll('.card-body input[type=number][placeholder]:not([placeholder=Category])').forEach(el=>{el.setAttribute('type','text');});
                        lastchild.querySelectorAll('.card-body input[type=text][placeholder]:not([placeholder=Category])').forEach(el=>{el.addEventListener('keydown',this.hotkey);});
                        lastchild.querySelectorAll('.card-body input[placeholder="Price"]:not([placeholder=Category])').forEach(el=>{ el.addEventListener('focus',this.setPriceZeroToEmpty)});                        
                    }).bind(this),200);
                    
                });
            });
            
        this.boxContent.querySelectorAll('.shadow.card:not([id])').forEach(root=>{            
            this.addServiceByNumber(root);
        })  
        this.getElementByInnerHTML('Add group','span',this.boxContent).closest('button').addEventListener('click',this.handleEventAddGroup.bind(this))            
    }
    handleEventAddGroup(){
        setTimeout((()=>{
            this.getElementByInnerHTML(this.addButton,'span',this.boxContent).closest('button').addEventListener('click',(e)=>{
                                        
                setTimeout((()=>{
                    let lastchild = e.target.closest('div.shadow.card').querySelector('.card-body>div').lastChild;
                    console.log(lastchild);
                    lastchild.querySelectorAll('.card-body input[type=number][placeholder]:not([placeholder=Category])').forEach(el=>{el.setAttribute('type','text');});
                    lastchild.querySelectorAll('.card-body input[type=text][placeholder]:not([placeholder=Category])').forEach(el=>{el.addEventListener('keydown',this.hotkey);});
                    lastchild.querySelectorAll('.card-body input[placeholder="Price"]:not([placeholder=Category])').forEach(el=>{ el.addEventListener('focus',this.setPriceZeroToEmpty)});
                }).bind(this),200);
                
            });
            this.boxContent.querySelector('.shadow.card[id]:last-of-type').querySelectorAll('input[type=text][placeholder]:not([placeholder=Category])').forEach(el=>{el.addEventListener('keydown',this.hotkey);});
            this.boxContent.querySelector('.shadow.card[id]:last-of-type').querySelectorAll('input[placeholder="Price"]:not([placeholder=Category])').forEach(el=>{ el.addEventListener('focus',this.setPriceZeroToEmpty)});
        }).bind(this),500);    
/*             setTimeout(()=>{
                this.section_rawdata.click();
                this.section_services.click();
                let card = this.boxContent.querySelectorAll('div.card-body');
                card[card.length-1].scrollIntoView();
                },1000); */        
    }
    deleteAllGroupButton(){

        ["Add group"].forEach((section)=>{
            let span = Array.from(this.boxContent.querySelectorAll('span')).find((el)=>el.innerHTML == section);
            let btn = span.closest('button');
            let card_body = btn.closest('div.card-body');
            let node = helpers.html('button','Delete All',{'class':'btn jr-btn jr-btn-lg MuiButton-containedSecondary','style':'margin:-5px;'});
            node.addEventListener('click',(e)=>{
                e.preventDefault();
                let delete_grp = Array.from(this.boxContent.querySelectorAll('span')).filter((el)=>el.innerHTML == 'Delete group');
                delete_grp.forEach((el)=>{
                    el.closest('button').click();
                })
            })
            card_body.appendChild(node);
        })

    }
    addServiceByNumber(root){
        const delay_loop = (items,callback) => {
            var item  = items.shift(),
                // delay between each loop
                delay = 200;
            if (item==undefined) return;
            
            setTimeout(function(){
                // process array data
                callback(item);
                // recursive call 
                if (items.length)
                    delay_loop(items,callback)
            }, delay);
        };
        let cardheader = helpers.html('div','',{'style':'display: flex;align-items: center;justify-content: center;margin-top:-55px'});
        this.items.forEach(v=>{
            let node = helpers.html('button',v,{'class':'btn jr-btn jr-btn-md MuiButton-textPrimary','style':'background:antiquewhite;','data-value':v});
            node.addEventListener('click',(e)=>{
                e.preventDefault();
                let el = e.target;
                
                let num = parseInt(el.dataset.value);
                let lastcard = this.boxContent.querySelector('.shadow.card[id]:last-of-type');
                let count = lastcard.querySelectorAll('div[tabindex]').length;
                let marray = [...Array(num-count).keys()];
                delay_loop(marray,(()=>{lastcard.querySelector('button').click();}).bind(el))

            })
            cardheader.appendChild(node);
        })

        root.appendChild(cardheader);
    }
    setPriceZeroToEmpty(e){
        let root = e.target;
        if (parseInt(root.value||0) ==0){
            root.value ='';
        }
    }
    hotkey(e){       
        //e.stopPropogation();
        
        //alert(2);65: A; 68:D  83:S ; 67:C; 76:L; 32:{space}; 9: {tab}; 72 :H
        // 38 up; 40 down
        var key = e.which || e.keyCode;     

        if ((e.ctrlKey || e.altKey) && key == 72){
            e.preventDefault();

        }
        if (//(e.ctrlKey || e.altKey || e.shiftKey) && 
            (key == 38 || key ==40)){
            //e.stopPropogation();
            e.preventDefault();
            let node = e.target;
            let nnode=null;
            if (key ==40)
                nnode = node.closest('div[tabindex]').nextElementSibling;
            if (key ==38)
                nnode = node.closest('div[tabindex]').previousElementSibling;            
            if (nnode){
                nnode.querySelector('input[placeholder="'+node.getAttribute('placeholder')+'"]').focus();
            }
        }

        return false;

    }
}
class PriceList extends Services
{
    constructor(model){
        super(model);
        this.items = ['4','5','6','7','8'];
        this.addButton = 'Add Item'
    }
    render(){
        super.render();
    }    
}
class OpenClose  extends Venue
{

    constructor(model){
        super(model);
    }
    addFullandWeekday(){
        let span = this.getElementByInnerHTML('Add hours','span',this.boxContent);
        let div = span.closest('div');
        let callback = {
            fields:[
                'Mon',
                'Tue',
                'Wed',
                'Thu',
                'Fri',
                'Sat',
                'Sun',
            ],
            Full:(e)=>{

                e.preventDefault();
                callback.checkexist();
                callback.fields.forEach(v=>{
                    let span = this.getElementByInnerHTML(v,'span.MuiTypography-root.MuiFormControlLabel-label.MuiTypography-body1',this.boxContent.querySelector('.card-body').lastChild);
                    if (span){
                        if (!span.closest('.MuiFormControlLabel-root').querySelector('.Mui-checked'))
                            span.previousElementSibling.click();
                    }
                    
                })
            },
            Weekdays:(e)=>{
                e.preventDefault();
                callback.checkexist();
                callback.fields.forEach((v,k)=>{
                    let span = this.getElementByInnerHTML(v,'span.MuiTypography-root.MuiFormControlLabel-label.MuiTypography-body1',this.boxContent.querySelector('.card-body').lastChild);
                    if (span){
                        if (!span.closest('.MuiFormControlLabel-root').querySelector('.Mui-checked'))
                            span.previousElementSibling.click();
                        if ((k==5 || k==6) && span.closest('.MuiFormControlLabel-root').querySelector('.Mui-checked'))
                            span.previousElementSibling.click();
                    }
                    
                })
                
            },
            checkexist: ()=>{
                if (this.boxContent.querySelector('.card-body').children.length==0){
                    span.closest('button').click();
                }
            }                
        };
        ['Full','Weekdays'].forEach((v)=>{
            var node = helpers.html('button',v,{'class':'btn jr-btn jr-btn-lg MuiButton-containedSecondary'});
            node.addEventListener('click',callback[v]);
            div.appendChild(node);
            
        })
    }
    render(){
        this.addFullandWeekday();

    }
}
class Testimonials  extends Venue
{

    constructor(model){
        super(model);
    }
    render(){
        /*this.getElementsByInnerHTML('Rating','label',this.boxContent).forEach((el)=>{
             
            el.parentElement.addEventListener('click',()=>{
                setTimeout((()=>{
                    document.querySelector('#menu-rating').addEventListener('keydown',this.hotkey);
                    this.reArrangeRating();
                }).bind(this),500);
                //this.hotkey 
            });
        
        })
        this.getElementByInnerHTML('Add testimonial','span',this.boxContent).closest('button').addEventListener('click',()=>{
            //this.section_rawdata.click();
            //this.section_testimonials.click();
        })*/
        this.addStarSelection();
    }
    addStarSelection(){
        let root = this.boxContent.querySelector('.rounded.mb-3');
        let node = helpers.html('div','',{'style':'display:flex;justify-content:flex-end;position:relative;top:120px;margin-right:30px;z-index:1'});
        
        for(let i=5;i>0;i--){
            let btn = helpers.html('button',i,{'class':'btn jr-btn jr-btn-md MuiButton-textPrimary'});
            let star = helpers.html('i','',{'class':'zmdi zmdi-star text-secondary'});

            let evt = {
                preventDefault(){},
                which:48+i
            }
            btn.addEventListener('click',(e)=>{
                e.preventDefault();
                document.querySelector('#select-rating').click();
                this.hotkey(evt);
            })
            btn.appendChild(star);
            node.appendChild(btn);            
        }
        root.parentElement.insertBefore(node,root);
    }
    reArrangeRating(){
        let ul = document.createElement('ul');
        let oldul = document.querySelector('li[data-value="1"]').closest('ul');
        ul.setAttribute('class','MuiList-root MuiMenu-list MuiList-padding');
        ul.setAttribute('role','listbox');
        ul.setAttribute('tabindex','0');
        
        //let sideContent = document.querySelector('div.module-side-content');
        ['5','4','3','2','1'].forEach((number)=>{
            let li = document.querySelector(`li[data-value="${number}"]`);            
            ul.appendChild(li);
        })
        
        oldul.parentElement.replaceChild(ul,oldul);
    }    
    hotkey(e){       
        //e.stopPropogation();
        
        //alert(2);65: A; 68:D  83:S ; 67:C; 76:L; 32:{space}; 9: {tab}; 72 :H
        // 38 up; 40 down
        //97,98,99,100,101 Numpad 1,2,3,4,5
        //49,50,51,52,53 number 1,2,3,4,5
        
        var key = e.which || e.keyCode;     

        let arrayNumKey = [49,50,51,52,53,97,98,99,100,101]
        if (arrayNumKey.indexOf(key) !=-1){
            //e.stopPropogation();
            e.preventDefault();

            let number = String.fromCharCode((96 <= key && key <= 105)? key-48 : key);
            
            document.querySelector(`li[data-value="${number}"]`).click();
        }

        return false;

    }    
}
class RawData  extends Venue
{

    constructor(model){
        super(model);
    }
}
class SEO  extends Venue
{

    constructor(model){
        super(model);
    }
}     
export {YourBusiness,Services,OpenClose,Testimonials,PriceList,PageLayout,RawData,};