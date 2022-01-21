import { ObservableTypes, get as getSlot, isObservableType } from '../Slot'
import { makeObserve } from '../observe'
import {scheduleObserved} from './utils'
export function makeObjectProxy(obj: { [index: string]: any }): ObservableTypes {
    let ret = new Proxy(obj, {
        set(obj, prop, value, receiver) {
            let target = value
            if (isObservableType(target)) {
                target = makeObserve(target)
            }
            Reflect.set(receiver, prop, target, receiver)
            return true
        }
    })
    return ret
}