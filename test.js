let ws = require('nodejs-websocket')

const port = 3000

let clientCount = 0

let server = ws.createServer(function (chater) {
    console.log('有狗进来了！')
    clientCount ++
    chater.nickname = 'user' + clientCount
    let mes = {}
    mes.type = 'notice'
    mes.nickname = chater.nickname
    mes.message = `欢迎${chater.nickname}加入聊天室！`
    broadcast(JSON.stringify(mes))
    chater.on('text',function (str) {
        let changenameA = str.slice(0,5)
        let changenameB = str.slice(5)
        if(changenameA === '/nick'){
            let oldname = chater.nickname
            chater.nickname = changenameB
            mes.type = 'changename'
            mes.nickname = changenameB
            mes.message = `各大部门请注意${oldname}现已改名为${changenameB}!`
            broadcast(JSON.stringify(mes))
        }else{
            mes.type = 'text'
            mes.nickname = chater.nickname
            mes.message = str
            broadcast(JSON.stringify(mes))
        }
    })
    chater.on('close',function () {
        mes.type = 'leave'
        mes.nickname = chater.nickname
        mes.message = `亲爱的${chater.nickname}离开了我们`
        broadcast(JSON.stringify(mes))
    })
    chater.on('connect',function () {
        mes.type = 'notice2'
        mes.nickname = chater.nickname
        mes.message = `有狗${chater.nickname}进来了`
        broadcast(JSON.stringify(mes))
    })
    chater.on('error',function (err) {
        console.log('出了点小意外',err)
    })
}).listen(port,() =>{
    console.log('朱大哥')
})

console.log("websocket server running on port" + port)

function broadcast(str) {
    for(let item of server.connections){
        console.log('better boy')
        item.sendText(str)
    }
}