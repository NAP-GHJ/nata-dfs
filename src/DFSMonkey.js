import Monkey from './Monkey'
import Strategy from './Strategy'

import _ from 'lodash'
import Edge from './Edge.js'
import State from './State.js'

import SimpleDFS from './SimpleDFS.js'
import AdvancedDFS from './AdvancedDFS.js'
import StrategySelector from './StrategySelector.js'


class DFSMonkey extends Monkey {
  constructor(deviceId, pkg, act, options) {
    super(deviceId, pkg, act, options)
    this.currentActions = []
    this.nodes = []

    this.rootState = null
    this.curState = null

    this.nodeCount = 0
    this.flag = true
  }

  async play() {
    console.log(`DFSMonkey on ${this._deviceId} start playing...`)
    // analyse the apk to run
    console.log('Analyse the apk to get restart action')
    await this.analyseApk()
    // install apk in the device
    await this.installApk()

    //const ccInterval = this.collectCoverage()

    // start app
    await this.startApp()
    
    //setup the app
    await this.setUp()

    // set time out for one second
    // setTimeout(function() {
    //   console.log("Settimeout to wait the app stable")
    // }, 3000);
    await this.wait(2000)

    // record current state
    this.rootState = await this.getCurrentState()
    this.curState = this.rootState
    this.addNode(this.rootState)

    // start loop
    while (this.flag && !(this.curState.fromEdge == null &&!this.curState.isNotOver())) {
      if (this._stopFlag) {
        break
      }

      
      //const action = this.curState.getNextAction()
      //const action = Strategy.simpleDFS(this.curState)

      /*Use different Strategies */
      let action ;
      if(this._strategy == 'simpleDFS'){
        const strategy = new StrategySelector(new SimpleDFS(this.curState))
        action = strategy.selector()
      }else if(this._strategy == 'advancedDFS'){
        const strategy = new StrategySelector(new AdvancedDFS(this.curState))
        action = strategy.selector()
      }else{
        console.log('Default to simpleDFS');
        const strategy = new StrategySelector(new SimpleDFS(this.curState))
        action = strategy.selector()
      }


      if (action === null) {
        //console.log("该状态下的动作执行结束进行回溯")
        this.flag = await this.goBack()
        continue
      }

      await this.executeAction(action)

      const tempNode = await this.getCurrentState()

      const kind = this.classifyNode(tempNode)

      switch (kind) {
        case State.Types.OLD:
          console.log("old state")
          // break;
        case State.Types.OUT:
          this.currentActions.push(action)
          this.addNode(tempNode)
          this.curState = tempNode
          this.flag = await this.goBack()
          break
        case State.Types.SAME:
          console.log('same state')
          break
        default:
          this.currentActions.push(action)
          this.addNode(tempNode)
          this.curState = tempNode
          console.log('new state')
          break
      }
    }

    //clearInterval(ccInterval)
  }

  async startApp() {
    await this.executeAction(this.restartAction)
  }

//Ten seconds to restart the app
  async restartApp() {
    await this.executeAction(this.restartAction)
    const rootPa = this.rootState.pkg
    const rootAct = this.rootState.act
    let count = 0
    const RESTART_TIME_LIMIT = 10
    while (count <= RESTART_TIME_LIMIT) {
      await this.wait(1000)
      if (rootPa === await this.device.getCurrentPackageName()
        && rootAct === await this.device.getCurrentActivity()) {
        break
      }

      count++
    }
  }

  async wait(ms) {
    await this.device.sleep(ms)
  }

//回溯的过程
  async goBack() {
    console.log("进行一次回溯")
    const ee = this.curState.fromEdge
    if (ee !== null) {
      this.curState = ee.fromState

      while (!this.curState.isNotOver()
              && this.curState.fromEdge !== null) {
        this.curState = this.curState.fromEdge.fromState
      }

      const nodesStack = []
      const edgesStack = []

      let tempState = this.curState
      while (tempState.fromEdge != null) {
        edgesStack.push(tempState.fromEdge)
        tempState = tempState.fromEdge.fromState
        nodesStack.push(tempState)
      }
      // attempt to one step back
      if (edgesStack.length > 2) {
        console.log("Length 大于2  BACK")
        await this.executeAction(this.backAction)
      }

      tempState = await this.getCurrentState()

      if (this.curState.equals(tempState)) {
        return true
      }//

      console.log("进行试探性回溯")
      let index = -1
      const len = nodesStack.length
      for (let j = 0; j < len; j++) {
        if (nodesStack[j].equals(tempState)) {
          index = j
          break
        }
      }

      if (tempState != null && index !== -1) {
        while (nodesStack.length !== 0
          && !_.last(nodesStack).equals(tempState)) {
          nodesStack.pop()
          edgesStack.pop()
        }
      } else {
        await this.restartApp()
      }
      while (edgesStack.length !== 0) {
        const pe = edgesStack.pop()
        await this.executeActions(pe.fireActions)
      }

      tempState = await this.getCurrentState()
      if (this.curState.equals(tempState)) {
        console.log("回溯成功")
        return true
      }
      return await this.goBack()
    }
    return true
  }

  classifyNode(state) {
    let k = State.Types.NORMAL
    // out of this App
    if (state.pkg !== this.pkg) {
      state.setKind(State.Types.OUT)
      k = State.Types.OUT
    } else {
        // nothing change
      if (this.curState != null && this.curState.equals(state)) {
        return State.Types.SAME
      }

      // find if old state
      let index = -1
      const len = this.nodes.length
      console.log("nodes len "+len)
      for (let j = 0; j < len; j++) {
        if (this.nodes[j].equals(state)) {
          index = j
          break
        }
      }
      // if it is old state
      if (index !== -1) {
        state.setKind(State.Types.OLD)
        k = State.Types.OLD
      }
    }
    return k
  }

  addNode(toState) {
    if (this.nodeCount !== 0) {
      const edge = new Edge(this.curState, toState, this.currentActions)
      this.curState.addToEdge(edge)
      toState.setFromEdge(edge)
      this.currentActions = []
    }
    this.nodeCount++
    this.nodes.push(toState)
  }
}

export default DFSMonkey



