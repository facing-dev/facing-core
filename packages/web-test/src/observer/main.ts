import * as Observer from '@observer/observer'
let O = new Observer.ObjectObserver()

let obj:any[]=[]
let p = O.makeObjectObservable(obj,{
    record:Observer.createRecord((record)=>{
        record.watchers.push(function(){
            console.log('wat',arguments)
        })
    })
});

(window as any).p = p.object
let z = p.object
z.push({})
console.log('----')
z[0].s=123
console.log('----')
z[0].s={}
console.log('----')
z[0].s.f=123
delete z[0].s.f

export default function(){}