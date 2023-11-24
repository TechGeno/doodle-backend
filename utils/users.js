const users=[]
const addUser=({username,roomId,host,presenter})=>{
    const user={username,roomId,presenter,host};
    users.push(user)
    return user
}

const removeUser=(id)=>{
    const index=users.findIndex(user=>user.username==id)
    if(index!=-1){
        return users.splice(index,1)[0]
    }
    
}

const getUser=(id)=>{
    return users.find((user)=>user.username==id)
}

const getUsersInRoom=(roomId)=>{
    return users.filter((user)=>user.roomId==roomId)
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}