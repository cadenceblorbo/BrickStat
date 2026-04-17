import { type RefObject, useEffect } from 'react';

interface KeyboardControlsProps {
    keyboardDOMCapture?: RefObject<HTMLElement>;
    bindings?: Map<string, () => void>
}

export default function KeyboardControls({
    keyboardDOMCapture,
    bindings = new Map()
}: KeyboardControlsProps) {
    
    useEffect(() => {
        const checkForKeyEvent = (e: KeyboardEvent) => {
            if (bindings.has(e.key)) {
                const func = bindings.get(e.key);
                if (func !== undefined) {
                    func();
                }
            }
        };

        const capture = keyboardDOMCapture && keyboardDOMCapture.current ? keyboardDOMCapture.current : window;

        capture.addEventListener('keydown', checkForKeyEvent as EventListener);

        return () => capture.removeEventListener('keydown', checkForKeyEvent as EventListener);
    }, [keyboardDOMCapture, bindings]);

    return <></>;
}