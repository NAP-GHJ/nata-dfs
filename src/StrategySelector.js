import Strategy from './Strategy'

class StrategySelector{
    constructor(strategy){
        this._strategy = strategy 
    }

    selector(){
        return this._strategy.selector()
    }
}

export default StrategySelector;