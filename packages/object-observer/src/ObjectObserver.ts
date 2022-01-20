import { Record, Watcher } from './Record'
import { ObservableTypes, create as createSlot, get as getSlot } from './Slot'
import { travel } from './travel'


type AgentConstructorOpt = { record?: Record, fieldNames?: string | string[] }
class ObjectObserverRefrenceAgent<T extends ObservableTypes> {
    private rawObj: T
    private obj:T
    constructor(obj: T, opt: AgentConstructorOpt) {
        this.rawObj = obj
        this.obj=obj
        this.#makeObservable(opt)

    }
    #makeObservable(opt: AgentConstructorOpt) {
        let obj = this.rawObj
        let slot = getSlot(obj)

        if (slot) {
            return
        }
        this.obj=this.rawObj

        
        

    }
    addRecord(record: Record) {
        let self = this
        let obj = this.rawObj
        travel(obj, function (obj) {
            let slot = getSlot(obj)
            if (!slot) {
                console.error(self)
                throw 'Add record to unobserved object'
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

    }
    removeRecord(record: Record) {
        let self = this
        let obj = this.rawObj
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
    }
}

export default class ObjectObserver {

    makeObjectObservable(obj: ObservableTypes, opt: AgentConstructorOpt) {
        return new ObjectObserverRefrenceAgent(obj, {
            record: opt.record,
            fieldNames: opt.fieldNames
        })
    }
}
export function createRecord() {
    return new Record()
}