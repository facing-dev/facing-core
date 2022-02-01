





export enum Level {
    DEBUG="DEBUG",
    INFO="INFO",
    WARN="WARN",
    ASSERT="ASSERT",
    ERROR="ERROR",
    TRACE="TRACE"
}
export class Logger {
    level = Level.WARN
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
        this.handler[level].forEach(func => func.apply(null, this.prefix !== undefined ? [this.prefix + ':', ...args] : args));
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
type CreaterArgs = ConstructorParameters<typeof Logger> extends [any, ... infer T] ? T : never

export function createLogger(...args: CreaterArgs) {
    let level: Level = (localStorage.getItem('_$simler_logger_debug') ?? 'WARN').toUpperCase() as any
    if (typeof Level[level] === 'undefined') {

        level = Level.WARN
    }

    return new Logger(level, ...args)

}

export function createWarnLogger(...args: CreaterArgs) {
    return new Logger(Level.WARN, ...args)
}
export function createDebugLogger(...args: CreaterArgs) {
    return new Logger(Level.DEBUG, ...args)
}
export function createInfoLogger(...args: CreaterArgs) {
    return new Logger(Level.INFO, ...args)
}
export function createErrorLogger(...args: CreaterArgs) {
    return new Logger(Level.ERROR, ...args)
}

export function createAssertLogger(...args: CreaterArgs) {
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
        console.trace(...args);
    })
    logger.handler[Level.ASSERT].push((...args: any[]) => {
        if (!console.assert) {
            return;
        }
        console.assert(...args);
    })
}


