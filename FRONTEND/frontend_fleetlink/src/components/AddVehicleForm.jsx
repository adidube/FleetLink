import React, { useState } from 'react';
import './AddVehicleForm.css'
import axios from 'axios';

const URL="http://localhost:3000/api";
const initialData={ name: '', capacityKg: '', tyres: '' };

function AddVehicleForm () {
  const [form, setForm] = useState(initialData);
  const [message, setMessage] = useState('');

  const handleChange = (e)=> {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post(`${URL}/vehicles`, form);
      setMessage('Vehicle added successfully!');
    } catch (err) {
      setMessage('Failed to add vehicle.');
    }
  };

  return (
    <div>
      <h2>Add Vehicle</h2>
      <form onSubmit={handleSubmit} className='form-container'>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="capacityKg" type="number" placeholder="Capacity (KG)" onChange={handleChange} required />
        <input name="tyres" type="number" placeholder="Tyres" onChange={handleChange} required />
        <button type="submit">Add Vehicle</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddVehicleForm;


