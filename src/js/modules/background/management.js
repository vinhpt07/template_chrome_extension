
import helpers from '../helpers';

class Management2
{
    constructor(model){
        this.table = document.querySelector('input[type="checkbox"]').closest('table'); 
        //this.render();
    }
    addHeader(){
        let firstChild = this.table.querySelector('tr:nth-child(1)'),
            node = helpers.parseHTML('<td><b>GUID</b></td>'),
            std = firstChild.querySelector('td:nth-child(2)')
            ;
        firstChild.insertBefore(node,std);    
        
    }
    addRow(){
        let rows = this.table.querySelectorAll('tr:not(:nth-child(1))');
        rows.forEach((el)=>{
            let quid = el.querySelector('td:nth-child(1) input').id,
                node = helpers.parseHTML(`<td><b>${quid}</b></td>`),
                std = el.querySelector('td:nth-child(2)');
            el.insertBefore(node,std);  
        })
        
    }
    addShiftClick(){
        
        if (this.addShiftClick.done) return;
        
        let countSelected = () =>{
            let node = document.getElementById('countSelected') || document.createElement('span');
            node.style.color ='red';
            node.style.marginLeft ='30px';
            node.setAttribute('id','countSelected');
            let div = document.querySelector('input[type="checkbox"]').closest('div');
            node.innerHTML = document.querySelectorAll('input[type="checkbox"][id]:checked').length
            if (div.children.length ==1){
                div.insertBefore(node,div.firstChild);
            }
        }
        const eventClick = function(e) {
            if(!lastChecked) {
                lastChecked = this;
                return;
            }
            if(e.shiftKey) {
                let start = Array.from($chkboxes).indexOf(this);
                let end = Array.from($chkboxes).indexOf(lastChecked);

                Array.from($chkboxes).slice(Math.min(start,end), Math.max(start,end)+ 1).forEach(cel=>{cel.setAttribute("checked", lastChecked.checked)});

            }

            lastChecked = this;
            countSelected();
                            
        }
        let lastChecked = null;
        let $chkboxes = document.querySelectorAll('input[type="checkbox"][id]');
        let shiftClick = () => {            
            $chkboxes.forEach(el=>{
                el.removeEventListener('click',eventClick);
                el.addEventListener('click',eventClick);
            
            });
        }
        console.log('do');
        this.addShiftClick.done = true;
        return shiftClick();
    }
    addSortTable(n){
        (function sortTable(n) {
              var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
              table = document.querySelector('input[type="checkbox"]').closest('table');
              
              switching = true;
              // Set the sorting direction to ascending:
              dir = "asc"; 
              /* Make a loop that will continue until
              no switching has been done: */
              while (switching) {
                // Start by saying: no switching is done:
                switching = false;
                rows = table.rows;
                /* Loop through all table rows (except the
                first, which contains table headers): */
                for (i = 1; i < (rows.length - 1); i++) {
                  // Start by saying there should be no switching:
                  shouldSwitch = false;
                  /* Get the two elements you want to compare,
                  one from current row and one from the next: */
                  
                  x = rows[i].getElementsByTagName("td")[n];
                  y = rows[i + 1].getElementsByTagName("td")[n];
                  /* Check if the two rows should switch place,
                  based on the direction, asc or desc: */
                  if (dir == "asc") {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                      // If so, mark as a switch and break the loop:
                      shouldSwitch = true;
                      break;
                    }
                  } else if (dir == "desc") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                      // If so, mark as a switch and break the loop:
                      shouldSwitch = true;
                      break;
                    }
                  }
                }
                if (shouldSwitch) {
                  /* If a switch has been marked, make the switch
                  and mark that a switch has been done: */
                  rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                  switching = true;
                  // Each time a switch is done, increase this count by 1:
                  switchcount ++; 
                } else {
                  /* If no switching has been done AND the direction is "asc",
                  set the direction to "desc" and run the while loop again. */
                  if (switchcount == 0 && dir == "asc") {
                    dir = "desc";
                    switching = true;
                  }
                }
              }
              //shiftClick();
        })(n);
        this.addShiftClick();
    }
    addMorePagination(){
        let selectElement = document.getElementById('pagination');
        ['200','500','1000'].forEach((v)=>{
            let optionEL = document.createElement( 'option' );
            optionEL.value = optionEL.text = v;
            selectElement.add( optionEL );
        })            
    }
    importGUID(){
        const convertTableToArray = () => {
            let tr = document.querySelector('input[type="checkbox"]').closest('table').querySelectorAll('table.table tr:not(:first-child)');
            let arr= Array.from(tr).filter(el=>el.querySelector('input[type=checkbox]').checked).map((el)=>
                [
                    el.querySelector('td:nth-child(2)').innerText,
                    el.querySelector('td:nth-child(3)').innerText,
                    el.querySelector('td:nth-child(4)').innerText,
                    el.querySelector('td:nth-child(5) select').value,
                    el.querySelector('td:nth-child(6) select').value,
                    el.querySelector('td:nth-child(7)').innerText,
                    el.querySelector('td:nth-child(8) textarea').value,
                    el.querySelector('td:nth-child(9)').innerText,
                    el.querySelector('td:nth-child(10)').innerText,
                
                ]
            );      
            return JSON.stringify(arr);    
        }
        helpers.ajax('https://schneider.officience.com/advanced/frontend/web/index.php?r=ueni%2Fdefault%2Fguid-import','POST',convertTableToArray())
        .then((response)=>{console.log(response)})
        
    }
    
    
    render(){
        this.addHeader();
        this.addRow();
        this.addMorePagination();
        //helpers.injectCode(this.addShiftClick,true);
        //helpers.injectCode(this.addSortTable,false);
        this.table.querySelector('tr:nth-child(1) td:nth-child(9)').addEventListener('click',this.addSortTable.bind(this,8));
        this.table.querySelector('tr:nth-child(1) td:nth-child(9)').style.cursor='pointer';
        document.querySelector('input[value="ASSIGN SELECTED"]').addEventListener('click',()=>{
            if (document.getElementById('assignall').value == '24'){
                this.importGUID();
            }
        });
    }
}
class Management
{
    constructor(model){
        
    }
    render(){
        this.reformat();
        this.floatbutton();

    }
    reformat(){
        let style = helpers.parseHTML(`<style>
                            .float{
                                position:fixed;
                                width:40px;
                                height:40px;
                                bottom:10px;
                                left:10px;
                                background-color:#6610f2;
                                color:#FFF;
                                border-radius:50px;
                                text-align:center;
                                box-shadow: 2px 2px 3px #999;
                                
                            }

                            .my-float{
                                font-size:25px;
                            }
                        </style>`);
        document.querySelector('head').appendChild(style);                
    }

    floatbutton(){
        let node = helpers.html('span','',{'class':'float'});
        node.innerHTML = '<span id="showselected" class="my-float">0</span>';
        //node.addEventListener('click',()=>{this.left.style.display = this.left.style.display =='none'? null:'none';});        
        document.querySelector('body').appendChild(node);                        
    }     
}
export default Management;