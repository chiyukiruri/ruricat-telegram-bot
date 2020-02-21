/**  
 * 猫猫图模块
*/
const crypto = require('crypto')
const Log = require('../../Log')

let m = {
    info: {
        commands: [
            {command:'cat',fun:'cat_cm',permission:'all',desc:'获取一只猫猫'},
            {command:'catgif',fun:'catgif_cm',permission:'all',desc:'获取一只会动的猫猫'}
        ],
        inlines: [
            { name: 'cat', regx: 'cat', fun: 'cat_in', permission: 'all', desc: '获取一只猫猫' },
            { name: 'catgif', regx: 'catgif', fun: 'catgif_in', permission: 'all', desc: '获取一只会动的猫猫' }
        ],
        on: [
            // {name:'cat',type:'text',fun:'catText_on',permission:'all',desc:'获取猫猫'}
        ],
        description: '猫猫图模块'
    },
    methods: {
        // catText_on:(ctx,next)=>{
        //     if(!ctx.n){
        //         next()
        //         return
        //     }
        //     // if(ctx.chat.type!=='private')
        //     let r=new RegExp('/^@'+ctx.botInfo.username+'\s (cat|catgif)')
        //     Log.mod.debug(r.exec(ctx.message.text))
        //     if(r.test(ctx.message.text)){
        //         if(r.exec(ctx.message.text)[1]==='cat'){
        //             this.methods.cat_cm(ctx)
        //         }else{
        //             this.methods.catgif_cm(ctx)
        //         }
        //     }else{
        //         next()
        //     }
        // },
        cat_cm: ctx => {
            ctx.replyWithPhoto('https://cataas.com/cat?' + Math.random())
        },
        catgif_cm: ctx => {
            ctx.tg.sendVideoNote(ctx.chat.id,'https://cataas.com/cat/gif?' + Math.random())
        },
        cat_in: (ctx, next) => {
            if(!ctx.n){
                next()
                return
            }
            for (i = 0; i < 4; i++) {
                let i=Math.floor(Math.random()*10)
                ctx.result.push({
                    type: 'photo',
                    id: '0',
                    photo_url: 'https://cataas.com/cat?'+i,
                    thumb_url: 'https://cataas.com/cat?'+i
                })
            }
            ctx.n=false
            next()
        },
        catgif_in: (ctx, next) => {
            if(!ctx.n){
                next()
                return
            }
            for (i = 0; i < 4; i++) {
                let i=Math.random()
                ctx.result.push({
                    type: 'gif',
                    id: '0',
                    gif_url: 'https://cataas.com/cat/gif?'+i ,
                    thumb_url: 'https://cataas.com/cat/gif?'+i
                })
            }
            ctx.n=false
            next()
        }
    }

}
module.exports = m