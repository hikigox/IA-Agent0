const Tools = require('../tools/MatrixTool');
class AgentController {
    constructor() {
        this.agents = {};
        this.world0 = null;
        this.world = null;
        this.actions = [];
        this.data = { states: {}, world: {},models:{},types:{} }
    }
    /**
     * Setup the configuration for the agent controller
     * @param {Object} parameter 
     */
    setup(parameter) {
        
        this.problem = parameter.problem;
        this.world0 = JSON.parse(JSON.stringify(parameter.world));
        this.data.world = JSON.parse(JSON.stringify(parameter.world));
        for (let agentsKey in this.agents) {
            if (this.agents[agentsKey].model !== undefined){
                this.agents[agentsKey].model = Tools.Creatematriz(this.world0[0].length, this.world0.length);
             //this.agents[agentsKey].model[this.data.states[agentsKey].y][this.data.states[agentsKey].x] = 1;
                this.data.models[agentsKey] = this.agents[agentsKey].model;

            }
        }
    }
    /**
     * Register the given agent in the controller pool. The second parameter stand for the initial state of the agent
     * @param {Agent} agent 
     * @param {Object} state0 
     */
    register(agent, state0) {

        //revisa si el agente ya esta creado
        if (this.agents[agent.getID()]) {
            throw 'AgentIDAlreadyExists';
        } else {
            //optiene el id del agente y su estado inicial

            this.agents[agent.getID()] = agent;
            this.data.states[agent.getID()] = state0;
            this.data.types[agent.getID()] = agent.type;
            //TODO conver state0 to an inmutable object
            // inicializa el estadado inicial
            agent.setup(state0);
        }
    }
    /**
     * Remove the given agent from the controller pool
     * @param {Object} input 
     */
    unregister(input) {
        let id = "";
        // revisa los dos tipos de forma de encontrar al agente
        if (typeof input == 'string') {
            id = input;
        } else if (typeof input == 'object') {
            id = input.getID();
        } else {
            throw 'InvalidAgentType';
        }
        // para al agente y lo elimina
        let agent = this.agents[id];
        agent.stop();
        delete this.agents[id];
    }

    /**
    * This function start the virtual life. It will continously execute the actions
    * given by the agents in response to the perceptions. It stop when the solution function
    * is satisfied or when the max number of iterations is reached.
    * If it must to run in interactive mode, the start mode return this object, which is actually 
    * the controller
    * @param {Array} callbacks 
    */
    start(callbacks, interactive = false) {
        this.callbacks = callbacks;
        this.currentAgentIndex = 0;
        if (interactive === false) {
            this.loop();
            return null;
        }
        else {
            return this;
        }
    }

    /**
     * Executes the next iteration in the virtual life simulation
     */
    next() {
        //mira si el problema no se a resuelto
        if (!this.problem.goalTest(this.data)) {
//optione los id de los agentes
            let keys = Object.keys(this.agents);
            // saca el agente actual
            let agent = this.agents[keys[this.currentAgentIndex]];
            //le manda al agente la percepcion
            agent.receive(this.problem.perceptionForAgent(this.getData(), agent.getID()));
            // guarda la accion que toma el agente
            let action = agent.send();
            // guarda la accion del agente en el arreglo de actions
            this.actions.push({ agentID: agent.getID(), action });
            //actuliza el problema
            this.problem.update(this.data, action, agent.getID());
            // si el problema fue resuelto termina todo
            if (this.problem.goalTest(this.data)) {
                this.finishAll();
                return false;
            } else {
//mira si esta el onTurn y le manda los datos
                if (this.callbacks.onTurn) {
                    this.callbacks.onTurn({ actions: this.getActions(), data: this.data });
                }
                // revisa que el agente este dentro de el arreglo
                if (this.currentAgentIndex >= keys.length - 1)
                    this.currentAgentIndex = 0;
                else
                    this.currentAgentIndex++;
                return true;
            }
        }
    }

    /**
     * Virtual life loop. At the end of every step it executed the onTurn call back. It could b used for animations of login
     */
    loop() {
        let stop = false;
        while (!stop) {
            //Creates a thread for every single agent
            Object.values(this.agents).forEach(agent => {
                if (!this.problem.goalTest(this.data)) {
                    // aqui el agente recibe las persepciones
                    agent.receive(this.problem.perceptionForAgent(this.getData(), agent.getID()));
                    //guarda el accion
                    let action = agent.send();
                    this.actions.push({ agentID: agent.getID(), action });
                    //actuliza el problema
                    this.problem.update(this.data, action, agent.getID());
                    //mira si termino el problema
                    if (this.problem.goalTest(this.data)) {
                        stop = true;
                    } else {
                        if (this.callbacks.onTurn)
                        //es un callback que muestra la posicion en la que esta callbacks
                            this.callbacks.onTurn({ actions: this.getActions(), data: this.data });
                    }
                }
            });
        }
        this.finishAll();
    }

    /**
     * This function is executed once the virtual life loop is ended. It must stop every single agent in the pool
     * and execute the onFinish callback 
     */
    finishAll() {
        let model = []
        // Stop all the agents
        Object.values(this.agents).forEach(agent => {
            //agent.stop();
            model = agent.model;
            this.unregister(agent);
        });
        //Execute the callback
        if (this.callbacks.onFinish)
            // pasa las acciones que se hicieron y la data
            this.callbacks.onFinish({ actions: this.getActions(), data: this.data, model});
    }

    /**
     * Return a copu of the agent controller data. The returned object contains the data of the problem (world) and the
     * state of every single agent in the controller pool (states)
     */
    getData() {
        return this.data;
    }
    /**
     * Return the history of the actions performed by the agents during the current virtual life loop
     */
    getActions() {
        return JSON.parse(JSON.stringify(this.actions));
    }

    /**
     * This function stop all the threads started by the agent controller and stops registered agents
     */
    stop() {
        this.finishAll();
    }
}

module.exports = AgentController;