import { useMemo, useRef } from 'react';

import Histogram3DApp from './Histogram3DApp.tsx';
import Header from './react-components/Header.tsx';
import HelpContent from './react-components/ControlsContent.tsx';
import './App.css';


function App() {

    const aboutRef = useRef<HTMLDialogElement>(null!);
    const helpRef = useRef<HTMLDialogElement>(null!);

    const headerButtons = useMemo(() => {
        return new Map([
            ["Controls", () => helpRef.current?.showModal()],
            ["About", () => aboutRef.current?.showModal()],
            
        ]);
    }, []);

    return <div role='none'>
        <title>BrickStat 3D Histogram Viewer</title>
        <Header
            logoSrc="./brickstatlogo.svg"
            logoAlt="BrickStat"
            navOptions = {headerButtons}
            className="header"
        ></Header>
        <main>
            <Histogram3DApp></Histogram3DApp>
        </main>
        <dialog ref={aboutRef}>
            <p>"hi"</p>
        </dialog>
        <dialog ref={helpRef}>
            <HelpContent></HelpContent>
        </dialog>
    </div>;
}

export default App;