var rect = {
    perimeter : (x,y) => 2*(x+y),
    area: (x,y) => x*y
}

function solveRect(l,b){
    console.log("Solving for rectangle with l = " + l + "b =" +b );
    if(l<=0 || b<0){
        console.log("Length and breath of rectangle should be greater then zero : l = "+  l +", b = " + b);
    }else{
        console.log("area of rectangle is :"+rect.area(l,b));
        console.log("perimeter of rectangle is :"+rect.perimeter(l,b));
    }
}

solveRect(2,4);
solveRect(3,5);
solveRect(0,5);
solveRect(-2,5);
