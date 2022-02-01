import Logger from '../logger'
import { Component } from '../component/component'

const SimlerPrototypeSymbol = Symbol('Simler/SimlerPrototype')

export class SlotPrototype {
    componentPrototype: SlotPrototypeComponent
    constructor(opt: {
        componentPrototype: SlotPrototypeComponent
    }) {
        Logger.debug('SlotPrototype constructor',opt,this)
        this.componentPrototype = opt.componentPrototype
    }
    render(this: Component) {

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
