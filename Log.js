const log4js = require('log4js')
const BotConfig = require('./config')
log4js.configure({
    appenders: {
        stdo: { type: 'stdout', layout: { type: 'coloured' }},
        logfile: { type: "dateFile", pattern: "yyyy-MM-dd.log", filename: BotConfig.log.path+"/log/info", encoding: "utf-8", alwaysIncludePattern: true },
        errorlog: { type: "dateFile", pattern: "yyyy-MM-dd.log", filename: BotConfig.log.path+"/log/error/err", encoding: "utf-8", alwaysIncludePattern: true },
        error:{type: 'logLevelFilter', appender: 'errorlog', level: 'error'},
        log:{type: 'logLevelFilter', appender: 'logfile', level: BotConfig.log.filelevel},
        std:{type: 'logLevelFilter', appender: 'stdo', level:BotConfig.log.stdlevel }
    },
    categories: {
        default: { appenders: ['std'], level: 'all' },
        bot: { appenders: ['std', 'log', 'error'], level: 'all' },
        message: { appenders: ['std', 'log', 'error'], level: 'all' },
        module: { appenders: ['std', 'log', 'error'], level: 'all' }
    }
})
let logger = log4js.getLogger('bot')
logger.msg=log4js.getLogger('message')
logger.mod=log4js.getLogger('module')
module.exports = logger
