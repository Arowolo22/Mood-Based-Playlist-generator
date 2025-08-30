// import express from "express";
// import fetch from "node-fetch";
// import cors from "cors";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const client_id = process.env.SPOTIFY_CLIENT_ID;
// const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

// // Mood → Genre mapping
// const moodToGenre = {
//   happy: "pop",
//   sad: "acoustic",
//   energetic: "rock",
//   chill: "chill", // 
//   romantic: "romance", 
//   sunny: "reggae",
//   rainy: "jazz",
//   sleepy: "piano", 
// };


// // Cache token
// let spotifyToken = null;
// let tokenExpiry = null;

// // Function to get or refresh access token
// async function getAccessToken() {
//   const now = Date.now();

//   if (spotifyToken && tokenExpiry && now < tokenExpiry) {
//     return spotifyToken; // still valid
//   }

//   const auth = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

//   const response = await fetch("https://accounts.spotify.com/api/token", {
//     method: "POST",
//     headers: {
//       Authorization: `Basic ${auth}`,
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body: "grant_type=client_credentials",
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     console.error("SPOTIFY TOKEN ERROR:", errorData);
//     throw new Error("Failed to fetch access token");
//   }

//   const data = await response.json();
//   spotifyToken = data.access_token;
//   tokenExpiry = now + data.expires_in * 1000; // expires_in is in seconds
//   return spotifyToken;
// }

// // Routes
// app.get("/songs/:mood", async (req, res) => {
//   try {
//     const { mood } = req.params;
//     const genre = moodToGenre[mood.toLowerCase()] || "pop";

//     const token = await getAccessToken();

//     const response = await fetch(
//       `https://api.spotify.com/v1/recommendations?limit=10&seed_genres=${genre}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//    if (!response.ok) {
//      const errorText = await response.text();
//      console.error("Spotify API Error:", response.status, errorText);
//      return res.status(response.status).json({
//        error: "Spotify API Error",
//        details: errorText,
//      });
//    }

//     const data = await response.json();

//     const songs = data.tracks.map((track) => ({
//       id: track.id,
//       title: track.name,
//       artist: track.artists.map((a) => a.name).join(", "),
//       duration: track.duration_ms,
//       image: track.album.images[0]?.url || "",
//     }));

//     res.json(songs);
//   }  catch (err) {
//   console.error("SERVER ERROR:", err.message, err.stack);
//   res.status(500).json({ error: "Something went wrong", details: err.message });
// }

// });

// const PORT = 5000;
// app.listen(PORT, () =>
//   console.log(`Backend running at Port:${PORT}`)
// );



import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

// Mood → Genre mapping
const moodToGenre = {
  happy: "pop",
  sad: "acoustic",
  energetic: "rock",
  chill: "chill",
  romantic: "romance",
  sunny: "reggae",
  rainy: "jazz",
  sleepy: "piano",
};

// Cache token
let spotifyToken = null;
let tokenExpiry = null;

async function getAccessToken() {
  const now = Date.now();

  if (spotifyToken && tokenExpiry && now < tokenExpiry) {
    return spotifyToken; // still valid
  }

  const auth = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("SPOTIFY TOKEN ERROR:", errorData);
    throw new Error("Failed to fetch access token");
  }

  const data = await response.json();
  spotifyToken = data.access_token;
  tokenExpiry = now + data.expires_in * 1000;
  return spotifyToken;
}

// 🎵 Route (using query ?mood=happy)
app.get("/api/playlist/:mood", async (req, res) => {
  try {
    const { mood } = req.query;

    if (!mood) {
      return res
        .status(400)
        .json({ error: "Mood query is required, e.g. ?mood=happy" });
    }

    const genre = moodToGenre[mood.toLowerCase()] || "pop";
    const token = await getAccessToken();

    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?limit=10&seed_genres=${genre}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Spotify API Error:", response.status, errorText);
      return res.status(response.status).json({
        error: "Spotify API Error",
        details: errorText,
      });
    }

    const data = await response.json();

    const songs = data.tracks.map((track) => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map((a) => a.name).join(", "),
      duration:
        Math.floor(track.duration_ms / 60000) +
        ":" +
        String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, "0"),
      image: track.album.images[0]?.url || "",
    }));

    res.json(songs);
  } catch (err) {
    console.error("SERVER ERROR:", err.message);
    res
      .status(500)
      .json({ error: "Something went wrong", details: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Backend running at Port:${PORT}`));
