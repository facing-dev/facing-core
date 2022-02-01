import Logger from '../logger'
import { Component } from '../component/component'
import { VNodeComponent } from '../vdom/vnode/vnode'

const SimlerSymbol = Symbol('Simler/Simler')

export class Slot {
    component: SlotComponent
    vnode: VNodeComponent | null = null
    constructor(opt: {
        component: SlotComponent
    }) {
        Logger.debug('Slot constructor',opt,this)
        this.component = opt.component
    }
    destroy(){
        if(!this.vnode){
            return
        }
        return this.vnode.destroy()

    }

}

type SlotComponent = Component & {
    [SimlerSymbol]?: Slot
}

export function create(opt: ConstructorParameters<typeof Slot>[0]) {

    if (!get(opt.component)) {
        Object.defineProperty(opt.component, SimlerSymbol, {
            enumerable: false,
            value: new Slot(opt)
        })
    }
    return get(opt.component)!
}

export function get(comp: SlotComponent) {
    return comp[SimlerSymbol] ?? null
}


