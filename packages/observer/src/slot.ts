
import type { ObserverRefrenceAgent, Observer } from './observer'
import Logger from './logger'
import { bfs } from './utils'
// interface SlotReference {
//     slot: Slot,
//     // referenceCount: number
// }

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
    /**
     * Avoid this slot be proxy scheduled many time in one tick
     * Acitent slots of this slot will be proxy scheduled
     */
    // #slotReferences: Map<Slot, SlotReference> = new Map()

    /**
     * The agents comain this slot
     * These agents are the ports to the users
     * Proxy should be release if this map is empty, but we could ignore this for reuseable reason
     */
    readonly #objectObserverRefrenceAgents: Map<ObserverRefrenceAgent<any>, ObserverRefrenceAgent<any>> = new Map()
    //Avoid this slot be proxy scheduled many time in one tick
    bundleCalledSymbol: Symbol | null = null
    //Flag used by proxy schedule strategy to avoid this slot be proxy scheduled many time in one tick
    currentCalledSymbol: Symbol | null = null
    //Flag for gabbage collection
    #garbageCollectionSymbol: Symbol | null = null
    //Manager observer
    readonly #observer: Observer
    constructor(observer: Observer) {
        this.#observer = observer
    }
    addParentSlot(slot: Slot) {
        return this.#observer.addRelativeSlot(this, slot, 'PARENT')
        // if (this.#slotReferences.has(slot)) {
        //     return
        // }
        // this.#slotReferences.set(slot, {
        //     slot
        // })
    }
    removeParentSlot(slot: Slot) {
        // this.#observer.removeRelativeSlot(this, slot, 'PARENT')
        const ret = this.#removeParentSlotNoRelease(slot)
        this.#tryRelease()
        return ret

        // if (!this.#slotReferences.has(slot)) {
        //     return
        // }
        // this.#slotReferences.delete(slot)
    }
    #removeParentSlotNoRelease(slot: Slot) {
        return this.#observer.removeRelativeSlot(this, slot, 'PARENT')
    }
    #tryRelease() {
        const symbol = Symbol()
        function couldRelease(slot: Slot) {
            let ret: boolean | undefined = undefined
            if (slot.#objectObserverRefrenceAgents.size === 0) {
                let parentSlots = slot.parentSlots
                // let parentSlotSet = slot.#observer.getParentSlotSet(slot)
                if (!parentSlots) {
                    Logger.warn('')
                    ret = true
                } else {
                    ret = true
                    for (const ite of parentSlots) {
                        if (symbol !== ite.#garbageCollectionSymbol) {
                            ret = false
                            break
                        }
                    }
                }
            }
            if (ret === undefined) {
                ret = false
            }
            if (ret === true) {
                slot.#garbageCollectionSymbol = symbol
            }

            return ret
            // Array.from(parentSlotSet)
            // if (!releaseParentSlot) {
            //     if (parentSlotSet.size > 0) {
            //         return false
            //     }
            //     return true
            // } else {
            //     if (parentSlotSet.size === 0) {
            //         Logger.warn('')
            //     }
            //     if (parentSlotSet.size === 1 && parentSlotSet.has(releaseParentSlot)) {
            //         return true
            //     }
            //     return false

            // }
        }
        if (!couldRelease(this)) {
            return
        }

        bfs<Slot>(this, (current) => {
            const childSlots = current.childSlots
            if (!childSlots) {
                return null
            }
            let arr: Slot[] | null = null
            for (const childSlot of childSlots) {
                if (couldRelease(childSlot)) {
                    if (!arr) {
                        arr = []
                    }
                    arr.push(childSlot)
                } else {
                    childSlot.#removeParentSlotNoRelease(current)
                }
            }
            return arr
        })
    }
    // get slotReferenceIterator() {
    //     return this.#slotReferences.values()
    // }
    get parentSlots() {
        return this.#observer.getParentSlotSet(this)?.values()

    }
    get childSlots() {
        return this.#observer.getChildSlotSet(this)?.values()


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
        this.#tryRelease()

    }
    get objectObserverRefrenceAgentIterator() {
        return this.#objectObserverRefrenceAgents.values()
    }
}


export function create(obj: ObservableTypes, observer: Observer) {
    if (!get(obj)) {
        Object.defineProperty(obj, ObjectObserverSymbol, {
            enumerable: false,
            value: new Slot(observer)
        })
    }
    return get(obj)!
}

export function get(obj: ObservableTypes) {
    return obj[ObjectObserverSymbol] ?? null
}


