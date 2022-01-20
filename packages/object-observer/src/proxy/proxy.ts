import { ObservableTypes, get as getSlot, isObservableType } from '../Slot'
import {makeArrayProxy} from './array'
function makeObjectProxy(obj: { [index: string]: any }): ObservableTypes {
    let proxy = new Proxy(obj, {

    })
    for (let key in obj) {
        let value = obj[key]
        if (isObservableType(value)) {
            obj[key] = makeProxy(value)
        }
    }
    return proxy
}
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