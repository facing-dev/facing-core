import Logger from '../logger'
import { get as getSlot, isObservableType, ObservableTypes } from '../slot'
import { makeObserve } from '../observe'
import { scheduleObserved } from './utils'

export type GetHandlerMap = Map<any, ProxyHandler<any>['get'] extends infer T | undefined ? T : never>

export function createProxy(obj: ObservableTypes, opt: {
    getHandlerMap?: GetHandlerMap,
}) {

    const handler: ProxyHandler<ObservableTypes> = {
        get(target: ObservableTypes, p: string | symbol, receiver: any): any {
            if (opt.getHandlerMap) {
                for (const key of opt.getHandlerMap.keys()) {
                    if (key === p) {
                        return opt.getHandlerMap.get(key)!(target, p, receiver)
                    }

                }
            }
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
                    oldSlot.removeSlotReference(slot)
                }
            }
            if (isObservableType(value)) {
                value = makeObserve(value)
            }
            let newSlot = getSlot(value)
            if (newSlot) {
                newSlot.addSlotReference(slot)
            }
            const ret = Reflect.set(target, name, value, receiver)
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
                    valueSlot.removeSlotReference(slot)
                }

            }
            scheduleObserved(target)
            return Reflect.deleteProperty(target, property)
        }
    }

    return new Proxy(obj, handler)
}
