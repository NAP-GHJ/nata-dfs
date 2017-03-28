import DFSMonkey from '../lib/DFSMonkey.js'
import assert from 'assert'

describe('testing dfs monkey', () => {
  const pkg = 'com.zte.heartyservice'
  const act = 'com.zte.heartyservice.main.HeartServiceActivity'
  
  const deviceId = 'ZTEBV0730'
  // const pkg = 'com.zte.UserHelp'
  //const act = '.UserHelpActivity'
  let monkey

  before(() => {
  })

  it('should get current state', function(done){
    this.timeout(20000000)
    monkey = new DFSMonkey( deviceId,pkg, act,
    {action_count:20,setup:[]})
    monkey.play().then(()=>{
      done()
    })
    //const state = await monkey.getCurrentState()
    //assert.equal(state.pkg, pkg) 
  })
})