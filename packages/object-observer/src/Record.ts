export interface Watcher {
    (): void
}
export class Record {
    watchers: Watcher[] = []
}