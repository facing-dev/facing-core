import { ObservableTypes, get as getSlot, isObservableType } from '../Slot'
import { makeObserve } from '../observe'
import { scheduleObserved } from './utils'
let ArrayProxy: Array<any> | null = null

const METHOD_KEYS: ((keyof Array<any>) & string)[] = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
]
const ArrayMethodProxyHandlers = METHOD_KEYS.reduce<{ [index: string]: ProxyHandler<Function> }>(function (pv, value, ind, arr) {
    pv[value] = {
        apply: function (target: Function, context, args) {
            console.log('set arr')
            let objStartIndex = -1
            switch (value) {
                case 'push':
                case 'unshift':
                    objStartIndex = 0
                    break
                case 'splice':
                    objStartIndex = 2
                    break
            }
            if (objStartIndex >= 0) {
                args.forEach((obj, ind) => {
                    if (ind >= objStartIndex && isObservableType(obj)) {
                        makeObserve(obj)
                    }
                })
            }
            let ret = Reflect.apply(target, context, args)
            scheduleObserved(context)
            return ret
        }
    }
    return pv
}, {})

export function makeArrayProxy(array: Array<any>): ObservableTypes {
    METHOD_KEYS.forEach((name) => {
        let func = array[name]
        if (typeof func !== 'function') {
            throw ''
        }
        Object.defineProperty(array, name, {
            value: new Proxy(func, ArrayMethodProxyHandlers[name]),
            enumerable: false,

        })

    })
    return array
}