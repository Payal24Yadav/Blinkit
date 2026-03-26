export const validateURLConvert=(name)=>{
    const url = name.toString().replaceAll(" ","-").replaceAll(",","-").replaceAll("&","-")
    return url
}