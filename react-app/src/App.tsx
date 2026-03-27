import Histogram3DApp from './Histogram3DApp.tsx';
import Header from './react-components/Header.tsx';
import './App.css';


function App() {
    return <div role='none'>
        <title>BrickStat 3D Histogram Viewer</title>
        <Header></Header>
        <main>
            <Histogram3DApp></Histogram3DApp>
        </main>
    </div>;
}

export default App;