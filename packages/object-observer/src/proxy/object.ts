import { ObservableTypes, get as getSlot, isObservableType } from '../Slot'
import { makeObserve } from '../observe'
import { scheduleObserved } from './utils'
export function makeObjectProxy(object: { [index: string]: any }): ObservableTypes {

    return new Proxy(object, {
        set: function (target, name, value, receiver) {
            console.log('in set')
            if (isObservableType(value)) {
                makeObserve(value)
            }
            Reflect.set(target, name, value, receiver)
            scheduleObserved(receiver)
            return true
        },
    })
}