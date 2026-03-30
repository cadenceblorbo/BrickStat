import { useMemo, useRef } from 'react';

import Histogram3DApp from './Histogram3DApp.tsx';
import Header from './react-components/Header.tsx';
import AboutContent from './react-components/AboutContent.tsx';
import HelpContent from './react-components/ControlsContent.tsx';
import PopupWithClose from './react-components/PopupWithClose.tsx';
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
        <PopupWithClose ref={aboutRef}>
            <AboutContent></AboutContent>
        </PopupWithClose>
        <PopupWithClose ref={helpRef}>
            <HelpContent></HelpContent>
        </PopupWithClose>
    </div>;
}

export default App;