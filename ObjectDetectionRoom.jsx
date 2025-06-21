import React, { useEffect, useRef, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

const statusTypes = ["Undamaged", "Damaged"];

const ObjectDetectionRoom = ({ room, onComplete }) => {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusTable, setStatusTable] = useState([]);
  const [ready, setReady] = useState(false);
  const imageRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    if (room.imagePreview) {
      detectObjects();
    }
    // eslint-disable-next-line
  }, [room.imagePreview]);

  const detectObjects = async () => {
    setLoading(true);
    const img = imageRef.current;
    const model = await cocoSsd.load();
    const predictions = await model.detect(img);

    setObjects(predictions);
    setStatusTable(
      predictions.map(obj => ({
        label: obj.class,
        status: "Undamaged",
        description: ""
      }))
    );
    setLoading(false);

    drawBoxes(predictions);
  };

  const drawBoxes = predictions => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    predictions.forEach((prediction, idx) => {
      const [x, y, width, height] = prediction.bbox;
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      ctx.font = "16px Arial";
      ctx.fillStyle = "yellow";
      ctx.fillText(`${idx + 1}: ${prediction.class}`, x, y > 20 ? y - 5 : y + 20);
    });
  };

  const handleStatusChange = (idx, field, value) => {
    const updated = [...statusTable];
    updated[idx][field] = value;
    setStatusTable(updated);
  };

  const handleNext = () => {
    setReady(false);
    onComplete(
      statusTable.map((obj, idx) => ({
        ...obj,
        // label: obj.label, status: obj.status, description: obj.description
      }))
    );
  };

  return (
    <div>
      <h3>{room.name}</h3>
      {room.imagePreview && (
        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            ref={imageRef}
            src={room.imagePreview}
            alt="Room"
            style={{ display: "block", maxWidth: 500 }}
            crossOrigin="anonymous"
            onLoad={detectObjects}
          />
          <canvas
            ref={canvasRef}
            style={{ position: "absolute", left: 0, top: 0 }}
          />
        </div>
      )}
      {loading && <p>Detecting objects...</p>}

      {objects.length > 0 && (
        <table border="1" cellPadding="5" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Object</th>
              <th>Status</th>
              <th>Description (if damaged)</th>
            </tr>
          </thead>
          <tbody>
            {statusTable.map((obj, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{obj.label}</td>
                <td>
                  <select
                    value={obj.status}
                    onChange={e => handleStatusChange(idx, "status", e.target.value)}
                  >
                    {statusTypes.map(type => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </td>
                <td>
                  {obj.status === "Damaged" && (
                    <input
                      value={obj.description}
                      onChange={e => handleStatusChange(idx, "description", e.target.value)}
                      placeholder="Describe the damage"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!loading && objects.length === 0 && <p>No objects detected.</p>}
      {objects.length > 0 && (
        <button style={{ marginTop: 16 }} onClick={handleNext}>Next Room</button>
      )}
    </div>
  );
};

export default ObjectDetectionRoom;