import { useState, useEffect, useRef } from 'react';

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
        x: 0,
        y: 0,
        moved: false
    });

    useEffect(() => {
        const config = { attributes: true, attributeFilter: ['style', 'class'], subtree: false };

        const callback = () => {
            if (toTrack.offsetTop !== position.y || toTrack.offsetLeft !== position.x) {
                setPosition({ x: toTrack.offsetLeft, y:toTrack.offsetTop, moved: true});
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(toTrack, config);

        return () => {
            observer.disconnect();
        };

    });

    return position;
}