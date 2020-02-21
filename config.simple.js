let config={
    bot:{
        name:"",
        nickname:"",
        token:"",
        start:''
    },
    modules:[
        'nya',
        'cat'
    ],
    log:{
        path:__dirname,
        filelevel:'debug',
        stdlevel:'debug'
    },
    user:{
        admin:[
            0000000
        ]
    },
    proxy:process.env.node_socket_proxy || 'socks://127.0.0.1:1085'
   
}
module.exports=config