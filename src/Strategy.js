/**
 * Strategy interface  
 */

class Strategy{

    constructor(state){
        this.currentState = state;
    }

    getState(){
        return this.currentState
    }

    selector(){
        throw new Error('Missing implementation')
    }

}

export default Strategy