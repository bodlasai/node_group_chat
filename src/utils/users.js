const users=[];

const adduser=({id,username,room})=>{
    username=username.trim().toLowerCase();
    room=room.trim().toLowerCase();
    //validate user
    if(!username || !room)
    {
        return {
            error:'username and room are required!'
        }
    }
    //checking for exsiting user
    const exsitinguser=users.find((user)=>{
        return user.room===room && user.username===username
    })
    if(exsitinguser)
    {
        return {
            error:'user already exists'
        }
    }

    //store user
    const user={id,username,room}
    users.push(user)

    return {user}
}


const removeuser=(id)=>{
    const index=users.findIndex((user)=>{
        return user.id === id
    })
    if(index !==-1)
    {
        return users.splice(index,1)[0];
    }
}



const getuser=(id)=>{
    return users.find((user)=> user.id === id)
}

const getuserinroom=(room)=>{
    return users.filter((user)=> user.room === room)
}


module.exports={
    adduser,removeuser,getuser,getuserinroom
}

//your own
// const getuserbyroom=(room)=>{
//     const roomuser=[]
//     const getusers=users.find((user)=>{
//         if(user.room === room)
//         {
//             roomuser.push(user)
//         }
//     })
//     if(getuser)
//     {
//         return {roomuser}
//     }
//     else
//      return {roomuser}
// }

// adduser({
//     id:1,
//     username:'sai   ',
//     room:'new city'
// })
// adduser({
//     id:2,
//     username:"abhi",
//     room:"city"

// })