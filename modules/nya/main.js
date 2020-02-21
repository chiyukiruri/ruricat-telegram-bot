/**  
 * 一键喵叫模块
*/
let nya={
    info:{
        commands:[
            {command:'nya',fun:'nya',permission:'admin',desc:'一键喵叫'},
            {command:'id',fun:'getMyId',permission:'all',desc:'获取用户 id'}
        ],
        inlines:[
            // {name:'',regx:'',fun:'',permission:'all',desc:''}
        ],
        on:[
            // text:'',
            // message:''
        ],
        description:'一键喵叫模块'
    },
    methods:{
        nya:ctx=>{
            let n=['喵～','喵喵','喵呜～','咕噜喵','呜喵～']
            let i=Math.floor(Math.random()*5)
            ctx.reply(n[i])
        },
        getMyId:ctx=>{
            ctx.reply(ctx.message.from.id)
        }
    }

}
module.exports=nya