import { ObservableTypes, isObservableType } from './slot'
import {eachOf} from './proxy/utils'
export function travel(obj: ObservableTypes, ite: (obj: ObservableTypes, fieldName: string | null, level: number|null,parent:ObservableTypes|null) => boolean) {
    function step(obj: ObservableTypes, fieldName: string | null, level:number,parent:ObservableTypes|null) {
        if (!ite(obj, fieldName, level,parent)) {
            return
        }
        eachOf(obj,function(value){
            if (isObservableType(value)) {
                step(value, null, level + 1,obj)
            }
        })
    }
    step(obj, null, 0,null)
}