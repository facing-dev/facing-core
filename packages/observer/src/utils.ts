import Logger from './logger'
import { ObservableTypes } from './slot'
export function checkObjectFieldNames(obj: ObservableTypes, fieldNames?: string | string[]) {
    let fNs: null | string[] = null
    if (fieldNames === undefined) {
        fNs = null
    } else if (typeof fieldNames === 'string') {
        fNs = [fieldNames]
    }
    else {
        fNs = fieldNames
    }
    if (Array.isArray(obj)) {
        if (fNs !== null) {
            Logger.error(obj, fNs)
            throw ("checkObjectFieldNames failed")
        }
    }
    return fNs
}