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

    const travelIterator: TravelIterator = function (obj, fieldName, level, parent) {
        let slot = getSlot(obj)
        let newObserved = false
        if (!slot) {
            slot = createSlot(obj, observer)
            newObserved = true
        }
        if (level === 0) {
            proxy = slot.proxiedObject
        }


        if (parent) {
            let parentSlot = getSlot(parent)
            if (!parentSlot) {
                Logger.error(parent)
                throw 'parent has no slot'
            }

            // if (slot.hasParentSlot(parentSlot)) {
            //     return false
            // }
            slot.addParentSlot(parentSlot)
        }
        return  newObserved
        // if (parent) {
        //     let parentSlot = getSlot(parent)
        //     if (!parentSlot) {
        //         Logger.error(parent)
        //         throw 'parent has no slot'
        //     }

        //     if (slot.hasParentSlot(parentSlot)) {
        //         return false
        //     }
        //     slot.addParentSlot(parentSlot)
        //     return true
        // } else {
        //     return true
        // }
    }
    travel(obj, travelIterator)

    if (!proxy) {

        throw ''

    }
    return proxy

}