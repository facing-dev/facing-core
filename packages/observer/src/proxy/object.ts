import { ObservableTypes, get as getSlot, isObservableType } from '../slot'
import { makeObserve } from '../observe'
import { scheduleObserved } from './utils'
import {generateProxyHandler} from './common'

// function generateObjectProxyPrototype(object: Object) {
//     let prototype: Object | null = null
//     let isDefaultProxy = false
//     if (Object.getPrototypeOf(object) === Object.prototype) {
//         if (ObjectProxy) {
//             return ObjectProxy
//         }
//         prototype = Object.prototype
//         isDefaultProxy = true
//     } else {
//         prototype = Object.getPrototypeOf(object)
//     }
//     if (!prototype) {
//         throw ''
//     }
//     let proxy = new Proxy(prototype, ObjectProxyHandler)
//     if (!ObjectProxy && isDefaultProxy) {
//         ObjectProxy = proxy
//     }
//     return proxy
// }
export function makeObjectProxy(obj: { [index: string]: any }): ObservableTypes {
    // let proxy = generateObjectProxyPrototype(obj)
    // Object.setPrototypeOf(obj, proxy)
    return new Proxy(obj, generateProxyHandler())
}