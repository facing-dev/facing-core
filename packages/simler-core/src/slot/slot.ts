import { Component } from '../component/component'
import { Application } from '../application'
import { VNodeComponent } from '../vdom/vnode/vnode'

const SimlerSymbol = Symbol('Simler/Simler')

export class Slot {
    application: Application
    component: SlotComponent
    vnode: VNodeComponent | null = null
    constructor(opt: {
        component: SlotComponent
        application: Application
    }) {
        this.component = opt.component
        this.application = opt.application
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


