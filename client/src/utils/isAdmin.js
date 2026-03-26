const isAdmin=(role)=>{
    if(role?.toLowerCase() === "admin"){
        return true
    }
    return false
}

export default isAdmin