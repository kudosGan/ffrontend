import React from 'react';
import './datatable.css';

const DataTable = ({ data }) => {
    return (
        <div className="fetched-data-container">
            <table>
                <thead>
                    <tr>
                        <th>Search ID</th>
                        <th>Departure Airport</th>
                        <th>Arrival Airport</th>
                        <th>Departure Date</th>
                        <th>Arrival Date</th>
                        <th>Cost</th>
                        <th>Other Flight Details</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((item) => {
                        // Attempt to parse `other_flight_details` safely
                        let flightDetails;
                        try {
                            flightDetails = item.other_flight_details 
                                ? JSON.parse(item.other_flight_details) 
                                : {};
                        } catch (error) {
                            console.error("Error parsing flight details:", error);
                            flightDetails = {};
                        }

                        // Check for `legs` and safely access `legs[0]`
                        const firstLeg = Array.isArray(flightDetails.legs) && flightDetails.legs[0] ? flightDetails.legs[0] : {};

                        return (
                            <tr key={item.Id}>
                                <td>{item.Id}</td>
                                <td>{item.departure_airport || "N/A"}</td>
                                <td>{item.arrival_airport || "N/A"}</td>
                                <td>{item.departure_date || "N/A"}</td>
                                <td>{item.arrival_date || "N/A"}</td>
                                <td>{item.cost || "N/A"}</td>
                                <td>
                                    total_duration: {flightDetails.total_duration || "N/A"} min, 
                                    duration: {firstLeg.duration || "N/A"} min, 
                                    flight_number: {firstLeg.flight_number || "N/A"}, 
                                    carbon_emissions: {flightDetails.carbon_emissions || "N/A"}
                                </td>
                                <td>{item.created_at || "N/A"}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
