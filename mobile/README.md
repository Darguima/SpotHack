# SpotHack App

* The Android App to download music/playlists from Spotify.

## Requirements

### spotifyApiCredentials.json

* The variables that this project use to acess the Spotify Api are saved in `src/services/spotify/spotifyApiCredentials.json`.

So you need create this file and save the required data (client_id and `${client_id}:${client_secret}` encoded in Base64) there:

> touch src/services/spotify/spotifyApiCredentials.json

```
{
  "client_id": "",
  "base64_key": ""
}
```


### youtubeApiCredentials.json

* The variables that this project use to acess the Youtube Api are saved in `src/services/youtube/youtubeApiCredentials.json`.

So you need create this file and save the required data (the key) there:

> touch src/services/youtube/youtubeApiCredentials.json

```
{
  "key": ""
}
```


### firebaseConfig.json

* The variables that this project use to acess the Firebase Services are saved in `src/services/firebase/firebaseConfig.json`.

So you need create this file and save the required data there:

> touch src/services/firebase/firebaseConfig.json

```
{
    "apiKey": "",
    "authDomain": "",
    "databaseURL": "",
    "projectId": "",
    "storageBucket": "",
    "messagingSenderId": "",
    "appId": ""
  }
```
