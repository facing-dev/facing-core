import Logger from '../logger'
import { get as getSlot, isObservableType, ObservableTypes } from '../slot'
import { makeObserve } from '../observe'
import { scheduleObserved } from './utils'

export type GetHandlerMap = Map<any, ProxyHandler<any>['get'] extends infer T | undefined ? T : never>
/**
 * Proxy observable object
 * @param obj Observale object will be proxied
 * @param opt.getHandlerMap Custom proxy get handler for some property keys
 * @returns 
 */
export function createProxy(obj: ObservableTypes, opt: {
    getHandlerMap?: GetHandlerMap,
}) {

    const handler: ProxyHandler<ObservableTypes> = {
        get(target: ObservableTypes, p: string | symbol, receiver: any): any {
            if (opt.getHandlerMap) {
                for (const key of opt.getHandlerMap.keys()) {
                    if (key === p) {
                        //Call custom proxy get handler
                        return opt.getHandlerMap.get(key)!(target, p, receiver)
                    }

                }
            }
            //Call default proxy get handler
            return Reflect.get(target, p, receiver)
        },
        set(target, name, value, receiver) {
            let slot = getSlot(target)
            if (!slot) {
                Logger.error(target)
                throw 'target has no slot'
            }
            let oldValue = Reflect.get(target, name, receiver)
            if (isObservableType(oldValue)) {
                let oldSlot = getSlot(oldValue)
                if (oldSlot) {
                    //If old value is observed by this object, remove this from target slot's reference list
                    oldSlot.removeSlotReference(slot)
                }
            }
            if (isObservableType(value)) {
                //Make value observed
                value = makeObserve(value)
            }
            let newSlot = getSlot(value)
            if (newSlot) {
                //Add this to new value's slot's reference list
                newSlot.addSlotReference(slot)
            }
            //Set value normal
            const ret = Reflect.set(target, name, value, receiver)

            //Trigger observers of this and descendants
            scheduleObserved(target)

            return ret

        },
        deleteProperty: function (target, property: string) {
            let value = Reflect.get(target, property)
            let slot = getSlot(target)
            if (!slot) {
                Logger.error(target)
                throw 'target has no slot'
            }
            if (isObservableType(value)) {
                let valueSlot = getSlot(value)
                if (valueSlot) {
                    //If old value is observed by this object, remove this from target slot's reference list
                    valueSlot.removeSlotReference(slot)
                }

            }

            //Delete value normal
            const ret = Reflect.deleteProperty(target, property)

            //Trigger observers of this and descendants
            scheduleObserved(target)

            return ret
        }
    }

    return new Proxy(obj, handler)
}
