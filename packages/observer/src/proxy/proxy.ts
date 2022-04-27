import Logger from '../logger'
import { ObservableTypes, get as getSlot, isObservableType } from '../slot'
import { makeArrayProxy } from './array'
import { makeObjectProxy } from './object'

/**
 * Make object observable by proxy
 * @param obj Object will be wrapped by a proxy
 * @returns Proxied input object
 */
export function makeProxy(obj: ObservableTypes) {
    let slot = getSlot(obj)
    if (!slot) {
        Logger.error(obj)
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