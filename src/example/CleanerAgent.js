const Agent = require('../core/Agent');

/**
 * Simple reflex agent. Search for an object whithin a labyrinth. 
 * If the object is found the agen take it.
 */
class CleanerAgent extends Agent {
    constructor(value) {
        super(value);
        //LEFT, UP, RIGHT, DOWN, CELL
        // literal
        this.table = {
            //LEFT,UP,RIGHT,DOWN,TAKE
            "0,0,0,0,0": "UP",
            "0,0,0,1,0": "UP",
            "0,0,1,0,0": "UP",
            "0,0,1,1,0": "UP",
            "0,1,0,0,0": "RIGHT",
            "0,1,0,1,0": "RIGHT",
            "0,1,1,0,0": "LEFT",
            "0,1,1,1,0": "LEFT",
            "1,0,0,0,0": "UP",
            "1,0,0,1,0": "UP",
            "1,0,1,0,0": "UP",
            "1,0,1,1,0": "UP",
            "1,1,0,0,0": "RIGHT",
            "1,1,0,1,0": "RIGHT",
            "1,1,1,0,0": "DOWN",
            "default": "TAKE"
        };
        // 0 = model , 1 = model goal
        this.type = 0;
        this.stateGoal = {};
    }

    /**
     * We override the send method. 
     * In this case, the state is just obtained as the join of the perceptions
     */
    send() {
        // guarda la percepcion del agente
        let viewKey = this.perception.join();

        if (this.type == 0){
// mira deacuerdo a la perception del agente cual accion va tomar
            if (this.table[viewKey]) {
                return this.table[viewKey];
            } else {
                return this.table["default"];
            }

        }else if (this.type == 1){

            return this.bestNextState(this.initialState,this.stateGoal,viewKey)

        }

    }

    bestNextState(agentState, goalState,perseption){
        let count= 0;
        let result = "xd";
        if (perseption == "1,1,1,1,1"){
            return "TAKE";

        }
        perseption = perseption.split(",");



        //UP
        if ((perseption[1] !== "1")){
          count= (Math.abs((goalState.x - agentState.x)) + Math.abs((goalState.y - (agentState.y -1 ))));
          result = "UP";


        }
           //DOWN
        if(perseption[3] !== "1"){
            if(((Math.abs((goalState.x - agentState.x)) + Math.abs((goalState.y - (agentState.y +1 )))) < count ) || count == 0){
                result= "DOWN"
                count=(Math.abs((goalState.x - agentState.x)) + Math.abs((goalState.y - (agentState.y +1 ))));


            }

        }

        //LEFT
        if(perseption[0] !== "1"){
            if(((Math.abs((goalState.x - (agentState.x - 1))) + Math.abs((goalState.y - (agentState.y)))) < count) || count == 0){
                result= "LEFT"
                count=(Math.abs((goalState.x - (agentState.x - 1))) + Math.abs((goalState.y - (agentState.y ))));


            }

        }

        //RIGHT
        if(perseption[2] !== "1"){
            if(((Math.abs((goalState.x - (agentState.x + 1))) + Math.abs((goalState.y - (agentState.y ))))< count) || count == 0){
                result= "RIGHT"


            }
        }






return result;

    }
    /**
     * Return the agent id
     */
    getType() {
        return this.type;
    }
}

module.exports = CleanerAgent;