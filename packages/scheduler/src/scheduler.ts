export interface Record {
    callbackFunction: Function
    params: any[] | null
}

// export interface Layer {
//     records: Set<Record>
//     beforeRecords: Set<Record> | null
//     afterRecords: Set<Record> | null
// }

export class Layer {
    records: Set<Record> = new Set
    addRecord(record: Record) {
        this.records.add(record)
    }
    clearRecords() {
        this.records.clear()
    }
    deleteRecord(record: Record) {
        return this.records.delete(record)
    }

    beforeRecords: Set<Record> | null = null
    addBeforeRecord(record: Record) {
        this.beforeRecords = this.beforeRecords ?? new Set
        this.beforeRecords.add(record)
    }
    clearBeforeRecords() {
        this.beforeRecords?.clear()
    }
    deleteBeforeRecord(record: Record) {
        return !!this.beforeRecords?.delete(record)
    }
    afterRecords: Set<Record> | null = null
    addAfterRecord(record: Record) {
        this.afterRecords = this.afterRecords ?? new Set
        this.afterRecords.add(record)
    }
    clearAfterRecords() {
        this.afterRecords?.clear()
    }
    deleteAfterRecord(record: Record) {
        return !!this.afterRecords?.delete(record)
    }
}

export class Scheduler {
    private layerMap: Map<string, Layer> = new Map()
    private scheduled = false
    createLayer(name: string) {
        if (this.layerMap.has(name)) {
            throw `Schedule layer ${name} existed`
        }
        let layer: Layer = new Layer
        this.layerMap.set(name, layer)
        return layer
    }
    getLayer(name: string) {
        if (!this.layerMap.has(name)) {
            return this.createLayer(name)
        }
        return this.layerMap.get(name)
    }
    schedule() {
        return new Promise<null>((res) => {
            if (!this.scheduled) {
                this.scheduled = true
                let self = this
                function task() {
                    for (let ite of self.layerMap) {
                        let layer = ite[1]
                        if (layer.records.size === 0) {
                            continue
                        }
                        let records = Array.from(layer.records.values())
                        layer.records.clear()
                        if (records.length > 0) {
                            let beforeRecords = layer.beforeRecords
                            let afterRecords = layer.afterRecords
                            if (beforeRecords) {
                                for (let record of beforeRecords) {
                                    record.callbackFunction.apply({}, record.params === null ? [] : record.params)
                                }
                            }
                            for (let record of records) {
                                record.callbackFunction.apply({}, record.params === null ? [] : record.params)
                            }
                            if (afterRecords) {
                                for (let record of afterRecords) {
                                    record.callbackFunction.apply({}, record.params === null ? [] : record.params)
                                }
                            }
                        }
                        run()
                        return
                    }
                    self.scheduled = false
                    res(null)
                }
                function run() {
                    window.setTimeout(task, 0)
                }
                run()
            }
            else {
                res(null)
            }
        })

    }

}