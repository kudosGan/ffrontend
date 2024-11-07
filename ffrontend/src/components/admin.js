import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { FcRefresh } from "react-icons/fc";
import Papa from 'papaparse';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import './admin.css';
import DataTable from "./datatable";
import Switch from "react-switch";

function Admin() {
    const [cities, setCities] = useState([{ id: 1, departure: '', arrival: '', departureDate: '', arrivalDate: '' }]);
    const [fetchedData, setFetchedData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [leavingFrom, setLeavingFrom] = useState(null);
    const [goingTo, setGoingTo] = useState(null);
    const navigate = useNavigate();
    const [airports, setAirports] = useState([]);
    const [isRoundTrip, setIsRoundTrip] = useState(false); // Track round trip state

    useEffect(() => {
        // Fetch all flights initially
        fetch("http://localhost:5000/api/flights")
            .then((response) => response.json())
            .then((data) => {
                const parsedData = Array.isArray(data) ? data : JSON.parse(data);
                setFetchedData(parsedData);
                setFilteredData(parsedData); // Initialize with full data
            })
            .catch((error) => console.error("Error fetching data:", error));

        // Fetch airports data
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

    const handleFilter = async () => {
        // Check if both leavingFrom and goingTo are selected
        if (leavingFrom && goingTo) {
            try {
                const response = await fetch(`http://localhost:5000/api/flights/filter?departure_airport=${leavingFrom.name}&arrival_airport=${goingTo.name}&arrival_date=${cities[0].arrivalDate}`);
                const data = await response.json();
                setFilteredData(data); // Set the filtered data to display
            } catch (error) {
                console.error("Error filtering data:", error);
            }
        }
    };

    const handleInputChange = (id, field, value) => {
        // Update cities state based on input changes
        setCities(cities.map(city =>
            city.id === id ? { ...city, [field]: value } : city
        ));
    };

    const handleRefresh = () => {
        // Reset all filters and restore the initial data
        setCities([{ id: 1, departure: '', arrival: '', departureDate: '', arrivalDate: '' }]);
        setLeavingFrom(null);
        setGoingTo(null);
        setFilteredData(fetchedData); // Reset filtered data to full dataset
    };

    const handleDownload = async () => {
        // Call handleFilter to get the filtered data before downloading
        await handleFilter();
        
        // Handle download functionality (implementation needed here)
        console.log("Download button clicked");
        // You can add your download logic here, e.g., creating a CSV from the filtered data
    };
    const handleRoundTripToggle = (checked) => {
        setIsRoundTrip(checked);
        if (!checked) {
            // Clear arrival date if round trip is unchecked
            handleInputChange(cities[0].id, 'arrivalDate', '');
        }
    };


    return (
        <div>
            <div className="button-container">
                <h1 className="admin-title">Admin Page</h1>
                <button className="download-button" onClick={handleDownload}>Download</button>
                <button className="refresh-button" onClick={handleRefresh}><FcRefresh /></button>
                <button className="main-button" onClick={() => navigate('/main')}>Main</button>
                <button className="main-button" onClick={() => navigate('/login')}>Log-out</button>
            </div>

            <div className="main-container">
                <Autocomplete
                    options={airports}
                    getOptionLabel={(option) => (option ? `(${option.code}) ${option.name}` : "")}
                    value={leavingFrom}
                    onChange={(event, newValue) => {
                        setLeavingFrom(newValue);
                        handleFilter(); // Trigger filter on "Leaving from" selection
                    }}
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

                <input
                    type="date"
                    value={cities[0].departureDate}
                    onChange={(e) => handleInputChange(cities[0].id, 'departureDate', e.target.value)}
                    className="input-field date-field"
                />
                <div>
                    <label className="roundtrip-arrow">Round Trip</label>
                    <Switch className="roundtrip-switch" onChange={handleRoundTripToggle} checked={isRoundTrip} />

                </div>

                <Autocomplete
                    options={airports}
                    getOptionLabel={(option) => (option ? `(${option.code}) ${option.name}` : "")}
                    value={goingTo}
                    onChange={(event, newValue) => {
                        setGoingTo(newValue);
                        handleInputChange(cities[0].id, 'arrival', newValue ? newValue.code : '');
                        handleFilter(); // Trigger filter on "Going to" selection
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

                <input
                    type="date"
                    value={cities[0].arrivalDate}
                    onChange={(e) => handleInputChange(cities[0].id, 'arrivalDate', e.target.value)}
                    className="input-field date-field"
                    disabled={!isRoundTrip}
                    style={{backgroundColor: isRoundTrip ? 'white' : ''}}
                />
            </div>

            <div>
                {filteredData.length > 0 ? (
                    <DataTable data={filteredData} />
                ) : (
                    <p>No matching data found</p>
                )}
            </div>
        </div>
    );
}

export default Admin;
