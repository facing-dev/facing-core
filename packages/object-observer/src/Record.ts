
import { ObservableTypes } from './Slot'
export interface Watcher {
    (object:ObservableTypes): void
}
export class Record {
    watchers: Watcher[] = []
}