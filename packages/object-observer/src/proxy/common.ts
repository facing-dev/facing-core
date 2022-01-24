import {get as getSlot, isObservableType ,ObservableTypes} from '../Slot'
import { makeObserve } from '../observe'
import { scheduleObserved } from './utils'
export function generateProxyHandler<T extends ObservableTypes>(handler?:ProxyHandler<T>):ProxyHandler<T>{
    const proxyHandler:ProxyHandler<T>={
        set(target, name, value, receiver) {
            let slot = getSlot(target)
            if (!slot) {
                console.error(target)
                throw 'target has no slot'
            }
            let oldValue = Reflect.get(target, name, receiver)
            if (isObservableType(oldValue)) {
                let oldSlot = getSlot(oldValue)
                if (oldSlot) {
                    oldSlot.removeReference(slot)
                }
            }
            if (isObservableType(value)) {
                value = makeObserve(value)
            }
            let newSlot = getSlot(value)
            if (newSlot) {
                newSlot.addReference(slot)
            }
    
            scheduleObserved(target)
            return Reflect.set(target, name, value, receiver)
    
        },
        deleteProperty: function (target, property: string) {
            let value = Reflect.get(target, property)
            let slot = getSlot(target)
            if (!slot) {
                console.error(target)
                throw 'target has no slot'
            }
            if (isObservableType(value)) {
                let valueSlot = getSlot(value)
                if (valueSlot) {
                    valueSlot.removeReference(slot)
                }
    
            }
            scheduleObserved(target)
            return Reflect.deleteProperty(target, property)
        }
    }
    return proxyHandler
}
