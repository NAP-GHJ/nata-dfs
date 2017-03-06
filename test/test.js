//const DFSMonkey =require('../lib/DFSMonkey.js')

import DFSMonkey from '../src/DFSMonkey.js'

const pkg = 'com.cvicse.zhnt'
  //const deviceId = 'DU2SSE1478031311'
const deviceId = 'd53ef30'
const act = '.LoadingActivity'
let monkey

monkey = new DFSMonkey(pkg, act, deviceId)

console.log('Hello')