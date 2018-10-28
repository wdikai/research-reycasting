import { State } from "./state";
import { Class } from "../../utils/class";
import { Dictionary } from "../../utils/dictionary";
import { BufferRenderer } from "../../graphics/renderer";

export class StateManager implements State {
    currentState: State;
    states: Dictionary<Class<State>>;

    constructor() {
        this.states = {};
    }

    public register(stateName: string, State: Class<State>) {
        if(this.states[stateName]) {
            throw new Error(`State ${stateName} has already registered`);
        }

        this.states[stateName] = State;
    }

    public setState(stateName: string, params?: any): void {
        const State = this.states[stateName];
        let newState, currentState;
        if(!State) {
            throw new Error(`State ${stateName} isn't registered`);
        }

        newState = new State(this),
        currentState = this.currentState;
        this.currentState = null;

        if(currentState && currentState.destroy) {
            currentState.destroy();
        }

        if(newState.init) {
            newState.init(params);
        }

        this.currentState = newState;
        console.log('setState', stateName);
    }

    public update (deltaTime: number): void {
        if(this.currentState) {
            this.currentState.update(deltaTime);
        }
    }

    public draw(graphics: BufferRenderer): void {
        if(this.currentState) {
            this.currentState.draw(graphics);
        }
    }
}