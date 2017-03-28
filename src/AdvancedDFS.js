import Strategy from './Strategy'

class AdvancedDFS extends Strategy{
    constructor(state){
        super(state)
    }

    selector(){
        throw new Error('Missing implementation')
    }
}

export default AdvancedDFS