import React, { useState } from "react";
import PartyInfoForm from "./components/PartyInfoForm";
import RoomsForm from "./components/RoomsForm";
import ObjectDetectionRoom from "./components/ObjectDetectionRoom";
import ExportInspectionPDF from "./components/ExportInspectionPDF";
import ExportInspectionDocx from "./components/ExportInspectionDocx";

function App() {
  const [step, setStep] = useState(1);
  const [landlord, setLandlord] = useState({});
  const [tenant, setTenant] = useState({});
  const [rooms, setRooms] = useState([]);
  const [roomsWithObjects, setRoomsWithObjects] = useState([]);

  // Step 1: Party Info
  if (step === 1) {
    return (
      <PartyInfoForm
        onNext={({ landlord, tenant }) => {
          setLandlord(landlord);
          setTenant(tenant);
          setStep(2);
        }}
      />
    );
  }

  // Step 2: Rooms and Photos
  if (step === 2) {
    return (
      <RoomsForm
        onNext={roomsData => {
          setRooms(roomsData);
          setStep(3);
        }}
      />
    );
  }

  // Step 3: Object Detection for each Room
  if (step === 3) {
    // All rooms done, show export buttons
    if (roomsWithObjects.length === rooms.length) {
      return (
        <div>
          <h2>Export Your Inspection Report</h2>
          <ExportInspectionPDF landlord={landlord} tenant={tenant} rooms={roomsWithObjects} />
          <ExportInspectionDocx landlord={landlord} tenant={tenant} rooms={roomsWithObjects} />
        </div>
      );
    }

    // Current room to process
    const currentRoomIdx = roomsWithObjects.length;
    const currentRoom = rooms[currentRoomIdx];

    return (
      <ObjectDetectionRoom
        room={currentRoom}
        onComplete={objectsWithStatus => {
          setRoomsWithObjects([
            ...roomsWithObjects,
            {
              ...currentRoom,
              objects: objectsWithStatus,
            },
          ]);
        }}
      />
    );
  }

  return <div>Inspection Completed!</div>;
}

export default App;