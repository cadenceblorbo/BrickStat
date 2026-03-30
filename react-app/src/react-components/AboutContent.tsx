export default function AboutContent() {

    return <div>
        <h1>About</h1>
        <p>This application was developed as a way to teach myself web development using React while bolstering my portfolio. It was inspired by watching a <a href="https://www.youtube.com/watch?v=FHNwUiu_8Eg" target="_blank" rel="noopener noreferrer">Secret Base video</a> while sorting through my childhood LEGO collection. My main goals were to understand modern web technologies such as React and three.js, to approach 3D rendering on the web from a higher level perspective, and to learn principles and best practices for web accessibility.</p>
        <p>If you would like to see more of my work, or would like to get in touch, you can check out <a href="https://www.cadencehagenauer.com/" target="_blank" rel="noopener noreferrer">my portfolio website</a>.</p>
        <h2>Dataset</h2>
        <p>The dataset used for this app was kindly provided by <a href="https://rebrickable.com/home/" target="_blank" rel="noopener noreferrer">Rebrickable</a>. This tool lumps different prints and mold versions together, so numbers will differ slightly from their website.</p>
        <p>The publicly hosted version of this app uses the dataset from February 23, 2026. If you would like to run the app with a more up-to-date dataset, you will need the inventories.csv, sets.csv, and inventory_parts.csv files from <a href="https://rebrickable.com/downloads/" target="_blank" rel="noopener noreferrer">Rebrickable's download page</a>, along with the app itself, discussed below.</p>
        <h2>Code</h2>
        <p>You can find the code for this app <a href="https://github.com/cadenceblorbo/BrickStat" target="_blank" rel="noopener noreferrer">here</a>. If you would like to run the app on your own, check out the project's README.</p>
        <p>This app was developed using <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">React</a> and the <a href="https://github.com/vitejs/vite" target="_blank" rel="noopener noreferrer">Vite</a> local development server. It was written using TypeScript, TSX, HTML, and CSS.</p>
        <p>The 3D viewport uses the <a href="https://github.com/pmndrs/react-three-fiber" target="_blank" rel="noopener noreferrer">React Three Fiber</a> library, alongside a couple utilities from <a href="https://github.com/pmndrs/drei" target="_blank" rel="noopener noreferrer">drei</a>.</p>
        <p>Screenreader accessibility for the 3D viewport is provided by a tweaked version of the <a href="https://github.com/pmndrs/react-three-a11y" target="_blank" rel="noopener noreferrer">React Three a11y</a> library.</p>
        <p>If you encounter any issues while using this app, feel free to <a href="https://github.com/cadenceblorbo/BrickStat/issues" target="_blank" rel="noopener noreferrer">open an issue on GitHub</a> and I will do my best to address it.</p>
    </div>;
}