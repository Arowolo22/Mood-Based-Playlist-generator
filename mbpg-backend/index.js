import express from "express"
import fetch from "node-fetch"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())


const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET

const moodToGenre={
    happy:"pop",
    sad:"äcoustic",
    energetic:"rock",
    chil:"lofi",
    romantic:"rnb",
    sunny:"reggae",
    rainy:"jazz",
    sleppy:"classical"
}



// Get Spotify Access Token
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

  if(!response.ok){
    const errorData = await response.json();
    console.error("SPOTIFY TOKEN ERROR:", errorData)
    throw new Error("failed to fetch access token")
  }


  const data = await response.json();
  return data.access_token; 
}
getAccessToken();

//Routes

app.get("/songs/:mood", async (req, res) => {
  try {
    const { mood } = req.params;
    const genre = moodToGenre[mood.toLowerCase()] || "pop";

    const token = await getAccessToken();

    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?limit=10&seed_genres=${genre}`,

      {
        headers: {
          Authorization: `bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Spotify Token Error:", errorText);
      throw new error("Failed to get spotify access token");
    }
    const data = await response.json();

    const songs = data.track.map((track) => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map((a) => a.name).join(", "),
      duration: track.duration_ms, 
      image:track.album.images[0]?.url || ""
    }));

    res.json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running at ${PORT}`));

