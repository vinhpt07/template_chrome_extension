
const import_package =  require('./modules/background/package.js');


//


const controller = import_package.default();
console.log(controller);
controller.popup();