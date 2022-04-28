export enum Level {
    DEBUG,
    INFO,
    TRACE,
    WARN,
    ASSERT,
    ERROR,

}
function callOutput(func: Function, prefix: string | undefined, ...args: any[]) {
    func.apply(null, prefix !== undefined ? [prefix + ':', ...args] : args)
}
export class Logger {
    level = Level.WARN
    // traceLevel = Level.WARN
    handler: { [index: string]: Function[] } = {}
    prefix?: string
    constructor(level: Level, prefix?: string) {
        this.level = level;
        this.prefix = prefix;
        for (let key in Level) {
            this.handler[key] = [];
        }
    }

    output(level: Level, args: any[]) {
        if (level < this.level) {
            return;
        }

        this.handler[level].forEach(func => callOutput(func, this.prefix, ...args));
        // if (level >= this.traceLevel && level !== Level.TRACE) {
        //     this.handler[Level.TRACE].forEach(func => callOutput(func, undefined, '^^^^^^'));
        // }
    }

    debug(...args: any[]) {
        this.output(Level.DEBUG, args)
    }
    warn(...args: any[]) {
        this.output(Level.WARN, args)
    }
    error(...args: any[]) {
        this.output(Level.ERROR, args)
    }
    info(...args: any[]) {
        this.output(Level.INFO, args)
    }
    trace(...args: any[]) {
        this.output(Level.TRACE, args)
    }
    assert(...args: any[]) {
        this.output(Level.ASSERT, args)
    }

}
type CreatorArgs = ConstructorParameters<typeof Logger> extends [any, ... infer T] ? T : never

export function createLogger(...args: CreatorArgs) {
    let level: Level = (Level as any)[(localStorage.getItem('_$facing_logger_debug') ?? 'WARN').toUpperCase()]
    if (typeof level === 'undefined' || typeof level !== 'string') {
        level = Level.WARN
    }

    return new Logger(level, ...args)

}

export function createWarnLogger(...args: CreatorArgs) {
    return new Logger(Level.WARN, ...args)
}
export function createDebugLogger(...args: CreatorArgs) {
    return new Logger(Level.DEBUG, ...args)
}
export function createInfoLogger(...args: CreatorArgs) {
    return new Logger(Level.INFO, ...args)
}
export function createErrorLogger(...args: CreatorArgs) {
    return new Logger(Level.ERROR, ...args)
}

export function createAssertLogger(...args: CreatorArgs) {
    return new Logger(Level.ASSERT, ...args)
}

export function setupConsoleLogger(logger: Logger) {

    logger.handler[Level.ERROR].push((...args: any[]) => {
        if (!console.error) {
            return;
        }
        console.error(...args);
    })
    logger.handler[Level.WARN].push((...args: any[]) => {
        if (!console.warn) {
            return;
        }
        console.warn(...args);
    })
    logger.handler[Level.DEBUG].push((...args: any[]) => {
        if (!console.debug) {
            return;
        }
        console.debug(...args);
    })
    logger.handler[Level.INFO].push((...args: any[]) => {
        if (!console.info) {
            return;
        }
        console.info(...args);
    })
    logger.handler[Level.TRACE].push((...args: any[]) => {
        if (!console.trace) {
            return;
        }
        console.warn(...args)
        console.trace('^^^^')
    })
    logger.handler[Level.ASSERT].push((...args: any[]) => {
        if (!console.assert) {
            return;
        }
        if (typeof args[0] === 'string') {
            const [arg1, arg2, ...extraArgs] = args
            args = [arg2, arg1, ...extraArgs]

        }
        console.assert(...args);

    })
}


