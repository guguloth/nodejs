module.exports = (x, y, callback) =>{
    if(x<=0 || y<=0){
        setTimeout(() => {
            callback(new Error("Length and breath of rectangle should be greater then zero : l = "+  x +", b = " + y),null)
        },5000)
    }else{
        setTimeout(() =>{
            callback(null,{
                perimeter : () => 2*(x+y),
                area : () => x*y
            })
        },5000)
    }
}




