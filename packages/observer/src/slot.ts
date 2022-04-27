
import type { ObserverRefrenceAgent } from './observer'
interface SlotReference {
    slot: Slot,
    // referenceCount: number
}

const ObjectObserverSymbol = Symbol('Facing/Observer')

export function isObservableType(obj: any): obj is ObservableTypes {
    if (obj === null) {
        return false
    }
    if (Array.isArray(obj)) {
        return true
    }
    if (typeof obj === 'object') {
        return true
    }
    return false
}

type MakeTypesObservable<T extends Object> = T & {
    [ObjectObserverSymbol]?: Slot
}

export type ObservableTypes = MakeTypesObservable<Array<any> | { [index: string]: any }>

export class Slot {
    #slotReferences: Map<Slot, SlotReference> = new Map()
    #objectObserverRefrenceAgents: Map<ObserverRefrenceAgent<any>, ObserverRefrenceAgent<any>> = new Map()
    bundleCalledSymbol: Symbol | null = null
    currentCalledSymbol: Symbol | null = null
    addSlotReference(slot: Slot) {
        if (this.#slotReferences.has(slot)) {
            return
        }
        this.#slotReferences.set(slot, {
            slot
        })
    }
    removeSlotReference(slot: Slot) {
        if (!this.#slotReferences.has(slot)) {
            return
        }
        this.#slotReferences.delete(slot)
    }
    get slotReferenceIterator() {
        return this.#slotReferences.values()
    }
    addObjectObserverRefrenceAgent(agent: ObserverRefrenceAgent<any>) {
        if (this.#objectObserverRefrenceAgents.has(agent)) {
            return
        }
        this.#objectObserverRefrenceAgents.set(agent, agent)
    }

    removeObjectObserverRefrenceAgent(agent: ObserverRefrenceAgent<any>) {
        if (!this.#objectObserverRefrenceAgents.has(agent)) {
            return
        }
        this.#objectObserverRefrenceAgents.delete(agent)
    }
    get objectObserverRefrenceAgentIterator() {
        return this.#objectObserverRefrenceAgents.values()
    }
}


export function create(obj: ObservableTypes) {
    if (!get(obj)) {
        Object.defineProperty(obj, ObjectObserverSymbol, {
            enumerable: false,
            value: new Slot()
        })
    }
    return get(obj)!
}

export function get(obj: ObservableTypes) {
    return obj[ObjectObserverSymbol] ?? null
}

