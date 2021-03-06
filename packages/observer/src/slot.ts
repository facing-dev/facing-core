
import type { ObserverRefrenceAgent, Observer } from './observer'
import Logger from './logger'
import { bfs } from './utils'
import { makeProxy } from './proxy/proxy'
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

    //Flag used by proxy schedule strategy to avoid this slot be proxy scheduled many time in one tick
    currentCalledSymbol: Symbol | null = null
    //Flag for gabbage collection
    #garbageCollectionSymbol: Symbol | null = null
    //Manager observer
    readonly #observer: Observer
    object: ObservableTypes
    proxiedObject: ObservableTypes
    constructor(observer: Observer, object: ObservableTypes) {
        Object.defineProperty(object, ObjectObserverSymbol, {
            enumerable: false,
            value: this
        })
        this.#observer = observer
        this.object = object

        this.proxiedObject = makeProxy(object, observer)

    }
    getParentSlotCount(slot: Slot) {
        return this.#observer.getRelativeSlotCount(this, slot, 'PARENT')
    }
    addParentSlot(slot: Slot) {
        const ret = this.#observer.addRelativeSlot(this, slot, 'PARENT')


        return ret
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
    #clearParentSlotNoRelease(slot: Slot) {
        return this.#observer.clearRelativeSlot(this, slot, 'PARENT')
    }
    #tryRelease() {

        const symbol = Symbol()
        function couldRelease(slot: Slot) {
            let ret: boolean | undefined = undefined
            if (slot.#objectObserverRefrenceAgents.size === 0) {
                let parentSlots = slot.parentSlots
                // let parentSlotSet = slot.#observer.getParentSlotSet(slot)
                if (!parentSlots) {
           
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
            let releaseSet: Set<Slot> | null = null

            for (const childSlot of childSlots) {
          
                if (couldRelease(childSlot)) {

                    if (!arr) {
                        arr = []
                    }
                    arr.push(childSlot)

                } else {

                    if (!releaseSet) {
                        releaseSet = new Set
                    }
                    releaseSet.add(childSlot)


                    // this.released()
                }
            }
            if (releaseSet) {
                for (const slot of releaseSet.values()) {
                    slot.#clearParentSlotNoRelease(current)
                    this.#observer.slotReleasedTestCallback?.(current);
                }
            }

            return arr
        })
    }
    // released() {

    // }
    // get slotReferenceIterator() {
    //     return this.#slotReferences.values()
    // }
    get parentSlots() {
        return this.#observer.getParentSlotMap(this)?.keys()

    }
    get childSlots() {
        return this.#observer.getChildSlotMap(this)?.keys()


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
        new Slot(observer, obj)
        // Object.defineProperty(obj, ObjectObserverSymbol, {
        //     enumerable: false,
        //     value: 
        // })
    }
    return get(obj)!
}

export function get(obj: ObservableTypes) {
    return obj[ObjectObserverSymbol] ?? null
}


