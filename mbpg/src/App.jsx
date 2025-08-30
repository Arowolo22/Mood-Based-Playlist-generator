import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MoodSelector from "./components/MoodSelector";

const moods = [
  { id: "happy", name: "Happy", color: "yellow" },
  { id: "sad", name: "Sad", color: "blue" },
  { id: "energetic", name: "Energetic", color: "red" },
  { id: "chill", name: "Chill", color: "green" },
  { id: "romantic", name: "Romantic", color: "pink" },
  { id: "sleepy", name: "Sleepy", color: "purple" },
  { id: "sunny", name: "Sunny", color: "orange" },
  { id: "rainy", name: "Rainy", color: "indigo" },
];

//http://localhost:5000/api/playlist?mood=${mood}
const App = () => {
  const [selectedMood, setSelectedMood] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/moodselector" />} />
        <Route
          path="/moodselector"
          element={
            <MoodSelector
              moods={moods}
              selectedMood={selectedMood}
              onSelectMood={setSelectedMood}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
