import { ObservableTypes} from '../slot'
import {createProxy} from './common'

export function makeObjectProxy(obj: { [index: string]: any }): ObservableTypes {
    return createProxy(obj,{})
}