import { ObservableTypes } from '../Slot'
import {generateProxyHandler} from './common'
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


export function makeArrayProxy(array: Array<any>): ObservableTypes {

    // METHOD_KEYS.forEach((name) => {
    //     let func = array[name]
    //     if (typeof func !== 'function') {
    //         throw ''
    //     }
    //     Object.defineProperty(array, name, {
    //         value: new Proxy(func, ArrayMethodProxyHandlers[name]),
    //         enumerable: false,

    //     })
    // })
    let proxy = new Proxy(array,generateProxyHandler() )
    return proxy
}