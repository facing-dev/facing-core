import { ObservableTypes } from '../slot'
import { createProxy, GetHandlerMap } from './common'
import { get as getSlot } from '../slot'
// let ArrayProxy: Array<any> | null = null

// // const METHOD_KEYS: ((keyof Array<any>) & string)[] = [
// //     'push',
// //     'pop',
// //     'shift',
// //     'unshift',
// //     'splice',
// //     'sort',
// //     'reverse'
// // ]
// // const ArrayMethods = METHOD_KEYS.reduce<{ [index: string]: Function }>(function (pv, value, ind, arr) {
// //     pv[value] = function (this:any,...args:any[]) {
// //         console.log('set arr',this)
// //         let objStartIndex = -1
// //         switch (value) {
// //             case 'push':
// //             case 'unshift':
// //                 objStartIndex = 0
// //                 break
// //             case 'splice':
// //                 objStartIndex = 2
// //                 break
// //         }
// //         if (objStartIndex >= 0) {
// //             args.forEach((obj, ind) => {
// //                 if (ind >= objStartIndex && isObservableType(obj)) {
// //                     makeObserve(obj)
// //                 }
// //             })
// //         }
// //         let ret = Reflect.apply(target, context, args)

// //         scheduleObserved(this)
// //         return ret
// //     }

// //     return pv
// // }, {})

/**
 * Injected array methods
 */
const METHOD_KEYS: ((keyof Array<any>) & string)[] = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
]
/**
 * Make array observable
 * @param array Array
 * @returns Proxied input array
 */
export function makeArrayProxy(array: Array<any>): ObservableTypes {
    const GetHandlerMap: GetHandlerMap = new Map()
    METHOD_KEYS.forEach(key => {
        GetHandlerMap.set(key, function (target, p, receiver) {
            if (p !== key) {
                //Call handler on a different method, error
                throw ''
            }
            //Get the wrappered array method
            return function (...args: any[]) {
                let slot = getSlot(array)
                if (!slot) {
                    throw ''
                }
                //Make slot bundle observed because of these methods may operate many values at the same time
                slot.bundleCalledSymbol = Symbol('Facing/Observer.BuldleCalled')
                Reflect.get(target, p, receiver).apply(proxy, args)
                
                slot.bundleCalledSymbol = null
            }
        })
    })
    let proxy = createProxy(array, {
        getHandlerMap: GetHandlerMap
    })
    return proxy
}