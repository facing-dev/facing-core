import { ObservableTypes, get as getSlot, isObservableType } from '../Slot'
import { makeArrayProxy } from './array'
import { makeObjectProxy } from './object'
export function makeProxy(obj: ObservableTypes) {
    let slot = getSlot(obj)
    if (!slot) {
        console.error(obj)
        throw "Can't create proxy for unobserved object"
    }
    if (Array.isArray(obj)) {
        return makeArrayProxy(obj)
    } else {

        return makeObjectProxy(obj)
    }


}