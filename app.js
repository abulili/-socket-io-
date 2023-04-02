// 引入express 通过require引入
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000, () => {
    // 回调函数
    console.log('服务启动成功');
});
let userList = [];
// 定义一个express的静态资源管理
// express提供了一个内置的方法
app.use(require('express').static('src'));
// 更改了服务（在服务端） 就必须重构项目
app.get('/', function (req, res) {
    res.redirect('login.html');
})

// emit on 
// 当用户连接时触发
io.on('connection', function (socket) {
    // socket.emit('news', { hello: 'world' });
    // socket.on('my other event', function (data) {
    //     console.log(data);
    // });
    // 接收客户端发送的消息并广播
    // socket.on('sendMsg', (data) => {
    //     console.log(data)
    //     io.emit('boadCastMsg', data)
    // })
    socket.on('login', (data) => {
        console.log(data);
        socket.userName = data.userName;
        socket.src = data.img;
        userList.push(data);
        io.emit('sendMain', data);
        io.emit('boadCastMsg', userList);
    });
    socket.on('sendMessage', (data) => {
        console.log(data);
        // 将接收到的消息广播给客户端
        io.emit('boadCastchart', data);
    })
    // 接收客户端发来的表情图片并广播
    socket.on('sendImg', (data) => {
        io.emit('boadCastEmoji', data);
    })
    
    // api 当用户断开链接时触发
    socket.on("disconnect", () => {
        // 从数组中删除元素 slice改变了原数组
        let index = userList.findIndex(item => item.userName === socket.userName);
        // 不改变原数组
        userList.splice(index, 1);
        // 我们删除了userList中退出的用户发送给客户端 还需要把新的userList发回给客户端 
        io.emit('newUserList',userList)
        // 把删除的哪一个用户的信息发回给客户端做系统提示
        io.emit('escUser',socket.userName)
    });
})