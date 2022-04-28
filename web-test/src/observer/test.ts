import { createLogger } from '../logger'

import { Observer, Record } from '@facing/observer/src/index'





export default async function () {
    const Logger = createLogger('observer')




    let observer = new Observer()


    let record = new Record()
    record.watchers.push(function () {
        Logger.debug('wat', arguments)
    })
    let obj: any[] = []
    let agent = observer.observe(obj, {
        record
    });
    obj = (window as any).p = agent.object


    obj.push({})
    obj.push({})
    obj.push({})
    Logger.debug('----')
    obj[0].s = 123
    Logger.debug('----')
    obj[0].s = {}
    Logger.debug('----')
    obj[0].s.f = 123
    // console.log()
    // delete z[0].s.f

}
