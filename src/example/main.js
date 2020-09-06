const CleanerProblem = require('./CleanerProblem');
const CleanerAgent = require('./CleanerAgent');
const Tools = require('../tools/MatrixTool')

//Crea un problema desde el la clase que extiende de Problem
let myProblem = new CleanerProblem({ maxIterations: 25 });

myProblem.addAgent("Smith", CleanerAgent, { x: 0, y: 2 });
myProblem.solve([
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, -1]
], {
    onFinish: (result) => {
        let agentID = result.actions[result.actions.length - 1].agentID;
        console.log("agent: " + agentID);
        console.log("Model: ");
        Tools.printMatrix(result.model)
        console.log("\b")
       // console.log("Model: " + Tools.printMatrix(result.))
        let world = JSON.parse(JSON.stringify(result.data.world));
        let agentState = result.data.states[agentID];
        world[agentState.y][agentState.x] = "X"
        status = 1;
        //imprime la matriz world
        for (let line of world) {
            //imprimir las filas
            console.log(line)
            // revisar si encontro o no la meta
            for (let cell of line)

                if (cell == -1)
                    status = -1
        }
//imprimir si si o no resolvio el problema
        if (status == -1)
            console.log("Agent cannot solve this problem :(")
        else
            console.log("Agent could solve this problem :)")
    },
//Imprime las acciones del agente
    onTurn: (result) => { console.log("Turn: " + JSON.stringify(result.actions[result.actions.length - 1])) }
});
