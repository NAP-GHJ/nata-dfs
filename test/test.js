//const DFSMonkey =require('../lib/DFSMonkey.js')

const DFSMonkey = require('../')

const pkg = 'com.zte.heartyservice'
const act = 'com.zte.heartyservice.main.HeartServiceActivity'
  
const deviceId = 'ZTEBV0730'

//let monkey = new DFSMonkey(pkg, act, deviceId)

let monkey = new DFSMonkey( deviceId,pkg, act,
    {action_count:30,setup:[]})

  monkey.play().then(()=>{
    console.log('Done')
  })
