interface Record {
    callbackFunction: Function
    params: any[] | null
}

interface Layer {
    records: Record[]
    deferMS: false | number
}


export default class Scheduler {
    private layerMap: Map<string, Layer> = new Map()
    private scheduled = false
    createLayer(name: string) {
        if (this.layerMap.has(name)) {
            throw `Schedule layer ${name} existed`
        }
        let layer: Layer = {
            records: [],
            deferMS: 0
        }
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
        if (!this.scheduled) {
            this.scheduled = true
            let self = this
            let deferMS: number = 0
            function task() {
                for (let ite of self.layerMap) {
                    let layer = ite[1]
                    let records = layer.records
                    layer.records = []
                    for (let record of records) {
                        record.callbackFunction.apply({}, record.params === null ? [] : record.params)
                    }
                    if (layer.deferMS === false) {
                        continue
                    } else {
                        deferMS = layer.deferMS
                        run()
                        return
                    }

                }
                self.scheduled = false
            }
            function run() {
                window.setTimeout(task, deferMS)
            }
            run()
        }
    }

}