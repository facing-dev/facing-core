import { ObservableTypes, isObservableType } from './Slot'
export function travel(obj: ObservableTypes, ite: (obj: ObservableTypes, fieldName: string | null, level: number) => boolean) {
    function step(obj: ObservableTypes, fieldName: string | null, level = 0) {
        if (!ite(obj, fieldName, level)) {
            return
        }
        if (Array.isArray(obj)) {
            for (let val of obj) {
                if (isObservableType(val)) {
                    step(val, null, level + 1)
                }
            }
            return
        }

        for (let key in obj) {
            let val = obj[key]
            if (isObservableType(val)) {
                step(val, key, level + 1)
            }
        }
    }
    step(obj, null, 0)
}