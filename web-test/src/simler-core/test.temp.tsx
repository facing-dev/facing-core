import Logger from '@/logger'
export default function () {
  Logger.debug('render',arguments)
  return <div >{'1'}{'2'}<div a="1" key=""><div a="2">1</div>1<div a="3"></div></div></div>
}


