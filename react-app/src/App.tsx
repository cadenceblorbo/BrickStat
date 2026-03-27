import { useMemo } from 'react';

import Histogram3DApp from './Histogram3DApp.tsx';
import Header from './react-components/Header.tsx';
import './App.css';


function App() {

    const headerButtons = useMemo(() => {
        return new Map([
            ["About", () => console.log("about selected")],
            ["Help", () => console.log("help selected")]

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
    </div>;
}

export default App;