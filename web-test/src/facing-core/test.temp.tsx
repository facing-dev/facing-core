import Logger from './logger'
import { TestComp } from './test'
export default function (this: TestComp) {
  // Logger.debug('render',arguments)
  return <div >{'1'}{'2'}<div a="1" key=""><div a="2">{this.data.num}</div>1<div a="3"></div></div></div>
}


