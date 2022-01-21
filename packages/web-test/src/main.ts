import * as Observer from '@object-observer/ObjectObserver'
let O = new Observer.ObjectObserver()

let obj:string[]=[]
let p = O.makeObjectObservable(obj,{
    record:Observer.createRecord((record)=>{
        record.watchers.push(function(){
            console.log('wat',arguments)
        })
    })
})

console.log(p.object)
export default function(){}