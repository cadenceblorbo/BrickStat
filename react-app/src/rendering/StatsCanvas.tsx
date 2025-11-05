import { Canvas} from '@react-three/fiber'
import CameraToy from "./CameraToy"
import InteractableBoxMesh from "./InteractableBoxMesh"

function StatsCanvas() {
    
    
    return (
        <div>
            <Canvas>
                
                <ambientLight intensity={Math.PI / 2} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
                <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
                <InteractableBoxMesh position={[-1.2, 0, 0]} />
                <InteractableBoxMesh position={[1.2, 0, 0]} />
                <CameraToy></CameraToy>
            </Canvas>
        </div>
    )
}

export default StatsCanvas;