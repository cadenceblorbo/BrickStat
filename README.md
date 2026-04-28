# NOTE: WORK IN PROGRESS

<a id="readme-top"></a>

<br />
<div align="center">
  <a href="https://github.com/cadenceblorbo/BrickStat">
    <img src="/react-app/public/brickstatlogopath.svg" alt="BrickStat" width="768">
  </a>
  <p align="center">A React application for visualizing LEGO element distributions in 3D.</p>
  <p align="center"><a href="https://github.com/cadenceblorbo/BrickStat/issues">Report Bug/Request Feature</a></p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#local-hosting">Local Hosting</a></li>
    <li><a href="#dataset-regeneration">Dataset Regeneration</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>


## About The Project

BrickStat is an application developed using React which allows users to visualize the distribution of common LEGO elements over time using a 3D histogram. Developed as a way to teach myself modern web development techniques, and inspired by a [Secret Base video](https://www.youtube.com/watch?v=FHNwUiu_8Eg), it aims to deliver a customizable, performant, and accessible interface for users interested in exploring historical LEGO data. You can find the application hosted here, or download it to run locally using your own data.

This application uses the dataset avaliable for public download from Rebrickable [here](https://rebrickable.com/downloads/).

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Getting Started

The easiest way to use this application is through GitHub pages, it is hosted [here](https://cadenceblorbo.github.io/BrickStat/).

You can also host the app locally, described below.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Local Hosting

First, you will need to [install Node.js and npm](https://nodejs.org/en/download).

Next, download the project repository, and navigate to the react-app folder in the terminal.

Here, you will need to [install vite](https://vite.dev/guide/) using:
```console
npm install -D vite
```

Then, you can run the app using:
```console
npm run dev
```

## Dataset Regeneration

If you would like to regenerate the app's dataset you will need the inventories.csv, inventory_parts.csv, and sets.csv files from [Rebrickable](https://rebrickable.com/downloads/).

Extract these files and place them in the /react-app/src/dataset folder in the project directory.

Next, you will need to run csv-to-json.ts located at /react-app/src/csv-to-json.

One way to do this is using node. Navigate to the /react-app/src folder, and run:
```console
node csv-to-json.ts
```

Once the script is finished, the next time you run the app, it should use the updated dataset!

## License

Distributed under an MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Contact

Cadence Hagenauer - [devilstritone#0000](https://discord.com/users/302985879666950144) - cadence.hagenauer@gmail.com

Project Link: [https://github.com/cadenceblorbo/BrickStat](https://github.com/cadenceblorbo/BrickStat)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Acknowledgments

* Dataset kindly provided by [Rebrickable](https://rebrickable.com/home/)
* LEGO® is a trademark of the LEGO Group of companies

<p align="right">(<a href="#readme-top">back to top</a>)</p>

