import React, { useState } from "react";

const RoomsForm = ({ onNext }) => {
  const [rooms, setRooms] = useState([
    { name: "", image: null, imagePreview: null }
  ]);

  const handleRoomChange = (index, field, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[index][field] = value;
    setRooms(updatedRooms);
  };

  const handleImageChange = (index, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      handleRoomChange(index, "imagePreview", reader.result);
      handleRoomChange(index, "image", file);
    };
    if (file) reader.readAsDataURL(file);
  };

  const addRoom = () => {
    setRooms([...rooms, { name: "", image: null, imagePreview: null }]);
  };

  const removeRoom = (index) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(rooms);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Rooms and Photos</h2>
      {rooms.map((room, idx) => (
        <div key={idx} style={{ border: "1px solid #ddd", padding: 10, marginBottom: 10 }}>
          <input
            placeholder="Room Name (e.g. Living Room)"
            value={room.name}
            onChange={e => handleRoomChange(idx, "name", e.target.value)}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={e => handleImageChange(idx, e.target.files[0])}
            required
          />
          {room.imagePreview && (
            <img src={room.imagePreview} alt="Preview" style={{ maxWidth: 200, marginTop: 10 }} />
          )}
          {rooms.length > 1 && (
            <button type="button" onClick={() => removeRoom(idx)} style={{ marginLeft: 10 }}>
              Remove Room
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={addRoom}>Add Another Room</button>
      <br /><br />
      <button type="submit">Next</button>
    </form>
  );
};

export default RoomsForm;