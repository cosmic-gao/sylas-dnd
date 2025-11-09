// @ts-nocheck 

export function combine(...fns) {
    return function cleanup() {
        fns.forEach((fn) => fn());
    };
}

export function once(
    fn,
) {
    let cache = null;

    return function wrapped(
        this,
        ...args
    ) {
        if (!cache) {
            const result = fn.apply(this, args);
            cache = {
                result: result,
            };
        }
        return cache.result;
    };
}

export function getInput(event) {
    return {
        altKey: event.altKey,
        button: event.button,
        buttons: event.buttons,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
        clientX: event.clientX,
        clientY: event.clientY,
        pageX: event.pageX,
        pageY: event.pageY,
    };
}

function setDropEffectOnEvent({
    event,
    current,
}) {
    const innerMost = current[0]?.dropEffect;
    if (innerMost != null && event.dataTransfer) {
        event.dataTransfer.dropEffect = innerMost;
    }
}

export function getStartLocation({ event, dragType, getDropTargetsOver }) {
    const input = getInput(event);

    const dropTargets = getDropTargetsOver({
        input,
        source: dragType.payload,
        target: event.target,
        current: [],
    });
    return {
        input,
        dropTargets,
    };
}


function copyReverse(array) {
    return array.slice(0).reverse();
}

export function addAttribute(
    element,
    { attribute, value }
) {
    element.setAttribute(attribute, value);
    return () => element.removeAttribute(attribute);
}

export function makeDispatch({
    source,
    initial,
    dispatchEvent,
}) {
    let previous = { dropTargets: [] };

    function safeDispatch(args) {
        dispatchEvent(args);
        previous = { dropTargets: args.payload.location.current.dropTargets };
    }

    const dispatch = {}
    return dispatch
}

const globalState = {
    isActive: false,
};

function canStart() {
    return !globalState.isActive;
}

function start({ event, dragType, getDropTargetsOver, dispatchEvent }) {
    if (!canStart()) return;

    const initial = getStartLocation({
        event,
        dragType,
        getDropTargetsOver,
    });

    globalState.isActive = true;

    const state = {
        current: initial,
    };

    setDropEffectOnEvent({ event, current: initial.dropTargets });

    function updateState(next) {
    }

    function onUpdateEvent(event) {
    }

    function cancel() {
    }

    function finish() {
        globalState.isActive = false;
        unbindEvents();
    }

    const unbindEvents = bindAll(
        window,
        []
    )
}

export const lifecycle = {
    canStart,
    start,
};

export function makeDropTarget({ typeKey, defaultDropEffect }) {
    const registry = new WeakMap();

    const dropTargetDataAtt = `data-drop-target-for-${typeKey}`;
    const dropTargetSelector = `[${dropTargetDataAtt}]`;

    const actions = {
        onGenerateDragPreview: notifyCurrent,
        onDrag: notifyCurrent,
        onDragStart: notifyCurrent,
        onDrop: notifyCurrent,
        onDropTargetChange: ({ payload }) => {
            const isCurrent = new Set(
                payload.location.current.dropTargets.map((record) => record.element),
            );

            const visited = new Set();
            for (const record of payload.location.previous.dropTargets) {
                visited.add(record.element);
                const entry = registry.get(record.element);
                const isOver = isCurrent.has(record.element);

                const args = {
                    ...payload,
                    self: record,
                };
                entry?.onDropTargetChange?.(args);

                // if we cannot find the drop target in the current array, then it has been left
                if (!isOver) {
                    entry?.onDragLeave?.(args);
                }
            }
            for (const record of payload.location.current.dropTargets) {
                // already published an update to this drop target
                if (visited.has(record.element)) {
                    continue;
                }
                // at this point we have a new drop target that is being entered into
                const args = {
                    ...payload,
                    self: record,
                };
                const entry = registry.get(record.element);
                entry?.onDropTargetChange?.(args);
                entry?.onDragEnter?.(args);
            }
        },
    }

    function notifyCurrent({ eventName, payload }) {
        for (const record of payload.location.current.dropTargets) {
            const entry = registry.get(record.element);
            const args = {
                ...payload,
                self: record,
            };
            entry?.[eventName]?.(args);
        }
    }

    function addToRegistry(args) {
        registry.set(args.element, args);
        return () => registry.delete(args.element);
    }

    const dropTargetForConsumers = (args) => {
        const cleanup = combine(
            addAttribute(args.element, {
                attribute: dropTargetDataAtt,
                value: 'true',
            }),
            addToRegistry(args),
        );

        return once(cleanup);
    }

    const getActualDropTargets = ({ source, target, input, result = [] }) => {
        if (target == null) return result;

        if (!(target instanceof Element)) {
            if (target instanceof Node) {
                return getActualDropTargets({
                    source,
                    target: target.parentElement,
                    input,
                    result,
                });
            }
            return result;
        }

        const closest = target.closest(dropTargetSelector);
        if (closest == null) return result;

        const args = registry.get(closest);
        if (args == null) return result;

        const feedback = {
            input,
            source,
            element: args.element,
        };

        if (args.canDrop && !args.canDrop(feedback)) {
            return getActualDropTargets({
                source,
                target: args.element.parentElement,
                input,
                result,
            });
        }

        const data = args.getData?.(feedback) ?? {};
        const dropEffect =
            args.getDropEffect?.(feedback) ?? defaultDropEffect;
        const record = {
            data,
            element: args.element,
            dropEffect,
            isActiveDueToStickiness: false,
        };

        return getActualDropTargets({
            source,
            target: args.element.parentElement,
            input,
            result: [...result, record],
        });
    }

    const getIsOver = ({ source, target, input, current }) => {
        const actual = getActualDropTargets({
            source,
            target,
            input,
        });

        if (actual.length >= current.length) {
            return actual;
        }
    }

    const dispatchEvent = (args) => {
        actions[args.eventName](args);
    }

    return {
        dropTargetForConsumers,
        getIsOver,
        dispatchEvent
    }
}

export function makeAdapter({
    typeKey,
    defaultDropEffect
}) {
    const dropTargetAPI = makeDropTarget({
        typeKey,
        defaultDropEffect,
    });

    const registerUsage = () => { }

    return {
        registerUsage,
        dropTarget: dropTargetAPI.dropTargetForConsumers,
    }
}

const adapter = makeAdapter({
    typeKey: 'element',
    defaultDropEffect: 'move',
})

const itemDropTarget = makeDropTarget({
    typeKey: 'item',
    defaultDropEffect: 'move',
});

const cleanup = itemDropTarget.dropTargetForConsumers({
    element: document.getElementById('drop-zone'),
    canDrop: ({ source }) => source.type === 'item',
    onDragEnter: () => highlight(),
    onDragLeave: () => unhighlight(),
    onDrop: ({ self, source }) => {
        console.log('Dropped item:', source, 'on', self.element);
    },

});