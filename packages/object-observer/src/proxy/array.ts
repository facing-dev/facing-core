import { ObservableTypes, get as getSlot, isObservableType } from '../Slot'
import { makeObserve } from '../observe'
import { scheduleObserved } from './utils'
let ArrayProxyPrototype: Array<any> | null = null

const METHOD_KEYS: (keyof Array<any>)[] = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
]



function generateArrayProxyPrototype(array?: Array<any>) {
    let prototype = Array.prototype
    let cached = false
    if (!array) {
        if (ArrayProxyPrototype) {
            prototype = ArrayProxyPrototype
            cached = true
        }
        else {
            prototype = ArrayProxyPrototype = Object.create(Array.prototype)
        }

    } else {
        prototype = Object.create(Object.getPrototypeOf(array))
    }
    if (!cached) {
        METHOD_KEYS.forEach(key => {

            let oldFunc = prototype[key]
            if (typeof oldFunc !== 'function') {
                throw ''
            }
            prototype[key] = new Proxy(oldFunc, {
                apply: function (target: Function, context, args) {
                    let objStartIndex = -1
                    switch (key) {
                        case 'push':
                        case 'unshift':
                            objStartIndex = 0
                            break
                        case 'splice':
                            objStartIndex = 2
                            break
                    }
                    let ret = target.apply(context, objStartIndex === -1 ? args : args.map((obj, ind) => {
                        if (ind < objStartIndex) {
                            return obj
                        }
                        else {
                            return isObservableType(obj) ? makeObserve(obj) : obj
                        }
                    }))
                    scheduleObserved(context)
                    return ret
                }
            })
        })
    }


    return prototype
}
export function makeArrayProxy(arr: Array<any>): ObservableTypes {
    let prototype = generateArrayProxyPrototype(arr)



    Object.setPrototypeOf(arr, prototype)


    return arr
}