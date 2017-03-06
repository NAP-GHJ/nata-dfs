import EventEmitter from 'events'

class Result extends EventEmitter {
  constructor() {
    super()
    // this.widgetSet = new Set()
    this.activitySet = new Set()
    this.stateSet = new Set()
    this.actionList = []
  }

  //addWidget(widget) {
  //  let isNew = true
  //  this.widgetSet.forEach((instance) => {
  //    if (widget.equals(instance)) {
  //      isNew = false
  //    }
  //  })
  //  if (isNew) {
  //    this.widgetSet.add(widget)
  //  }
  //}

  addActivity(activity) {
    let isNew = true
    this.activitySet.forEach((instance) => {
      if (activity === instance) {
        isNew = false
      }
    })
    if (isNew) {
      this.activitySet.add(activity)
      this.emit('activity', activity)
    }
  }

  addState(state) {
    let isNew = true
    this.stateSet.forEach((instance) => {
      if (state.equals(instance)) {
        isNew = false
      }
    })
    if (isNew) {
      this.stateSet.add(state)
    }
  }

  addAction(action) {
    this.actionList.push(action)
    this.emit('action', action.toCommand())
    //if (this.actionList.length % 3 === 0) {
      this.emit('summary', this.summary())
    //}
  }

  summary() {
    return {
      action: this.actionList.length,
      activity: this.activitySet.size,
      // widget: this.widgetSet.size,
      state: this.stateSet.size,
    }
  }

  //生成最短路径
  getActivityLunch(stateNodes){
    stateNodes = this.stateSet
    var map = new Map()
    var actLunch = new Map()

    stateNodes.forEach(node=>{
      const kind = node.kind
      if(kind === 1 || kind === 2){  //NORMAL OLD
        const activity = node.act
        if(map.has(activity)){
          const node2 = map.get(activity)
          if(this.pathLength(node) < this.pathLength(node2)){
            map.set(activity,node)
          }
        }else{
          map.set(activity,node)
        }
      }

    })

    map.forEach((value,key,mapper)=>{
      //console.log(key)
      const actionCommand = this.getPath(value)
      actLunch.set(key,actionCommand)
    })

    //console.log(actLunch)
    return actLunch
  }

  getPath(state){

    //console.log(state)
    var actions = []
    var result = ''
    while(state.fromEdge!= null){
      actions.push(state.fromEdge)
      state = state.fromEdge.fromState
    }

    //console.log("边集"+actions)

    while(actions.length > 0){
      //console.log(actions.length)
      var current = actions.pop()
      //console.log(current+'current')
      result += this.toCommand(current)
    }
    return result
  }

  pathLength(state){
    let len = 0;
    while(state.fromEdge != null){
      len++
      state = state.fromEdge.fromState
    }
    //console.log("路径长度为"+len)
    return len
  }

  toCommand(fromEdge){
    var actionCombine = ''
    const actions = fromEdge.fireActions
    //console.log(actions)
    actions.forEach(action=>{
      actionCombine += action.toCommand()+'\n'
    })
    //console.log("边的组合"+actionCombine)
    return actionCombine
  }
}

export default Result