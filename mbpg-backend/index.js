import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 Get secrets from .env
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

//ACCESS TOKEN=BQDMXRqdAP2jMguUTimIC-isdmb5WFqIzPT4aB6Ejli5a-0R-aNnx9_han6IDNJs9qaYcLAr5IId5Q0yjHRkb3Ohv1lxDHsSKykd6LyMlngL-Cy_SRnkpOfoMd4Ohzau7-QHVpEjBCk


// 🎶 Mood → Genre mapping
const moodToGenre = {
  happy: "pop",
  sad: "acoustic",
  energetic: "rock",
  chill: "lofi",
  romantic: "rnb",
  sunny: "reggae", 
  sleepy: "classical", 
  rainy: "jazz", 
};

//  Get Spotify Access Token
async function getAccessToken() {
  const auth = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials", // tells Spotify we want a new token
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Spotify TOKEN error:", errorText);
    throw new Error("Failed to get Spotify access token");
  }

  const data = await response.json();
  return data.access_token; // return token string
}

// 🎵 Route: Get 10 songs based on mood
app.get("/songs/:mood", async (req, res) => {
  try {
    const { mood } = req.params; // e.g. "happy"
    const genre = moodToGenre[mood.toLowerCase()] || "pop"; // default pop

    // Get Spotify token
    const token = await getAccessToken();

    // Ask Spotify for 10 recommended songs
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
      console.error("Spotify TOKEN error:", errorText);
      throw new Error("Failed to get Spotify access token");
    }


    const data = await response.json();

    // only send title, artist, duration
    const songs = data.tracks.map((track) => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map((a) => a.name).join(", "),
      duration: track.duration_ms, // duration in ms
    }));

    res.json(songs); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Backend running at ${PORT}`)
);
