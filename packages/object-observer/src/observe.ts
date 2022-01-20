import { ObservableTypes } from './Slot'
import { travel } from './travel'
import { get as getSlot, create as createSlot } from './Slot'
import { makeProxy } from './proxy/proxy'
// import * as Utils from './utils'
export function makeObserve(obj: ObservableTypes):ObservableTypes {
    // let fNs = Utils.checkObjectFieldNames(obj, fieldNames)
    let ret: ObservableTypes | null = null
    travel(obj, function (obj) {
        let slot = getSlot(obj)
        if (!slot) {

            createSlot(obj)
            ret = makeProxy(obj)
            return true
        }
        return false
    })
    if (!ret) {
        throw ''
    }
    return ret

    // let record = opt.record
    // if (record) {
    //     this.addRecord(record)
    // }
}