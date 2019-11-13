
import helpers from '../helpers';

class Build
{
    constructor(model){
        this.left = document.querySelector('.module-box').nextElementSibling;
        this.header = document.querySelector('.module-box .module-box-header');
        this.statusBuild = this.left.querySelector('h4');
        this.url = ''
        //this.render();
    }

    render(){
        //this.reformat();
        //
        //this.floatbutton();
        if(!document.querySelector('#addChip')) {
            this.addChip();
        }else{
            return;
        };

        Reflect.apply(this.hightlightBuildStatus,this,[]);
        Reflect.apply(this.handlerCompletedBtn,this,[]);
        document.addEventListener('keydown', this.hotkey, false);
    }
    addChip(){
        let node = document.createElement('span');
        node.id = 'addChip';
        this.left.appendChild(node);
        
    }        
    handlerCompletedBtn(){
        let btn = this.left.querySelector('button[type=submit]');
        let content = document.createTextNode("++");
        btn.querySelector('span.MuiButton-label').appendChild(content);
        btn.addEventListener('click',(()=>{
            const convertTableToArray = () => {
                let header = this.header;
                let arr= [
                    header.querySelector('h3').nextElementSibling.textContent,//guid
                    header.querySelector('h3').textContent,//business name
                    document.querySelector('h4.user-name').textContent,//cretead
                    document.querySelector('h4.user-name').textContent//log
                    
                ]
                return JSON.stringify([arr]);    
            }
            helpers.ajax('https://schneider.officience.com/advanced/frontend/web/index.php?r=ueni%2Fdefault%2Fguid-completed','POST',convertTableToArray.apply(this))
            .then((response)=>{console.log(response)})
        }).bind(this))
    }
    reformat(){
        let style = helpers.parseHTML(`<style>
                            .float{
                                position:fixed;
                                width:60px;
                                height:60px;
                                bottom:40px;
                                right:40px;
                                background-color:#0C9;
                                color:#FFF;
                                border-radius:50px;
                                text-align:center;
                                box-shadow: 2px 2px 3px #999;
                                
                            }

                            .my-float{
                                margin-top:22px;
                            }
                        </style>`);
        document.querySelector('head').appendChild(style);                
    }
    hightlightBuildStatus(){
        if (!/LOW/.test(this.statusBuild.innerText)){
            this.statusBuild.style.color = 'red';
        }
    }
    floatbutton(){
        let node = helpers.html('span','',{'class':'float'});
        node.innerHTML = '<span class="glyphicon glyphicon-transfer my-float">SW</span>';
        node.addEventListener('click',()=>{this.left.style.display = this.left.style.display =='none'? null:'none';});

        document.querySelector('body').appendChild(node);                        
    }        
    hotkey(e){       
        //e.stopPropogation();
        
        //alert(2);65: A; 68:D  83:S ; 67:C; 76:L; 32:{space}; 9: {tab}; 72 :H
        //81: Q 69:E
        let header = document.querySelector('.module-box .module-box-header');
        var key = e.which || e.keyCode;     
        let click = new Event('click', { bubbles: true });
        if ((e.altKey) && key == 81){
            e.preventDefault();
            header.lastChild.firstChild.dispatchEvent(click);
            document.querySelector('#notes textarea').focus();
        }
        if ((e.altKey) && key == 69){            
            e.preventDefault();
            header.lastChild.lastChild.click();
        }  
        if ((e.altKey) && key == 83){            
            
            e.preventDefault();
                const convertTableToArray = () => {

                    let arr= [
                        header.querySelector('h3').nextElementSibling.textContent,//guid
                        header.querySelector('h3').textContent,//business name
                        document.querySelector('h4.user-name').textContent,//cretead
                        document.querySelector('h4.user-name').textContent//log
                        
                    ]
                    return JSON.stringify([arr]);    
                }
                helpers.ajax('https://schneider.officience.com/advanced/frontend/web/index.php?r=ueni%2Fdefault%2Fguid-completed','POST',convertTableToArray.apply(this))
                .then((response)=>{console.log(response)})

        }  

        return false;

    }
}

export default Build;