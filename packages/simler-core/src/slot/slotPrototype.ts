import Logger from '../logger'
import { Component } from '../component/component'
import  { VNodeElement,VNode } from 'src/vdom/vnode/vnode'
const SimlerPrototypeSymbol = Symbol('Simler/SimlerPrototype')

export class SlotPrototype {
    componentPrototype: SlotPrototypeComponent
    constructor(opt: {
        componentPrototype: SlotPrototypeComponent
    }) {
        Logger.debug('SlotPrototype constructor',opt,this)
        this.componentPrototype = opt.componentPrototype
    }

    _render(this: Component):VNode {
        throw '_render not implemented'
    }
    render(component:Component):VNodeElement {
        const vnode = this._render.apply(component)
        if(! (vnode instanceof VNodeElement)){
            throw 'root of a component must be a html element'
        }
        return vnode
    }
}

type SlotPrototypeComponent = Component & {
    [SimlerPrototypeSymbol]?: SlotPrototype
}

export function create(componentPrototype: SlotPrototypeComponent) {
    if (!get(componentPrototype)) {
        Object.defineProperty(componentPrototype, SimlerPrototypeSymbol, {
            enumerable: false,
            value: new SlotPrototype({
                componentPrototype: componentPrototype
            })
        })
    }
    return get(componentPrototype)!
}


export function get(comp: SlotPrototypeComponent) {
    return comp[SimlerPrototypeSymbol] ?? null
}
