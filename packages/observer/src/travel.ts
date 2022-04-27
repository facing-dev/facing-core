import { ObservableTypes, isObservableType } from './slot'
import {eachOf} from './proxy/utils'
/**
 * @param obj Current travelling property
 * @param fieldName Current property's filed name of parent
 * @param level Current property's depth level from root object `0`
 * @param parent Current property's parent object, `null` for the root
 * @returns `boolean`, `true` continue travelling, `false` break travelling
 */
export type TravelIterator = (obj: ObservableTypes, fieldName: string | null, level: number|null,parent:ObservableTypes|null) => boolean
/**
 * Call function ite on each property of obj recursive
 * @param obj The root object will be travelled
 * @param ite The iterator function on each property of obj recursive
 */
export function travel(obj: ObservableTypes, ite: TravelIterator) {
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