
import { ObservableTypes } from './slot'
export interface Watcher {
    (object:ObservableTypes): void
}
export class Record {
    watchers: Watcher[] = []
}