
export default function HelpContent() {

    return <div>
        <h1>Controls</h1>
        <h2>Camera Controls</h2>
        <h3>Mouse Controls</h3>
        <ul>
            <li>Left click and drag on the 3D viewport to rotate the camera.</li>
            <li>Right click and drag to pan the camera.</li>
            <li>Use the scroll wheel to zoom in and out.</li>
            <li>Camera type changing and camera resetting can be accesed in the inputs under the viewport.</li>
        </ul>
        <h3>Keyboard Controls</h3>
        <ul>
            <li>Use the arrow keys to pan the camera while the 3D viewport is focused.</li>
            <li>Hold CTRL/SHIFT and use the arrow keys to rotate the camera.</li>
            <li>Use the + and - keys to zoom in and out.</li>
            <li>Camera type changing and camera resetting can be accesed in the inputs under the viewport.</li>
        </ul>
        <h2>Dataset Controls</h2>
        <p>The dataset and histogram representation can be manipulated using the inputs under the viewport. Show the advanced options for more fine-grained contols over the histogram.</p>
    </div>;
}