
import { ObservableTypes } from './slot'
export interface Watcher {
    (object: ObservableTypes): void
}
export class Record {
    constructor(watchers?: Watcher[] | Watcher) {
        this.watchers = watchers === undefined ? [] : (Array.isArray(watchers) ? watchers : [watchers])
    }
    watchers: Watcher[] = []
}