import { Record } from './Record'

interface RecordReference {
    record: Record,
    refCount: number
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
    recordReferences: Map<Record, RecordReference> = new Map()
}


export function create(obj: ObservableTypes) {
    if (!get(obj)) {
        Object.defineProperty(obj, ObjectObserverSymble, {
            enumerable: false,
            value: new Slot()
        })
    }
}

export function get(obj: ObservableTypes) {
    return obj[ObjectObserverSymble] ?? null
}

