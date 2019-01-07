type Handler < T > = (event: T) => void;
type Unsubscribe = () => void;

export class EventEmitter < T > {
    handlers: Handler < T > [];
    constructor() {
        this.handlers = [];
    }

    on(handler: Handler<T>): Unsubscribe {
        this.handlers.push(handler);
        return () => this.handlers = this.handlers.filter(element => element !== handler);
    }

    once(handler: Handler<T>): Unsubscribe {
        let unsubscribe;
        const onceHandler: Handler<T> = (element: T) => {
            unsubscribe();
            handler(element);
        }
        unsubscribe = () => this.handlers = this.handlers.filter(element => element !== onceHandler);
        this.handlers.push(onceHandler);
        return unsubscribe;
    }

    emit(item: T): void {
        this.handlers.forEach(handler => handler(item));
    }
}