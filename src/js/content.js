import {Router,App} from './modules/mvc';
import {default as Management} from './modules/background/management';
import {default as Build} from './modules/background/build';
import {Dashboard} from './modules/background/dashboard';
import * as venue from './modules/background/venue';
import helpers from './modules/helpers';

const app = new App('#id');

function wait(count,selector,callback){
    count++;
    console.log(count);
    if (count >= 10) {
		callback();  
		return;
	}
    setTimeout(function(){

        if (!document.querySelector(selector)){
			wait(count,selector,callback);
			console.log('loading..');	
		}else{       
			callback();        
		}
    },1000);
 
}

app.addComponent({
    name:'management',
    model:{},
    view:Management,
    controller(model,view){
       const mngt = new view(model);
       console.log(mngt);
       mngt.render();
    }
            
})
app.addComponent({
    name:'build',
    model:{},
    view:Build,
    controller(model,view){
    }
            
})
app.addComponent({
    name:'dashboard',
    model:{},
    view:Dashboard,
    controller(model,view){
    }
            
})
app.addComponent({
    name:'triage',
    model:{},
    view:Dashboard,
    controller(model,view){
    }
            
})
app.addComponent({
    name:'quality',
    model:{},
    view:Dashboard,
    controller(model,view){
    }
            
})
app.addComponent({
    name:'scoreboard',
    model:{},
    view:Dashboard,
    controller(model,view){
    }
            
})

var divselector='div.rounded.mb-3';//'div.module-box-content';
app.addComponent({
    name:'venue-your_business',
    model:{},
    view:venue.YourBusiness,
    controller(model,view){
        console.log(divselector);
       wait(0,divselector,function(){
           const mngt = new view(model);
           console.log(mngt);
           mngt.view();           
       })

    }
            
})

app.addComponent({
    name:'venue-page_layout',
    model:{},
    view:venue.PageLayout,
    controller(model,view){
       wait(0,divselector,(function(){
           const mngt = new view(model);
           console.log(mngt);
           mngt.view();           
       }))

    }
            
})
app.addComponent({
    name:'venue-services',
    model:{},
    view:venue.Services,
    controller(model,view){
       wait(0,divselector,function(){
           const mngt = new view(model);
           console.log(mngt);
           mngt.view();

       })

    }
            
})
app.addComponent({
    name:'venue-pricelist',
    model:{},
    view:venue.PriceList,
    controller(model,view){
       wait(0,divselector,function(){
           const mngt = new view(model);
           console.log(mngt);
           mngt.view();
       })

    }
            
})
app.addComponent({
    name:'venue-opening_hours',
    model:{},
    view:venue.OpenClose,
    controller(model,view){
       wait(0,divselector,function(){
           const mngt = new view(model);
           console.log(mngt);
           mngt.view();           
       })

    }
            
})
app.addComponent({
    name:'venue-testimonials',
    model:{},
    view:venue.Testimonials,
    controller(model,view){
       wait(0,divselector,function(){
           const mngt = new view(model);
           console.log(mngt);
           mngt.view();           
       })

    }
            
})
app.addComponent({
    name:'venue-raw_data',
    model:{},
    view:venue.RawData,
    controller(model,view){
       wait(0,'div.module-side-content',function(){
           const mngt = new view(model);
           console.log(mngt);
           mngt.view();           
       })

    }
            
})
app.addComponent({
    name:'venue-seo',
    model:{},
    view:venue.RawData,
    controller(model,view){
       wait(0,divselector,function(){
           const mngt = new view(model);
           console.log(mngt);
           mngt.view();           
       })

    }
            
})
const router = new Router(app);
router.addRoute('management', '^/venue/management$');
router.addRoute('build', '^/venue/build$');
router.addRoute('dashboard', '^/venue/dashboard$');
router.addRoute('triage', '^/venue/triage$');
router.addRoute('quality', '^/venue/quality$');
router.addRoute('scoreboard', '^/venue/scoreboard$');
router.addRoute('venue-your_business', '^/venue/build/[^\/]+/your_business$');
router.addRoute('venue-page_layout', '^/venue/build/[^\/]+/page_layout$');
router.addRoute('venue-services', '^/venue/build/[^\/]+/services$');
router.addRoute('venue-pricelist', '^/venue/build/[^\/]+/pricelist$');
router.addRoute('venue-gallery', '^/venue/build/[^\/]+/gallery$');
router.addRoute('venue-tags', '^/venue/build/[^\/]+/tags$');
router.addRoute('venue-testimonials', '^/venue/build/[^\/]+/testimonials$');
router.addRoute('venue-sections', '^/venue/build/[^\/]+/sections$');
router.addRoute('venue-opening_hours', '^/venue/build/[^\/]+/opening_hours$');
router.addRoute('venue-seo', '^/venue/build/[^\/]+/seo$');
router.addRoute('venue-sections', '^/venue/build/[^\/]+/sections$');
router.addRoute('venue-raw_data', '^/venue/build/[^\/]+/raw_data$');

helpers.injectCode(router.injectEventLocationChange,true);