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

const globalState = {
    isActive: false,
};

function canStart() {
    return !globalState.isActive;
}

function start({ event, dragType, getDropTargetsOver, dispatchEvent }) {
    if (!canStart()) return;
}

export const lifecycle = {
    canStart,
    start,
};

export function makeDropTarget(typeKey, defaultDropEffect) {
    const registry = new WeakMap();

    const dropTargetDataAtt = `data-drop-target-for-${typeKey}`;
    const dropTargetSelector = `[${dropTargetDataAtt}]`;

    const actions = {
        onGenerateDragPreview: notifyCurrent,
        onDrag: notifyCurrent,
        onDragStart: notifyCurrent,
        onDrop: notifyCurrent,
    }

    function notifyCurrent({ eventName, payload }) { }

    function addToRegistry(args) {
        registry.set(args.element, args);
        return () => registry.delete(args.element);
    }

    const dropTargetForConsumers = () => {
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