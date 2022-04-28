import Logger from './logger'
import { Record } from './record'
import { ObservableTypes, get as getSlot } from './slot'
import { makeObserve } from './observe'
import type { Slot } from './slot'
type AgentConstructorOpt = { record?: Record, observer: Observer }
export class ObserverRefrenceAgent<T extends ObservableTypes> {

    public object: T
    records: Map<Record, Record> = new Map()
    readonly observer: Observer
    constructor(obj: T, opt: AgentConstructorOpt) {
        this.object = obj
        this.observer = opt.observer
        let slot = getSlot(obj)
        if (slot) {
            this.object = obj
        } else {
            this.object = makeObserve(obj, this.observer)
            slot = getSlot(this.object)!
        }
        slot.addObjectObserverRefrenceAgent(this)
        if (opt.record) {
            this.addRecord(opt.record)
        }
    }
    addRecord(record: Record) {
        if (this.records.has(record)) {
            Logger.error(self)
            throw 'Record has added'
        }
        this.records.set(record, record)
    }
    removeRecord(record: Record) {
        if (!this.records.has(record)) {
            Logger.error(self)
            throw 'Record not existed'
        }
        this.records.delete(record)
    }
    release() {
        let slot = getSlot(this.object)!
        slot.removeObjectObserverRefrenceAgent(this)
    }
}

export class Observer {
    #parentToChildSlotsMap: Map<Slot, Set<Slot>>
    #childToParentSlotsMap: Map<Slot, Set<Slot>>
    #setRelativeSlot(map: Map<Slot, Set<Slot>>, keySlot: Slot, relativeSlot: Slot): 'EXISTED' | 'SUCCESS' {
        let set = map.get(keySlot)
        if (!set) {
            set = new Set
            map.set(keySlot, set)
        }
        if (set.has(relativeSlot)) {
            // Logger.warn('Relative slot already existed')
            return 'EXISTED'
        }
        set.add(relativeSlot)
        return 'SUCCESS'
    }
    addRelativeSlot(slot: Slot, relativeSlot: Slot, type: 'PARENT' | 'CHILD') {
        let parentSlot = relativeSlot
        let childSlot = slot
        if (type === 'CHILD') {
            parentSlot = slot
            childSlot = relativeSlot
        }

        const ret1 = this.#setRelativeSlot(this.#childToParentSlotsMap, childSlot, parentSlot)
        const ret2 = this.#setRelativeSlot(this.#parentToChildSlotsMap, parentSlot, childSlot)
        if (ret1 !== ret2) {
            throw ''
        }
        return ret1
    }
    #removeRelativeSlot(map: Map<Slot, Set<Slot>>, keySlot: Slot, relativeSlot: Slot): 'NOT EXISTED' | 'SUCCESS' {
        let set = map.get(keySlot)
        if (!set || !set.has(relativeSlot)) {
            // Logger.warn('Relative slot not existed')
            return 'NOT EXISTED'
        }
        set.add(relativeSlot)
        return 'SUCCESS'
    }
    removeRelativeSlot(slot: Slot, relativeSlot: Slot, type: 'PARENT' | 'CHILD') {
        let parentSlot = relativeSlot
        let childSlot = slot
        if (type === 'CHILD') {
            parentSlot = slot
            childSlot = relativeSlot
        }

        let ret1 = this.#removeRelativeSlot(this.#childToParentSlotsMap, childSlot, parentSlot)
        let ret2 = this.#removeRelativeSlot(this.#parentToChildSlotsMap, parentSlot, childSlot)
        if (ret1 !== ret2) {
            throw ''
        }
        return ret1
    }
    getChildSlotSet(slot: Slot) {
        return this.#parentToChildSlotsMap.get(slot) ?? null

    }
    getParentSlotSet(slot: Slot) {
        return this.#childToParentSlotsMap.get(slot) ?? null
    }
    constructor() {
        this.#childToParentSlotsMap = new Map
        this.#parentToChildSlotsMap = new Map
    }
    observe<T extends ObservableTypes>(obj: T, opt: Omit<AgentConstructorOpt, 'observer'>) {
        return new ObserverRefrenceAgent(obj, {
            ...opt,
            observer: this
        })
    }
}
