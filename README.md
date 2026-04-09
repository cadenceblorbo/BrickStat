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
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#Acknowledgments">Acknowledgments</a></li>
  </ol>
</details>


## About The Project

BrickStat is an application developed using React which allows users to visualize the distribution of common LEGO elements over time using a 3D histogram. Developed as a way to teach myself modern web development techniques, and inspired by a [Secret Base video](https://www.youtube.com/watch?v=FHNwUiu_8Eg), it aims to deliver a customizable, performant, and accessible interface for users interested in exploring historical LEGO data. You can find the application hosted here, or download it to run locally using your own data.

This application uses the dataset avaliable for public download from Rebrickable [here](https://rebrickable.com/downloads/).

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Getting Started

Download the latest LibOnly archive or the .dll and place it in your project. Import the MIDI2Event namespace at the top of your script with a `using` statement:
```csharp
using MIDI2Event;
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Local Hosting

First, create a MIDI2EventSystem using its constructor, passing in the path to your MIDI chart (and an optional lowest octave if your DAW doesn't use -1 as its lowest):
```csharp
MIDI2EventSystem(string filePath, int lowestOctave = -1)
```
<br/>

To subscribe events to this system, use the `MIDI2EventSystem.Subscribe()` method:
```csharp
public Action Subscribe(
    Action action,
    Notes note = 0,
    int octave = 0,
    SubType type = SubType.NoteStart
)
```
This method allows you to specify what event you want an `Action` to be triggered by. Currently, you can trigger an action using:
* `SubType.NoteStart`
* `SubType.NoteStop`
* `SubType.ChartEnd`

If you are using a note-based event, you can specify which note and octave to assign the `Action` to.
<br/>
<br/>

Call `MIDI2EventSystem.Update()` in whatever update function your engine/tool has, passing in the deltaTime in seconds (preferably calculated from the samples of the playing audio).
<br/>
<br/>

You can control the playback of the event system using `Play()`, `Pause()`, `Stop()`, and `Reset()`.
<br/>
<br/>

**Currently, the user is responsible for implementing control over the actual audio that plays, as that is dependent on the engine/tool you are using. There are plans to make premade packages for Godot and Unity in the future.**
<br/>
<br/>


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

