import { Component } from '../component/component'

const SimlerSymbol = Symbol('Simler/Simler')

export class Slot {

}

type SlotComponent = Component & {
    [SimlerSymbol]?: Slot
}


export function create(comp: SlotComponent) {
    if (!get(comp)) {
        Object.defineProperty(comp, SimlerSymbol, {
            enumerable: false,
            value: new Slot()
        })
    }
    return get(comp)!
}

export function get(comp: SlotComponent) {
    return comp[SimlerSymbol] ?? null
}

