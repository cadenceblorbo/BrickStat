import { useState, useEffect } from 'react';

export const useMousePos = () => {
    const [mousePos, setMousePos] = useState({
        x: 0,
        y: 0,
        moved: false
    });

    useEffect(() => {
        const updateMousePos = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY, moved: true })
        };

        window.addEventListener('mousemove', updateMousePos);

        return () => {
            window.removeEventListener('mousemove', updateMousePos);
        };

    });

    return mousePos;
};