const touhous = require('./Data.json');
class TouhousInterface{
    data;
    constructor(data = touhous){
        this.data = data
    }
    getRandom(){
        let elem = this.data[Math.floor(Math.random() * this.data.length)];
        delete elem.flag
        return elem;
    }
    dumpData(){
        return this.data;
    }
    getCount(){
        return this.data.length;
    }
}
module.exports = { touhous,TouhousInterface };