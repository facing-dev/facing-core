import Logger from './logger'
import { ObservableTypes } from './slot'
import { travel, TravelIterator } from './travel'
import { get as getSlot, create as createSlot } from './slot'
import { makeProxy } from './proxy/proxy'
export function makeObserve<T extends ObservableTypes>(obj: T): T {
    let proxy: ObservableTypes | null = null
    const travelIterator: TravelIterator = function (obj, fieldName, lavel, parent) {
        let slot = getSlot(obj)
        if (!slot) {
            slot = createSlot(obj)
            proxy = makeProxy(obj)
            if (parent) {
                let parentSlot = getSlot(parent)
                if (!parentSlot) {
                    Logger.error(parent)
                    throw 'parent has no slot'
                }
                slot.addSlotReference(parentSlot)
            }
            return true
        }
        return false
    }
    travel(obj, travelIterator)
    if (!proxy) {
        throw ''
    }
    return proxy

}