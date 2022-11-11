require("dotenv").config();
const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

app.get("/", (req, res) => {
  res.render("index.hbs");
});

app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      let artistResults = data.body.artists.items;
      res.render("artist-search-results.hbs", { artistResults });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      let albumList = data.body.items;
      res.render("albums", { albumList });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/tracklist/:albumId", (req, res, next) => {
    spotifyApi
      .getAlbumTracks(req.params.albumId)
      .then((data) => {
        let tracks = data.body.items;
        res.render("tracklist", { tracks });
      })
      .catch((err) =>
        console.log("The error while searching artists occurred: ", err)
      );
  });

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
