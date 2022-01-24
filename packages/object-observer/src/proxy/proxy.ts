import { ObservableTypes, get as getSlot, isObservableType } from '../Slot'
import { makeArrayProxy } from './array'
import { makeObjectProxy } from './object'


export function makeProxy(obj: ObservableTypes) {
    let slot = getSlot(obj)
    if (!slot) {
        console.error(obj)
        throw "Can't create proxy for unobserved object"
    }
    let ret: ObservableTypes | null = null
    if (Array.isArray(obj)) {
        ret = makeArrayProxy(obj)
    } else {
        ret = makeObjectProxy(obj)
    }
    return ret
}