// import { REF_CURRENT } from './constant'
// export interface Reference<T = any> {
//     [REF_CURRENT]: T | null
// }

// export function createReference<T = any>() {
//     let r: Reference<T> = {
//         [REF_CURRENT]: null
//     }
//     return r
// }
export class Reference<T>{
    current: T | null = null
}