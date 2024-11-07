// FlightRow.js
import React from 'react';
import './flightRow.css';

const FlightRow = ({ flight }) => {
  return (
    <div className="flight-row">
      <div className="flight-info">
        {/*<span className="lowest-price-tag">LOWEST PRICE</span>*/}
        <div className="flight-summary">
          <div className="flight-timeline">
            <div className="bound-departure">
              <span className="bound-time">{flight.departureTime}</span>
              <span className="bound-location">{flight.departureLocation}</span>
            </div>
            <div className="segments-container">
              <div className="airline-logo">
                <img src={flight.airlineLogo} alt={flight.airline} />
              </div>
            </div>
            <div className="bound-arrival">
              <span className="bound-time">{flight.arrivalTime}</span>
              <span className="bound-location">{flight.arrivalLocation}</span>
            </div>
          </div>
          <div className="flight-duration">
            <span className="offer-type">Non-stop</span>
            <span className="bullet-point">•</span>
            <span>{flight.duration}</span>
          </div>
        </div>
      </div>

      <div className="cabin-options">
        <div className="cabin-option">
          <button className="cabin-button economy">
            <span className="cabin-price">${flight.economyPrice}</span>
            <div className="seat-left">{flight.economySeatsLeft} seats left</div>
          </button>
        </div>
        <div className="cabin-option">
          <button className="cabin-button business">
            <span className="cabin-price">${flight.businessPrice}</span>
            <div className="seat-left">{flight.businessSeatsLeft} seats left</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightRow;
