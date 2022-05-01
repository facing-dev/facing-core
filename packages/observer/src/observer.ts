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
export class SchedulerBundleTask {
    changedAgents: Set<ObserverRefrenceAgent<any>> = new Set
}

type SlotReferenceMap = Map<Slot, Map<Slot, number>>
export class Observer {
    // #parentToChildSlotsMap: Map<Slot, Set<Slot>>
    // #childToParentSlotsMap: Map<Slot, Set<Slot>>
    #parentToChildSlotsMap: SlotReferenceMap
    #childToParentSlotsMap: SlotReferenceMap
    get parentToChildSlotsMap() {
        return this.#parentToChildSlotsMap
    }
    get childToParentSlotsMap() {
        return this.#childToParentSlotsMap
    }
    // #scheduleSymbol: Symbol | null = null
    #schedulerBundleTask: SchedulerBundleTask | null = null
    scheduleBundleTask(cb: (task: SchedulerBundleTask) => void) {

        const newTask = this.#schedulerBundleTask === null
        if (newTask) {
            this.#schedulerBundleTask = new SchedulerBundleTask()
        }
        const task = this.#schedulerBundleTask!

        cb(task)


        if (newTask) {

            while (task.changedAgents.size > 0) {
                const copyAgents = new Set(task.changedAgents)
                task.changedAgents.clear()
                for (const agent of copyAgents.values()) {
                    agent.records.forEach((record) => {
                        record.watchers.forEach(function (watcher) {
                            watcher(agent.object)
                        })
                    })
                }
            }

            this.#schedulerBundleTask = null
        }
    }
    #getRelativeSlotCount(map: SlotReferenceMap, keySlot: Slot, relativeSlot: Slot): number {
        let m = map.get(keySlot)
        if (!m) {
            return 0
        }
        const count = m.get(relativeSlot) ?? 0
        if (count < 0) {
            throw ''
        }
        return count

    }
    getRelativeSlotCount(slot: Slot, relativeSlot: Slot, type: 'PARENT' | 'CHILD') {
        let parentSlot = relativeSlot
        let childSlot = slot
        if (type === 'CHILD') {
            parentSlot = slot
            childSlot = relativeSlot
        }
        const ret1 = this.#getRelativeSlotCount(this.#childToParentSlotsMap, childSlot, parentSlot)
        const ret2 = this.#getRelativeSlotCount(this.#parentToChildSlotsMap, parentSlot, childSlot)
        if (ret1 !== ret2) {
            throw ''
        }
        return ret1
    }
    #setRelativeSlotCount(map: SlotReferenceMap, keySlot: Slot, relativeSlot: Slot, count: number) {
        if (count < 0) {
            throw ''
        }
        let m = map.get(keySlot)
        if (m) {
            if (count === 0) {
                m.delete(relativeSlot)
            } else {

                m.set(relativeSlot, count)
            }
            if (m.size === 0) {
                map.delete(keySlot)
            }

        } else {
            if (count === 0) {
                return
            } else {
                const m: Map<Slot, number> = new Map
                map.set(keySlot, m)
                m.set(relativeSlot, count)
            }
        }
    }
    setRelativeSlotCount(slot: Slot, relativeSlot: Slot, count: number, type: 'PARENT' | 'CHILD') {
        let parentSlot = relativeSlot
        let childSlot = slot
        if (type === 'CHILD') {
            parentSlot = slot
            childSlot = relativeSlot
        }
        this.#setRelativeSlotCount(this.#childToParentSlotsMap, childSlot, parentSlot, count)
        this.#setRelativeSlotCount(this.#parentToChildSlotsMap, parentSlot, childSlot, count)
    }
    // #addRelativeSlot(map: SlotReferenceMap, keySlot: Slot, relativeSlot: Slot): number {
    //     let m = map.get(keySlot)
    //     let count = 0
    //     if (!m) {
    //         m = new Map
    //         map.set(keySlot, m)
    //     }
    //     count = m.get(relativeSlot) ?? 0
    //     count += 1
    //     m.set(relativeSlot, count)
    //     return count
    // }

    addRelativeSlot(slot: Slot, relativeSlot: Slot, type: 'PARENT' | 'CHILD') {
        // let parentSlot = relativeSlot
        // let childSlot = slot
        // if (type === 'CHILD') {
        //     parentSlot = slot
        //     childSlot = relativeSlot
        // }

        let count = this.getRelativeSlotCount(slot, relativeSlot, type)//this.#addRelativeSlot(this.#childToParentSlotsMap, childSlot, parentSlot)
        count += 1
        this.setRelativeSlotCount(slot, relativeSlot, count, type)
        return count
    }
    // #removeRelativeSlot(map: SlotReferenceMap, keySlot: Slot, relativeSlot: Slot): number {
    //     let m = map.get(keySlot)
    //     if (!m) {

    //         console.error(keySlot, relativeSlot)
    //         throw ''
    //     }
    //     let count = m.get(relativeSlot)
    //     if (count === undefined) {
    //         console.error('z')
    //         throw ''
    //     }
    //     if (count > 0) {
    //         count -= 1
    //         if (count === 0) {
    //             m.delete(relativeSlot)
    //             if (m.size === 0) {
    //                 map.delete(keySlot)
    //             }

    //         } else {
    //             m.set(relativeSlot, count)
    //         }

    //     } else {
    //         throw 'Slot reference is 0 before delete'
    //     }
    //     return count
    // }
    removeRelativeSlot(slot: Slot, relativeSlot: Slot, type: 'PARENT' | 'CHILD') {
        let count = this.getRelativeSlotCount(slot, relativeSlot, type)
        if (count === 0) {

            throw ''
        }
        count -= 1
        this.setRelativeSlotCount(slot, relativeSlot, count, type)
        return count


        // let parentSlot = relativeSlot
        // let childSlot = slot
        // if (type === 'CHILD') {
        //     parentSlot = slot
        //     childSlot = relativeSlot
        // }


        // let ret1 = this.#removeRelativeSlot(this.#childToParentSlotsMap, childSlot, parentSlot)

        // let ret2 = this.#removeRelativeSlot(this.#parentToChildSlotsMap, parentSlot, childSlot)

        // cc++
        // if (cc === 2) {
        //     console.log('ss', slot, relativeSlot, type)
        //     // throw ''
        // }
        // if (ret1 !== ret2) {
        //     throw ''
        // }

        // return ret1
    }
    clearRelativeSlot(slot: Slot, relativeSlot: Slot, type: 'PARENT' | 'CHILD') {
        let count = this.getRelativeSlotCount(slot, relativeSlot, type)
        if (count === 0) {
            throw ''
        }
        this.setRelativeSlotCount(slot, relativeSlot, 0, type)
    }
    getChildSlotMap(slot: Slot) {
        return this.#parentToChildSlotsMap.get(slot) ?? null

    }
    getParentSlotMap(slot: Slot) {
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
    slotReleasedTestCallback: ((proxied: Slot) => void) | null = null
}
var cc = 0