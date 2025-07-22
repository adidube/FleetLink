import React, { useState } from "react";
import "./SearchAndBook.css";
import axios from "axios";

const URL="http://localhost:3000/api";

const initialData={
    capacityRequired: "",
    fromPincode: "",
    toPincode: "",
    startTime: "",
  }

function SearchAndBook () {
  const [search, setSearch] = useState(initialData);
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const searchVehicles = async () => {
    setMessage("");
    try {
      const res = await axios.get(
        `${URL}/vehicles/available`,
        { params: search }
      );
      setResults(res.data);
    } catch (err) {
      setMessage("Error fetching available vehicles.");
    }
  };

  const bookVehicle = async (vehicleId) => {
    try {
      await axios.post(`${URL}/bookings`, {
        vehicleId,
        fromPincode: search.fromPincode,
        toPincode: search.toPincode,
        startTime: search.startTime,
        customerId: "test-user-123",
      });
      setMessage("Booking successful!");
    } catch (err) {
      setMessage(err.response?.data?.error || "Booking failed.");
    }
  };

  return (
    <div className="container">
      <h2>Search & Book Vehicles</h2>
      <div className="search-container">
        <input
          name="capacityRequired"
          type="number"
          placeholder="Capacity Required"
          onChange={handleChange}
        />
        <input
          name="fromPincode"
          placeholder="From Pincode"
          onChange={handleChange}
        />
        <input
          name="toPincode"
          placeholder="To Pincode"
          onChange={handleChange}
        />
        <input name="startTime" type="datetime-local" onChange={handleChange} />
        <button onClick={searchVehicles}>Search Availability</button>
      </div>

      {results?.map((vehicle) => (
        <div
          key={vehicle._id}
          style={{
            border: "1px solid black",
            marginTop: "10px",
            padding: "10px",
          }}
          className="result-container"
        >
          <p>
            <strong>{vehicle.name}</strong>
          </p>
          <p>Capacity: {vehicle.capacityKg} KG</p>
          <p>Tyres: {vehicle.tyres}</p>
          <p>Estimated Duration: {vehicle.estimatedRideDurationHours} hrs</p>
          <button onClick={() => bookVehicle(vehicle._id)}>Book Now</button>
        </div>
      ))}

      {message && <p>{message}</p>}
    </div>
  );
};

export default SearchAndBook;
