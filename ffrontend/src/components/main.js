import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse'; 
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { FaPlane } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import './main.css';
import FlightRow from './flightRow';

function Main() {
  // Define the state for cities, fetched data, filtered data, etc.
  const [cities, setCities] = useState([{ id: 1, departure: '', arrival: '', departureDate: '', arrivalDate: '' }]);
  const [fetchedData, setFetchedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [leavingFrom, setLeavingFrom] = useState(null);
  const [goingTo, setGoingTo] = useState(null);
  const navigate = useNavigate();
  const [airports, setAirports] = useState([]);

  // Fetch airports data from the CSV
  useEffect(() => {
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    try {
      const response = await fetch('/Airports.csv');
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder("utf-8");
      const csv = decoder.decode(result.value);
      const results = Papa.parse(csv, { header: false, skipEmptyLines: true });
      const airportList = results.data.map((row) => ({
        name: row[0],
        country: row[1],
        code: row[2],
        continent: row[3]
      }));
      setAirports(airportList);
    } catch (error) {
      console.error("Error fetching airports data:", error);
    }
  };

  // Handle input changes for cities
  const handleInputChange = (id, field, value) => {
    setCities(cities.map(city =>
      city.id === id ? { ...city, [field]: value } : city
    ));
  };

  // Refresh the form fields
  const handleRefresh = () => {
    setCities([{ id: 1, departure: '', arrival: '', departureDate: '', arrivalDate: '' }]);
    setLeavingFrom(null);
    setGoingTo(null);
    setFilteredData(fetchedData);
  };

  // Example flight data
  const flightData = {
    departureTime: "05:30",
    departureLocation: "YOW",
    arrivalTime: "07:00",
    arrivalLocation: "YYZ",
    airline: "Air Canada",
    airlineLogo: "https://kilo-content.aircanada.com/ac/applications/revenue/content/1.0.138/assets/img/logos/airlines/AC.svg",
    duration: "1h 30m",
    economyPrice: 226,
    economySeatsLeft: 2,
    businessPrice: 1408,
    businessSeatsLeft: 3
  };

  return (
    <div>
      <div className='button1-containers'>
        <h1 className="fligh-title">Flight Search</h1>
        <button className="main-button" onClick={() => navigate('/admin')}>Admin</button>
        <button className="main-button" onClick={() => navigate('/login')}>Log-out</button>
      </div>

      <div className='main-containers'>
        {/* Autocomplete for "Leaving from" airport */}
        <Autocomplete
          options={airports}
          getOptionLabel={(option) => (option ? `(${option.code}) ${option.name}` : "")}
          value={leavingFrom}
          onChange={(event, newValue) => setLeavingFrom(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Leaving from"
              variant="outlined"
              className="input-field"
              InputProps={{
                ...params.InputProps,
                className: 'input-field',
              }}
            />
          )}
          isOptionEqualToValue={(option, value) => option.code === value?.code}
        />

        {/* Departure Date */}
        <input
          type="date"
          value={cities[0].departureDate}
          onChange={(e) => handleInputChange(cities[0].id, 'departureDate', e.target.value)}
          className="input-field date-field"
        />

        <span className="roundtrip-arrow">
          <FaPlane />
        </span>

        {/* Autocomplete for "Going to" airport */}
        <Autocomplete
          options={airports}
          getOptionLabel={(option) => (option ? `(${option.code}) ${option.name}` : "")}
          value={goingTo}
          onChange={(event, newValue) => {
            setGoingTo(newValue);
            handleInputChange(cities[0].id, 'arrival', newValue ? newValue.code : '');
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Going to"
              variant="outlined"
              className="input-field"
              InputProps={{
                ...params.InputProps,
                className: 'input-field',
              }}
            />
          )}
          isOptionEqualToValue={(option, value) => option.code === value?.code}
        />

        {/* Arrival Date */}
        <input
          type="date"
          value={cities[0].arrivalDate}
          onChange={(e) => handleInputChange(cities[0].id, 'arrivalDate', e.target.value)}
          className="input-field date-field"
        />

        <button className="search-button" onClick={handleRefresh}><FaSearch /></button>
      </div>

      <div className="flight-container">
        {/* Display the flight information */}
        <FlightRow flight={flightData} />
        <FlightRow flight={flightData} />
        <FlightRow flight={flightData} />
        <FlightRow flight={flightData} />
      </div>
    </div>
  );
}

export default Main;
