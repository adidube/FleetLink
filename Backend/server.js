const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const vehicleRoutes = require('./routes/vehicleRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

app.use(cors());
app.use(express.json());


mongoose
  .connect("mongodb://localhost:27017/fleetlink", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con.connection);
    console.log("connection successfull");
  });

app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);


app.listen(3000, () => console.log(`Server running on port 3000`))


module.exports = app; 
