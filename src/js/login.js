// const { Socket } = require("engine.io");
// 获取变量元素  所以不推荐使用驼峰命名，以免重复
var imagList = document.querySelector('.img-List');
// var let const区别 - 使用原生var会产生变量提升，导致作用域混乱
// 先使用后定义 导致定义很多全局变量 所以采用闭包（可以有私有空间存储变量，但存在垃圾回收机制的影响 为了让全局作用域能访问到局部作用域的变量（面试））
// es6 let const -》块级作用域  let/const区别（高频面试题）：
// js中: const常量，let变量
// js 基本数据类型存在栈中 引用数据类型定义在堆中，在栈中会存放一个引用类型的指针
// let定义变量 const定义常量 面试：const定义的常量是不是一定没有办法修改（这是坑，咋说都不对）
//      const如果修改引用数据类型，不会报错，因为js中的引用数据类型是存放在队中的，而栈中只有一个指针（深浅拷贝的问题（笔试））
//      const里只是保存了引用数据类型的指针 当修改引用数据类型使 指针没有被修改 只有堆中的数据被修改了
// 深浅拷贝：浅拷贝：复制引用的指针，而不是实际地址，一改全改 深拷贝：用递归，复制实际地址，另一个指向复制的实际地址  -怎么做（？）、

// 伪数组
// 提供了两种方法改变this的指向 call bind  -》又能问到原型、原型链 prototype __proto__
// let liList = document.querySelectorAll('.img-list>li');

// 动态生成元素   doucument.createElement / ul.innerHTML
let arr = [
    {src:'../image/m.jpg'},
    {src:'../image/m.jpg'},
    {src:'../image/m.jpg'},
    {src:'../image/m.jpg'},
    {src:'../image/m.jpg'},
    {src:'../image/m.jpg'},
    {src:'../image/m.jpg'},
    {src:'../image/m.jpg'}
];
// src = ""
var socket = io.connect('http://localhost:3000');
let ul = document.querySelector('.icon>ul');
// console.log(ul);

// function createLi() {
//     let str = ``;
//     for (let i = 0; i < imgArr.length; ++i){
//         str +=   `
//                 <li><img src="${imgArr[i].src}"></li>
//                 `;
//     }
//     console.log(str);
//     return str;
// }
// imagList.innerHTML = createLi();
// 2
// function createLii() {
//     var lis = document.createElement('li');
//     var image = document.createElement('img');
//     image.src = '../image/QQ图片20230107181627.jpg';
//     imagList.append(lis);
//     lis.append(image);

let checkSrc = '';
function createLi() {
    let str = ''
    let arr = [
        {
            src: '../image/m.jpg'
        },
        {
            src: '../image/m.jpg'
        },
        {
            src: '../image/m.jpg'
        },
        {
            src: '../image/m.jpg'
        },
        {
            src: '../image/m.jpg'
        },
        {
            src: '../image/m.jpg'
        },
        {
            src: '../image/m.jpg'
        },
        {
            src: '../image/m.jpg'
        },
        {
            src: '../image/m.jpg'
        },
        {
            src: '../image/m.jpg'
        },
    ]
    let imgList = []
    arr.forEach(item => {
        let li = document.createElement('li');
        let img = document.createElement('img');
        img.src = item.src;
        imgList.push(li);
        img.onclick = () => {
            for (let i = 0; i < imgList.length; i++) {
                imgList[i].className = '';
            }
            li.className = 'checked';
            checkSrc = img.src;
        }
        li.append(img);
        ul.append(li);
    });
}

createLi();

// }
//显示隐藏
let btn = document.querySelector('.btnn');
// 全局变量 保存当前用户的名字和头像
let mainUser = '';
btn.onclick = function login() {
    let loginBox = document.querySelector('.login-box');
    let content = document.querySelector('.content');
    loginBox.style.display = 'none';
    content.style.display = 'block';
    // 获取当前登录框中输入的用户名和选择的头像 放进一个对象里 发送到服务器
    let value = document.querySelector('.form-control').value;
    let src = document.querySelector('.checked>img').src;
    mainUser = { userName: value, img: src };
    // console.log(mainUser);
    // socket.io里通信的两个方法 emit发送 on接收
    socket.emit('login', mainUser);
    let mainBox = document.querySelector('.main');
    mainBox.innerHTML = `<img src="${mainUser.img}">
                        <span class="text-color">${mainUser.userName}</span>
                        `;
}
// 定义一个方法去渲染用户列表
function createUserList(msg){
    let otherList = document.querySelector('.other-list')
    let str = ''
    msg.forEach(item => {
        str += `<li>
                    <img src="${item.img}" alt="">
                    <span class="text-color">${item.userName}</span>
                </li>`
    })
    otherList.innerHTML = str
}

// 定义一个方法动态渲染聊天室当前在线人数
function createTitle(num) {
    let title = document.querySelector('.title')
    title.innerHTML = `<p>聊天室<span>(${num}人)</span></p>`
}

// 获取服务端发回的用户信息列表 当用户列表发生改变 有用户进入聊天室的时候我们调用createTitle的方法重新渲染页面title的人数
socket.on('boadCastMsg',(msg)=>{
    createUserList(msg)
    let peopleNum = msg.length
    createTitle(peopleNum)
})

// 获取服务器发回的用户消息列表
socket.on('boadCastMsg', (msg) => {
    let otherList = document.querySelector('.other-list');
    let str = '';
    msg.forEach(item => {
        str += `<li>
                    <img src="${item.img}">
                    <span class="text-color">${item.userName}</span>
                </li>
                `;
    });
    otherList.innerHTML = str;
});

// 获取登录消息
socket.on('sendMain', (data) => {
    // console.log(data);
    // 做系统提示 innerhtml会覆盖之前的内容
    let systempMsg = `<p class="system-msg">"${data.userName}"进入聊天室</p>`;
    let flag = document.createRange().createContextualFragment(systempMsg);
    // append方法加入的是一个dom元素 而不是字符串 
    // append方法是搭配我们的document.createElement一起使用 
    // 但是如果我们要使用模板字符串添加 需要做一个转换 
    // jq append 
    // 如果要添加模板字符串形式的html元素需要做一个转换
    // 通过document.createRange().createContextualFragment
    document.querySelector(".chartlogs").append(flag);
    scrollBottom();
})

// 获取用户聊天框中输入的内容 并将改内容连同用户的用户名和头像信息一起发给服务器

function sendMsg() {
    // 获取用户聊天框中输入的内容
    let msgValue = document.querySelector('.chart-from-value').value;
    // console.log(msgValue);
    if(msgValue!==''){
        mainUser.value = msgValue;
            // 将mainUser广播
        socket.emit('sendMessage', mainUser);
    }
    // 当消息发送成功后清空聊天框中的输入内容
    document.querySelector('.chart-from-value').value = '';
};

// 客户端几首服务端广播回来的聊天消息
// 两边都能拿到消息后就可以开始渲染了
socket.on('boadCastchart', (data) => {
    let msg = '';
    // 看消息是谁发的
    if (data.userName === mainUser.userName) {
        msg = `
        <div class="self-user">
            <p class="self">${data.value}</p>
            <div><img src="${data.img}" alt=""></div>
        </div>
        `;
    }
    else {
        msg = `
        <div class="other-user">
            <img src="${data.img}" alt="">
            <p class="friend">${data.value}</p>
        </div>
            `;
    }
    let flag = document.createRange().createContextualFragment(msg);
    document.querySelector(".chartlogs").append(flag);
    scrollBottom();
});

// 接收一下服务端发送给我的新的userList
// 拿到新的userList之后把我们的用户列表重新渲染 当用户列表发生改变 有用户退出聊天室的时候我们调用createTitle的方法重新渲染页面title的人数
socket.on('newUserList',(data)=>{
    createUserList(data)
    createTitle(data.length)
})

// 接收退出用户的用户信息
socket.on('escUser',(data)=>{
    let systemMsg = `<p class="system-msg">"${data}"退出了聊天室</p>`
    // 做系统提示
    let flag = document.createRange().createContextualFragment(systemMsg)
    document.querySelector('.chartlogs').append(flag)
    scrollBottom()

})


// 定义一个将最后一个元素滚动到底部发方法使用scrollintoview
function scrollBottom(){
    let lastItem = document.querySelector('.chartlogs').lastElementChild;
    lastItem.scrollIntoView(false)
    lastItem.style.marginBottom = 0
}

