import React, { useRef, useEffect } from "react";
import "../App.css";

import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import { drawMesh } from "./utilities";

function EmotionPage() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const blazeface = require("@tensorflow-models/blazeface");

  //  Load blazeface
  const runFaceDetectorModel = async () => {
    const model = await blazeface.load();
    console.log("FaceDetection Model is Loaded..");
    setInterval(() => {
      detect(model);
    }, 800);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const face = await net.estimateFaces(video);
      //console.log(face);

      // Websocket
      var socket = new WebSocket("ws://localhost:8000");
      var imageSrc = webcamRef.current.getScreenshot();
      var apiCall = {
        event: "localhost:subscribe",
        data: {
          image: imageSrc,
        },
      };
      socket.onopen = () => socket.send(JSON.stringify(apiCall));
      socket.onmessage = function (event) {
        var pred_log = JSON.parse(event.data);
        document.getElementById("Angry").value = Math.round(
          pred_log["predictions"]["angry"] * 100
        );
        document.getElementById("Neutral").value = Math.round(
          pred_log["predictions"]["neutral"] * 100
        );
        document.getElementById("Happy").value = Math.round(
          pred_log["predictions"]["happy"] * 100
        );
        document.getElementById("Fear").value = Math.round(
          pred_log["predictions"]["fear"] * 100
        );
        document.getElementById("Surprise").value = Math.round(
          pred_log["predictions"]["surprise"] * 100
        );
        document.getElementById("Sad").value = Math.round(
          pred_log["predictions"]["sad"] * 100
        );
        document.getElementById("Disgust").value = Math.round(
          pred_log["predictions"]["disgust"] * 100
        );

        document.getElementById("emotion_text").value = pred_log["emotion"];

        // Get canvas context
        const ctx = canvasRef.current.getContext("2d");
        requestAnimationFrame(() => {
          drawMesh(face, pred_log, ctx);
        });
      };
    }
  };

  useEffect(() => {
    runFaceDetectorModel();
  }, []);

  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f9f9f9",
      }}
    >
      {/* Webcam and Canvas */}
      <div
        style={{
          position: "relative",
          width: "640px",
          height: "480px",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Webcam
          ref={webcamRef}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      </div>

      {/* Dominant Emotion */}
      <div
        style={{
          margin: "20px",
          width: "100%",
          maxWidth: "700px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <h2
          style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}
        >
          Dominant Emotion:{" "}
          <input
            id="emotion_text"
            name="emotion_text"
            vale="Neutral"
            style={{
              width: 200,
              height: 50,
              bottom: 60,
              left: 300,
              border: "none",
              "font-size": "25px",
            }}
          ></input>
        </h2>

        {/* Emotions */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            textAlign: "left",
          }}
        >
          <div>
            <label forhtml="Angry" style={{ color: "red" }}>
              Angry{" "}
            </label>
            <progress id="Angry" value="0" max="100">
              10%
            </progress>
          </div>

          <div>
            <label forhtml="Neutral" style={{ color: "lightgreen" }}>
              Neutral{" "}
            </label>
            <progress id="Neutral" value="0" max="100">
              10%
            </progress>
          </div>

          <div>
            <label forhtml="Happy" style={{ color: "orange" }}>
              Happy{" "}
            </label>
            <progress id="Happy" value="0" max="100">
              10%
            </progress>
          </div>

          <div>
            <label forhtml="Fear" style={{ color: "lightblue" }}>
              Fear{" "}
            </label>
            <progress id="Fear" value="0" max="100">
              10%
            </progress>
          </div>
          <div>
            <label forhtml="Surprise" style={{ color: "black" }}>
              Surprised{" "}
            </label>
            <progress id="Surprise" value="0" max="100">
              10%
            </progress>
          </div>

          <div>
            <label forhtml="Sad" style={{ color: "gray" }}>
              Sad{" "}
            </label>
            <progress id="Sad" value="0" max="100">
              10%
            </progress>
          </div>

          <div>
            <label forhtml="Disgust" style={{ color: "pink" }}>
              Disgusted{" "}
            </label>
            <progress id="Disgust" value="0" max="100">
              10%
            </progress>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmotionPage;
