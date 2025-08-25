import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
 Navigate,
} from "react-router-dom";
import Dashboard from './components/dashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard"/>} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App