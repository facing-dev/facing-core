import { ObservableTypes} from '../slot'
import {createProxy} from './common'
/**
 * Make plain object observable
 * @param obj Plain object
 * @returns Proxied input plain object
 */
export function makeObjectProxy(obj: { [index: string]: any }): ObservableTypes {
    return createProxy(obj,{})
}