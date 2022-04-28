import Logger from './logger'
import { ObservableTypes } from './slot'
import { travel, TravelIterator } from './travel'
import { get as getSlot, create as createSlot } from './slot'
import { makeProxy } from './proxy/proxy'
import type { Observer } from './observer'
/**
 * Make an object observed
 * @param obj Object will be observed
 * @param observer Manager observer
 * @returns Observed input object
 */
export function makeObserve<T extends ObservableTypes>(obj: T, observer: Observer): T {
    let proxy: ObservableTypes | null = null
    const travelIterator: TravelIterator = function (obj, fieldName, lavel, parent) {
        let slot = getSlot(obj)
        if (!slot) {
            slot = createSlot(obj, observer)
            proxy = makeProxy(obj, observer)
        }

        if (parent) {
            let parentSlot = getSlot(parent)
            if (!parentSlot) {
                Logger.error(parent)
                throw 'parent has no slot'
            }
            return slot.addParentSlot(parentSlot) === 'SUCCESS'
        } else {
            return true
        }
    }
    travel(obj, travelIterator)
    if (!proxy) {
        throw ''
    }
    return proxy

}