const Linq = require('linq')
const BotConfig = require("./config")
const Log = require('./Log')

let premission={
    coms:{},
    check:(ctx,premission)=>{
        if(premission==='all'){
            return true
        }
        if(BotConfig.user[premission].indexOf(ctx.from.id)>-1){
            return true
        }else{
            return false
        }
    },
    permission:(ctx,next)=>{
            let name='text'
            let text=''
            if(ctx.message!==undefined && /^\/.*$/.test(ctx.message.text)){
                name='command'
                text=ctx.message.text.match(/^\/([A-Za-z0-9]*)[^A-Za-z0-9]?(.*)$/)[1]
            }else if(ctx.inlineQuery!==undefined){
                name='name'
                text=ctx.inlineQuery.query.split(/\s/)[0]
            }
            Log.mod.debug('permission %s - %s',name,text)
            Log.mod.debug(Linq.from(premission.coms).where(x=>x[name]===text).toArray())
            let p=Linq.from(premission.coms).where(x=>x[name]===text).toArray()
            if(p.length<1 || premission.check(ctx,p[0].permission)){
                next()
            }else{
                ctx.reply('权限不足')
            }
    }
}
module.exports=premission