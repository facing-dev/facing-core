import Logger from '../logger'
import { ObservableTypes, get as getSlot, isObservableType } from '../slot'
import { makeArrayProxy } from './array'
import { makeObjectProxy } from './object'
import type {Observer} from '../observer'
/**
 * Make object observable by proxy
 * @param obj Object will be wrapped by a proxy
 * @param observer Manager observer
 * @returns Proxied input object
 */
export function makeProxy(obj: ObservableTypes,observer:Observer) {
    let slot = getSlot(obj)
    if (!slot) {
        Logger.error(obj)
        throw "Can't create proxy for unobserved object"
    }
    let ret: ObservableTypes | null = null
    if (Array.isArray(obj)) {
        ret = makeArrayProxy(obj,observer)
    } else {
        ret = makeObjectProxy(obj,observer)
    }
    return ret
}