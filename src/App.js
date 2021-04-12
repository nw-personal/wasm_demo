import logo from "./logo.svg";
import React, { useState, useEffect } from "react";
import "./App.css";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();
  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  const convertToGif = async () => {
    setReady(false);
    ffmpeg.FS("writeFile", "test.mp4", await fetchFile(video));

    await ffmpeg.run(
      "-i",
      "test.mp4",
      "-t",
      "5.0",
      "-ss",
      "2.0",
      "-f",
      "gif",
      "out.gif"
    );
    const data = ffmpeg.FS("readFile", "out.gif");
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "image/gif" })
    );
    setGif(url);
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);
  return ready ? (
    <div className="App">
      <h1>gif generator</h1>
      <h2>CS5610 Demo Purpose</h2>
      <h3>
        Only generate 5 secons of gif, with 2 seconds cut off at beginning of
        the video
      </h3>
      {video && (
        <video controls width="250" src={URL.createObjectURL(video)}></video>
      )}
      <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />
      <h3>Result</h3>
      <button onClick={convertToGif}>Convert</button>
      {gif && <img src={gif} width="250" />}
    </div>
  ) : (
    <h1>Loading / Converting</h1>
  );
}

export default App;
