import { ObservableTypes} from '../slot'
import {createProxy} from './common'
import type {Observer} from '../observer'
/**
 * Make plain object observable
 * @param obj Plain object
 * @param observer Manager observer
 * @returns Proxied input plain object
 */
export function makeObjectProxy(obj: { [index: string]: any },observer:Observer): ObservableTypes {
    return createProxy(obj,{
        observer
    })
}