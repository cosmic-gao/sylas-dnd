export type MaybePromise<T> = T | Promise<T>

export type EventType = string | symbol;

export type EventCallback<T = unknown> = (event: T) => MaybePromise<void>;
export type WildcardCallback<E extends Record<EventType, any> = Record<string, unknown>> = (
    type: keyof E,
    event: E[keyof E]
) => MaybePromise<void>;

export type EventCallbackList<T = unknown> = Array<EventCallback<T>>;
export type WildCardEventCallbackList<T extends Record<EventType, any> = Record<string, unknown>> = Array<
    WildcardCallback<T>
>;

export type EventCallbackMap<E extends Record<EventType, any>> = Map<
    keyof E | '*',
    Array<EventCallback<E[keyof E]> | WildcardCallback<E>>
>;

export interface Emitter<E extends Record<EventType, any>> {
    all: EventCallbackMap<E>;

    on<K extends keyof E>(type: K, callback: EventCallback<E[K]>): () => void;
    on(type: '*', callback: WildcardCallback<E>): () => void;

    once<K extends keyof E>(type: K, callback: EventCallback<E[K]>): () => void;
    once(type: '*', callback: WildcardCallback<E>): () => void;

    off<K extends keyof E>(type: K, callback?: EventCallback<E[K]>): void;
    off(type: '*', callback?: WildcardCallback<E>): void;

    emit<K extends keyof E>(type: K, event: E[K]): void;
    emit<K extends keyof E>(type: undefined extends E[K] ? K : never): void;
}

export class EventBus<E extends Record<EventType, any> = Record<string, unknown>> implements Emitter<E> {
    public all: EventCallbackMap<E> = new Map()

    public on<K extends keyof E>(type: K | '*', callback: EventCallback<E[K]> | WildcardCallback<E>) {
        const callbacks = this.all.get(type) ?? [];
        callbacks.push(callback as EventCallback<E[keyof E]> | WildcardCallback<E>);
        this.all.set(type, callbacks);
        return () => this.off(type, callback)
    }

    public once<K extends keyof E>(type: K | '*', callback?: EventCallback<E[K]> | WildcardCallback<E>) {
        const off = this.on(type, (...args: unknown[]) => {
            off()
            const [type, event] = args as [K, E[K]];
            type === "*"
                ? (callback as WildcardCallback<E>)(type, event)
                : (callback as EventCallback<E[K]>)(event);
        });
        return off
    }

    public off<K extends keyof E>(type: K | '*', callback?: EventCallback<E[K]> | WildcardCallback<E>) {
        const callbacks = this.all.get(type)

        if (callbacks) {
            if (callback) {
                const index = callbacks.indexOf(callback as EventCallback<E[keyof E]> | WildcardCallback<E>) >>> 0
                if (index > -1) callbacks.splice(index, 1);
            }
            if (callbacks.length === 0) this.all.delete(type);
        }
    }

    public emit<K extends keyof E>(type: K, event?: E[K]): void {
        this.all.get(type)?.slice().forEach(callback => (callback as EventCallback<E[K]>)(event!));
        this.all.get('*')?.slice().forEach(callback => (callback as WildcardCallback<E>)(type, event!));
    }
}