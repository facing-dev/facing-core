import { Record, Watcher } from './record'
import { ObservableTypes, create as createSlot, get as getSlot } from './slot'
import { travel } from './travel'
import { makeObserve } from './observe'


type AgentConstructorOpt = { record?: Record }
class ObjectObserverRefrenceAgent<T extends ObservableTypes> {
    private rawObject: T
    public object: T
    constructor(obj: T, opt: AgentConstructorOpt) {
        this.rawObject = obj
        this.object = obj
        this.#makeObservable(opt)

    }
    #makeObservable(opt: AgentConstructorOpt) {
        let obj = this.rawObject
        let slot = getSlot(obj)

        if (slot) {
            this.object = obj
        } else {
            this.object = makeObserve(obj)
        }
        if (opt.record) {
            this.addRecord(opt.record)
        }
    }
    addRecord(record: Record) {
        let self = this
        let obj = this.rawObject
        let slot = getSlot(obj)
        if (!slot) {
            console.error(self)
            throw 'Add record to unobserved object'
        }
        if (slot.records.has(record)) {
            console.error(self)
            throw 'Record has added'
        }
        slot.records.set(record, record)
        /*
        travel(obj, function (obj) {
            let slot = getSlot(obj)
            if (!slot) {

            }
            let recRef = slot.recordReferences.get(record)
            if (!recRef) {
                recRef = {
                    refCount: 1,
                    record
                }
                slot.recordReferences.set(record, recRef)
            } else {
                recRef.refCount++
            }
            return true
        })
        */
    }
    removeRecord(record: Record) {
        let self = this
        let obj = this.rawObject
        let slot = getSlot(obj)
        if (!slot) {
            console.error(self)
            throw 'Remove record to unobserved object'
        }
        if (!slot.records.has(record)) {
            console.error(self)
            throw 'Record not existed'
        }
        slot.records.delete(record)
        /*
        travel(obj, function (obj) {
            let slot = getSlot(obj)
            if (!slot) {
                console.error(self)
                throw 'Remove record from unobserved object'
            }
            let recRef = slot.recordReferences.get(record)
            if (!recRef) {
                console.error(self)
                throw 'Remove record from not found recRef'
            }
            recRef.refCount--
            if (recRef.refCount < 0) {
                console.error(self)
                throw 'Remove record ref cound === 0'
            }
            if (recRef.refCount === 0) {
                slot.recordReferences.delete(record)
            }
            return true

        })
        */
    }
}

export class ObjectObserver {

    makeObjectObservable<T extends ObservableTypes >(obj: T, opt: AgentConstructorOpt) {
        return new ObjectObserverRefrenceAgent(obj, opt)
    }
}
export function createRecord(config?: (record: Record) => void) {
    let record = new Record()
    if (config) {
        config(record)
    }
    return record
}