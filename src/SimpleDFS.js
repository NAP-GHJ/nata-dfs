/**
 * Simple DFS strategy
 */
import Strategy from './Strategy'

class SimpleDFS extends Strategy{
    constructor(state){
        console.log('SimpleDFS Strategy')
        super(state)
    }

    selector(){
        return this.currentState.getNextAction()
    }
}

export default SimpleDFS