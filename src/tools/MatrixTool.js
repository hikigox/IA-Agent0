
const matrizTool = {

   Creatematriz: function matriz (x , y,flag){
    let arrayY = [];
    for (let i = 0; i < y; i++) {
        let arrayX=[]
        for (let j = 0; j < x; j++) {

            arrayX.push( (flag) ? Math.round(Math.random()*100) : 0 );

        }
        arrayY.push(arrayX);

    }
    return arrayY;

},

printMatrix: function printLine(matrix) {
    matrix.forEach((row) => {
        console.log(row);

    })



}


}


module.exports = matrizTool;