import { ObservableTypes } from './Slot'
import { travel } from './travel'
import { get as getSlot, create as createSlot } from './Slot'
import { makeProxy } from './proxy/proxy'

export function makeObserve<T extends ObservableTypes>(obj: T): T {

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

}