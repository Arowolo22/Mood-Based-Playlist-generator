// import React, { useState } from "react";
// import {
//   SmileIcon,
//   FrownIcon,
//   ZapIcon,
//   CloudIcon,
//   HeartIcon,
//   MoonIcon,
//   SunIcon,
//   UmbrellaIcon,
// } from "lucide-react";
// import Header from "./header";
// import Footer from "./footer";

// const moodIcons = {
//   happy: <SmileIcon className="h-8 w-8" />,
//   sad: <FrownIcon className="h-8 w-8" />,
//   energetic: <ZapIcon className="h-8 w-8" />,
//   chill: <CloudIcon className="h-8 w-8" />,
//   romantic: <HeartIcon className="h-8 w-8" />,
//   sleepy: <MoonIcon className="h-8 w-8" />,
//   sunny: <SunIcon className="h-8 w-8" />,
//   rainy: <UmbrellaIcon className="h-8 w-8" />,
// };

// const fetchSongs = async (mood) => {
//   try {
//     const response = await fetch(`http://localhost:5000/songs/${mood}`);
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching songs:", error);
//     return [];
//   }
// };

// export const MoodSelector = ({ moods }) => {
//   const [selectedMood, setSelectedMood] = useState(null);
//   const [songs, setSongs] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleSelectMood = async (mood) => {
//     setSelectedMood(mood);
//     setLoading(true);
//     const fetchedSongs = await fetchSongs(mood.id);
//     setSongs(fetchedSongs);
//     setLoading(false);
//   };

//   return (
//     <div className="bg-black text-white min-h-screen">
//       <Header />
//       <h2 className="text-3xl font-semibold mb-6 text-center">
//         How are you feeling today?
//       </h2>

//       {/* Mood Buttons */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {moods.map((mood) => (
//           <button
//             key={mood.id}
//             onClick={() => handleSelectMood(mood)}
//             className={`
//               flex flex-col items-center justify-center p-8 rounded-xl transition-all duration-300
//               ${
//                 selectedMood && selectedMood.id === mood.id
//                   ? `bg-gradient-to-r from-${mood.color}-500 to-${mood.color}-600 shadow-lg scale-105`
//                   : `bg-gray-800 hover:bg-gray-700 hover:shadow`
//               }
//             `}
//           >
//             <div className={`mb-3 text-${mood.color}-400`}>
//               {moodIcons[mood.id]}
//             </div>
//             <span className="font-medium">{mood.name}</span>
//           </button>
//         ))}
//       </div>

//       {/* Songs Section */}
//       <div className="mt-10 px-6">
//         {loading ? (
//           <p className="text-center text-lg">Loading songs...</p>
//         ) : songs.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {songs.map((song) => (
//               <div
//                 key={song.id}
//                 className="bg-gray-900 p-5 rounded-xl shadow-md hover:shadow-lg transition"
//               >
//                 <img
//                   src={song.image}
//                   alt={song.title}
//                   className="w-full h-40 object-cover rounded-md mb-3"
//                 />

//                 <p className="text-xl font-semibold">{song.title}</p>
//                 <p className="text-gray-400">{song.artist}</p>
//                 <p className="text-sm mt-2">
//                   {Math.floor(song.duration / 60000)}:
//                   {((song.duration % 60000) / 1000).toFixed(0).padStart(2, "0")}{" "}
//                   mins
//                 </p>
//               </div>
//             ))}
//           </div>
//         ) : selectedMood ? (
//           <p className="text-center text-gray-400">
//             No songs found for {selectedMood.name}.
//           </p>
//         ) : null}
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default MoodSelector;




import React, { useState } from "react";
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
import Header from "./header";
import Footer from "./footer";

const moodIcons = {
  happy: <SmileIcon className="h-8 w-8" />,
  sad: <FrownIcon className="h-8 w-8" />,
  energetic: <ZapIcon className="h-8 w-8" />,
  chill: <CloudIcon className="h-8 w-8" />,
  romantic: <HeartIcon className="h-8 w-8" />,
  sleepy: <MoonIcon className="h-8 w-8" />,
  sunny: <SunIcon className="h-8 w-8" />,
  rainy: <UmbrellaIcon className="h-8 w-8" />,
};

const moodColors = {
  happy: "",
  sad: "",
  energetic: "",
  chill: "",
  romantic: "",
  sleepy: "",
  sunny: "",
  rainy: "",
};

// ✅ Fixed: use the correct backend route
const fetchSongs = async (mood) => {
  try {
    const response = await fetch(`http://localhost:5000/api/playlist/${mood}`);
    if (!response.ok) {
      throw new Error("Failed to fetch songs");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching songs:", error);
    return { error: "Failed to fetch songs" };
  }
};

export const MoodSelector = ({ moods }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSelectMood = async (mood) => {
    setSelectedMood(mood);
    setLoading(true);
    setError("");

    const fetchedSongs = await fetchSongs(mood.id); // ✅ send mood.id

    if (fetchedSongs.error) {
      setError(fetchedSongs.error);
      setSongs([]);
    } else {
      setSongs(fetchedSongs);
    }

    setLoading(false);
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Header />
      <h2 className="text-3xl font-semibold mb-6 text-center">
        How are you feeling today?
      </h2>

      {/* Mood Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => handleSelectMood(mood)}
            className={`
              flex flex-col items-center justify-center p-8 rounded-xl transition-all duration-300
              ${
                selectedMood?.id === mood.id
                  ? `bg-gradient-to-r ${
                      moodColors[mood.id]
                    } shadow-lg scale-105`
                  : `bg-gray-800 hover:bg-gray-700 hover:shadow`
              }
            `}
          >
            <div className={`mb-3 ${moodColors[mood.id].split(" ").pop()}`}>
              {moodIcons[mood.id]}
            </div>
            <span className="font-medium">{mood.name}</span>
          </button>
        ))}
      </div>

      {/* Songs Section */}
      <div className="mt-10 px-6">
        {loading ? (
          <p className="text-center text-lg">Loading songs...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : songs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {songs.map((song) => (
              <div
                key={song.id}
                className="bg-gray-900 p-5 rounded-xl shadow-md hover:shadow-lg transition"
              >
                {song.image && (
                  <img
                    src={song.image}
                    alt={song.title}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                )}
                <p className="text-xl font-semibold">{song.title}</p>
                <p className="text-gray-400">{song.artist}</p>
                <p className="text-sm mt-2">
                  {Math.floor(song.duration / 60000)}:
                  {((song.duration % 60000) / 1000).toFixed(0).padStart(2, "0")}{" "}
                  mins
                </p>
              </div>
            ))}
          </div>
        ) : selectedMood ? (
          <p className="text-center text-gray-400">
            No songs found for {selectedMood.name}.
          </p>
        ) : null}
      </div>

      <Footer />
    </div>
  );
};

export default MoodSelector;
