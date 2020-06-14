const path=require('path')
const express=require('express')
const app=express();
const http=require('http')
const port=process.env.PORT | 5000
const socketio=require('socket.io')

const publicdir=path.join(__dirname,'../public')
app.use(express.static(publicdir))
const server=http.createServer(app);
const io=socketio(server)

const {getmessage , generatelocationmessage}=require('./utils/messages')

const {adduser,removeuser,getuser,getuserinroom}=require('./utils/users')

const Filter=require('bad-words')
//server(emit) -> client(receive) -countupdate
//client(emit) -> server(receive) -increment & decerement 
//we can add acknowledgement to bot server and client it is used as a lost argument

io.on('connection',(socket)=>{

    console.log('this is websocket connection')
    // let count=0;
    // socket.emit('countupadate',count);
    // socket.on('increment',()=>{
    //     count++;
    //     //if use socket.emit then it is only for one user to update all use io
    //     //every single connected client
    //     io.emit('countupadate',count)
    // })

    // socket.on('decrement',()=>{
    //     count--;
    //     io.emit('countupadate',count)
    // })


  


    socket.on('join',({username,room},callback)=>{

        const{error,user}=adduser({id:socket.id,username,room})

        if(error)
        {
           return callback(error)
        }

        socket.join(user.room)
        socket.emit('thismesg',getmessage(user.username,'welcome'))
        socket.broadcast.to(user.room).emit('thismesg',getmessage(user.username,`${user.username} has joined!`))

        io.to(user.room).emit('getData',{
            room:user.room,
            users:getuserinroom(user.room)
        })
        
    })

    socket.on('sendmessage',(data,callback)=>{

        const user=getuser(socket.id)

        const filter=new Filter()
        if(filter.isProfane(data))
        {
            return callback('it contains profane word')
        } 
        io.to(user.room).emit('thismesg',getmessage(user.username,data))
        callback()
    })



    socket.on('coordinates',(obj,callback)=>{
        const user=getuser(socket.id)
        
       // console.log(obj);
       io.to(user.room).emit('locationmessage',generatelocationmessage(user.username,`https://google.com/maps?q=${obj.lat},${obj.long}`));
       callback('location shared')
    })



    socket.on('disconnect',()=>{
        const user=removeuser(socket.id)
        //console.log(user);
        if(user){
            io.to(user.room).emit('thismesg',getmessage('admin',`${user.username} has left!`));
            io.to(user.room).emit('getData',{
                room:user.room,
                users:getuserinroom(user.room)
            })
        }
       

       
    })
    //socket.broadcast.emit('user added','new user added')
})

server.listen(port,()=>{
    console.log(`the port is listening at ${port}`)
})
