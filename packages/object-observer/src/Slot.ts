import { Record } from './Record'

interface SlotReference {
    slot: Slot,
    // referenceCount: number
}

const ObjectObserverSymble = Symbol('Simler/ObjectObserver')

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
    [ObjectObserverSymble]?: Slot
}

export type ObservableTypes = MakeTypesObservable<Array<any> | { [index: string]: any }>

export class Slot {
    records: Map<Record, Record> = new Map()
    slotReferences: Map<Slot, SlotReference> = new Map()
    addReference(slot: Slot) {
        if (this.slotReferences.has(slot)) {
            return
        }
        this.slotReferences.set(slot, {
            slot
        })
    }
    removeReference(slot: Slot) {
        if (!this.slotReferences.has(slot)) {
            return
        }
        this.slotReferences.delete(slot)
    }
}


export function create(obj: ObservableTypes) {
    if (!get(obj)) {
        Object.defineProperty(obj, ObjectObserverSymble, {
            enumerable: false,
            value: new Slot()
        })
    }
    return get(obj)!
}

export function get(obj: ObservableTypes) {
    return obj[ObjectObserverSymble] ?? null
}

