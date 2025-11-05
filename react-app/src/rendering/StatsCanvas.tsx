import { Canvas} from '@react-three/fiber'
//import CameraToy from "./CameraToy"
//import InteractableBoxMesh from "./InteractableBoxMesh"
import Histogram3D from "./Histogram3D"

function StatsCanvas() {
    
    
    return (
        <div>
            <Canvas camera={{ position: [0, 5, 5]}}>
                <ambientLight intensity={Math.PI / 2} />
                <spotLight position={[-10, -10,-10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
                <pointLight position={[10, 10, 10]} decay={0} intensity={Math.PI} />
                <Histogram3D xCols={5} yCols={5} />
            </Canvas>
        </div>
    )
}

export default StatsCanvas;