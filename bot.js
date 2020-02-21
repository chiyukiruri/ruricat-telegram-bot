const Telegraf = require('telegraf')
const Linq = require('linq')
const SocektProxy = require('socks-proxy-agent')

const crypto = require('crypto')

const BotConfig = require("./config")
const Log = require('./Log')
const Permission = require('./permission')

const agent = new SocektProxy(BotConfig.proxy)
let mods //模块加载
let bot
const coms = [] //模块配置

if (BotConfig.proxy) {
    bot = new Telegraf(BotConfig.bot.token, { telegram: { agent: agent } })
    Log.info('Proxy is enable')
} else {
    bot = new Telegraf(BotConfig.bot.token)
    Log.info('Proxy is disable')
}

let main = () => {
    Log.info("%s (%s) is starting...", BotConfig.bot.nickname, BotConfig.bot.name)
    bot.start((ctx) => ctx.reply(BotConfig.bot.start))

    // 调试输出请求内容
    bot.use(async (ctx, next) => {
        Log.msg.debug(ctx)
        Log.msg.debug(ctx.message)
        Log.msg.debug(ctx.inlineQuery)
        ctx.result = []
        ctx.n = true
        next()
    })

    // 获取启用模块配置
    mods = BotConfig.modules.map(name => {
        let o = {
            name: name,
            require: require('./modules/' + name + '/main.js')
        }
        Log.info('enable module %s - %s', name, o.require.info.description)
        return o
    })

    //获取模块 commands，inlines 等配置
    mods.forEach(m => {
        Log.info('init moudles %s', m.name)
        m.require.info.commands.forEach(c => {
            Log.debug('Command: /%s', c.command)
            c.mod = m.require
            coms.push(c)
        })

        m.require.info.inlines.forEach(l => {
            Log.debug('Inline: %s', l.name)
            l.mod = m.require
            coms.push(l)
        })

        m.require.info.on.forEach(o=>{
            Log.debug('On %s',o.name)
            o.mod=m.require
            coms.push(o)
        })
    })

    // 权限管理 use
    Permission.coms = coms
    bot.use(Permission.permission)

    // 注册 command
    Log.info('Commands list')
    Linq.from(coms).where(x => x.command !== undefined).toArray().forEach(
        c => {
            bot.command(c.command, c.mod.methods[c.fun])
            console.log('%s - %s', c.command, c.desc)
        })

    //注册 inlines
    Log.info('Inline list')
    Linq.from(coms).where(x => x.regx !== undefined).toArray().forEach(
        l => {
            bot.inlineQuery(l.regx, l.mod.methods[l.fun])
            Log.info('%s - %s -%s', l.name, l.regx, l.desc)
        })


    //Inline 候补选项
    bot.inlineQuery(/.*/, (ctx, next) => {
        if (ctx.n) {
            let re = new RegExp('^' + ctx.inlineQuery.query)
            Linq.from(coms).where(x => (x.regx !== undefined && re.test(x.name))).toArray().forEach(i => {
                ctx.result.push({
                    type: 'article',
                    id: '0',
                    title: i.name,
                    description:i.desc,
                    input_message_content: {
                        message_text: i.name
                    }
                })
            })
        }
        for (i = 0; i < ctx.result.length; i++) {
            ctx.result[i].id = crypto.createHash('sha256').update(JSON.stringify(ctx.result[i]) + Math.random()).digest('hex')
        }
        Log.debug(ctx.result)
        if(ctx.n){
            ctx.answerInlineQuery(ctx.result)
        }else{
            ctx.answerInlineQuery(ctx.result, { cache_time: 2 })
        }
        
    })

    //注册 on 事件
    Log.info('On event list')
    Linq.from(coms).where(x=>x.type!==undefined).toArray().forEach(o=>{
        bot.on(o.type,o.mod.methods[o.fun])
        Log.info('%s - %s -%s', o.type, o.name, o.desc)
    })
    
    Log.info('Launching ...')
    bot.launch()
        .then(() => { Log.info('Done.') })
        .catch(error => {
            Log.error('Launch Is Error')
            Log.error(error)
        })
}
main()