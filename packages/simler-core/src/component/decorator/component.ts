import { Component as Comp } from "../component";

import * as SlotPrototype from '../../slot/slotPrototype'
export function Component(opt:{
    render:(this:Comp)=>void
}){
    return function(cons:typeof Comp){
        let slot = SlotPrototype.create(cons.prototype)
        slot.render = opt.render
    }
}
