import { useState, useEffect, useRef, useMemo, useCallback} from 'react';

export const useMousePos = () => {
    const [mousePos, setMousePos] = useState({
        x: 0,
        y: 0,
        moved: false
    });

    useEffect(() => {
        const updateMousePos = (e: MouseEvent) => {
            setMousePos({ x: e.pageX, y: e.pageY, moved: true });
        };

        window.addEventListener('mousemove', updateMousePos);

        return () => {
            window.removeEventListener('mousemove', updateMousePos);
        };

    });

    return mousePos;
};

export function useThrottle<T> (value: T, msDelay: number): T {
    const [throttleValue, setThrottleValue] = useState(value);
    const lastCalled = useRef(Date.now());

    useEffect(() => {
        const now = Date.now();
        if (lastCalled.current + msDelay <= now) {
            lastCalled.current = now;
            setThrottleValue(value);
        } else {
            const timeout = setTimeout(() => {
                setThrottleValue(value);
                lastCalled.current = Date.now();
            },
            msDelay - (now - lastCalled.current));
            return () => clearTimeout(timeout); 
        }
    }, [value, msDelay]);


    return throttleValue;
}

export function useElemPos(toTrack: HTMLElement) {
    const [position, setPosition] = useState({
        x: toTrack ? toTrack.getBoundingClientRect().left + window.scrollX : 0,
        y: toTrack ? toTrack.getBoundingClientRect().top + window.scrollY : 0,
        moved: false
    });

    const trySetPosition = useCallback(() => {
        if (!toTrack) {
            return;
        }
        const rect = toTrack.getBoundingClientRect();
        const realX = rect.left + window.scrollX;
        const realY = rect.top + window.scrollY;
        if (realY !== position.y || realX !== position.x) {
            setPosition({ x: realX, y: realY, moved: true });
        }
    }, [toTrack, position]);

    //recalculate pos on toTrack change
    useMemo(() => {
        trySetPosition();
    }, [trySetPosition]);

    useEffect(() => {
        if (!toTrack) {
            return;
        }
        const config = { attributes: true, attributeFilter: ['style', 'class'], subtree: false };

        const mutationCallback = () => {
            trySetPosition();
        };

        const observer = new MutationObserver(mutationCallback);
        observer.observe(toTrack, config);

        return () => {
            observer.disconnect();
        };

    });

    return position;
}