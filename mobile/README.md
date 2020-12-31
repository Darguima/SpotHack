# SpotHack App

* The Android App to download music/playlists from Spotify.

## Requirements

### spotifyApi.json

* The variables that this project use to acess the spotifyApi are saved in `src/services/spotifyApiCredentials.json`.

So you need create this file and save the required data (client_id and `${client_id}:${client_secret}` encoded in Base64) there:

> touch src/services/spotifyApiCredentials.json

```
{
  "client_id": "",
  "base64_key": ""
}
```
