import React from 'react'

 import {
   SmileIcon,
   FrownIcon,
   ZapIcon,
   CloudIcon,
   HeartIcon,
   MoonIcon,
  SunIcon,
   UmbrellaIcon,
  
 } from "lucide-react";
 import Header  from "./header";
   import Footer from "./footer";  

const moodIcons = {
  happy: <SmileIcon className="h-8 w-8" />,
  sad: <FrownIcon className="h-8 w-8" />,
  energetic: <ZapIcon className="h-8 w-8" />,
  calm: <CloudIcon className="h-8 w-8" />,
  romantic: <HeartIcon className="h-8 w-8" />,
  sleepy: <MoonIcon className="h-8 w-8" />,
  sunny: <SunIcon className="h-8 w-8" />,
  rainy: <UmbrellaIcon className="h-8 w-8" />,
}

// http://localhost:5000/api/playlist?mood=${mood}

export const MoodSelector = ({ moods, onSelectMood, selectedMood }) => {
  return (
    <>
      <div className=" bg-black text-white min-h-screen ">
        <Header />
        <h2 className="text-3xl font-semibold mb-6 text-center">
          How are you feeling today?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {moods.map((mood) => (
            <button
              key={mood.id}
              onClick={() => onSelectMood(mood)}
              className={`
              flex flex-col items-center justify-center p-8  rounded-xl transition-all duration-300
              ${
                selectedMood && selectedMood.id === mood.id
                  ? `bg-gradient-to-r from-${mood.color}-500 to-${mood.color}-600 shadow-lg scale-105`
                  : `bg-gray-800 hover:bg-gray-700 hover:shadow`
              }
            `}
            >
              <div className={`mb-3 text-${mood.color}-400`}>
                {moodIcons[mood.id]}
              </div>
              <span className="font-medium">{mood.name}</span>
            </button>
          ))}
        </div>
        <Footer />
      </div>
    </>
  );
};
export default MoodSelector;

