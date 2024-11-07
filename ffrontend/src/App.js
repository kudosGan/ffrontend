import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './components/login';
import Header from './components/header';
import Footer from './components/footer';
import Main from './components/main';
import Admin from './components/admin';
 import ChatAgent from './components/chatAgent';
// import FlightsData from './components/flightData';

function App() {
  return (
    <Router>
      <div>
        <Header />
         <ChatAgent /> 

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
           <Route path="/main" element={<Main />} /> 
           <Route path="/admin" element={<Admin />} /> 
          {/*<Route path="/flights" element={<FlightsData />} /> */}
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
