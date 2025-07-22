import React from 'react';
import { BrowserRouter , Routes, Route, Link } from 'react-router-dom';
import AddVehicleForm from './components/AddVehicleForm';
import SearchAndBook from './components/SearchAndBook';

const App = () => {
  return (
    <BrowserRouter>
      <div style={{ padding: 20 }}>
        <nav>
          <Link className="btn btn-primary" to="/">Add Vehicle</Link> | <Link className="btn btn-warning" to="/search">Search & Book</Link>
        </nav>
        <Routes>
          <Route path="/" element={<AddVehicleForm />} />
          <Route path="/search" element={<SearchAndBook />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
