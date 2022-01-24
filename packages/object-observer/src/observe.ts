import { ObservableTypes } from './Slot'
import { travel } from './travel'
import { get as getSlot, create as createSlot } from './Slot'
import { makeProxy } from './proxy/proxy'

export function makeObserve<T extends ObservableTypes>(obj: T): T {
    let ret: ObservableTypes | null = null
    travel(obj, function (obj, fieldName, label, parent) {
        let slot = getSlot(obj)
        if (!slot) {
            slot = createSlot(obj)
            ret = makeProxy(obj)

            if (parent) {
                let parentSlot = getSlot(parent)
                if (!parentSlot) {
                    console.error(parent)
                    throw 'parent has no slot'
                }
                slot.addReference(parentSlot)
            }
            return true
        }
        return false
    })
    if (!ret) {
        throw ''
    }
    return ret

}