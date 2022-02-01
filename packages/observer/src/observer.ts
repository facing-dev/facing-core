import { Record } from './record'
import { ObservableTypes, get as getSlot } from './slot'
import { makeObserve } from './observe'

type AgentConstructorOpt = { record?: Record }
export class ObserverRefrenceAgent<T extends ObservableTypes> {
    public object: T
    records: Map<Record, Record> = new Map()
    constructor(obj: T, opt: AgentConstructorOpt) {
        this.object = obj
        let slot = getSlot(obj)
        if (slot) {
            this.object = obj
        } else {
            this.object = makeObserve(obj)
            slot = getSlot(this.object)!
        }
        slot.addObjectObserverRefrenceAgent(this)
        if (opt.record) {
            this.addRecord(opt.record)
        }
    }
    addRecord(record: Record) {
        if (this.records.has(record)) {
            console.error(self)
            throw 'Record has added'
        }
        this.records.set(record, record)
    }
    removeRecord(record: Record) {
        if (!this.records.has(record)) {
            console.error(self)
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
    observe<T extends ObservableTypes>(obj: T, opt: AgentConstructorOpt) {
        return new ObserverRefrenceAgent(obj, opt)
    }
}
