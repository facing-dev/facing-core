import Logger from '@/logger'
import { Observer, Record } from '@facing/observer'
let O = new Observer()

let obj: any[] = []
let record = new Record()
record.watchers.push(function () {
    Logger.debug('wat', arguments)
})

let p = O.observe(obj, {
    record
});

(window as any).p = p.object
let z = p.object

z.push({})
z.push({})
z.push({})
Logger.debug('----')
z[0].s = 123
Logger.debug('----')
z[0].s = {}
Logger.debug('----')
z[0].s.f = 123
console.log(z)
// delete z[0].s.f



export default function () { }
