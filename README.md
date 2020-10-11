# SpotHack

* A project to download music/playlists from Spotify.

## Requirements

### SpotHackVariables.json

* The variables that this project use are saved in src/SpotHackVariables.json.

So you need crete this file and save some data there:

> `touch src/SpotHackVariables.json`

```
{
  "spotifyApiKey": "the spotify token to acess the api",
  "youtubeApiKey": "the youtube api key",

  "ffmpegPath": "the ffmpeg path",
  "ffprobePath": "the ffprobe path"
}
```

### FFMPEG

* This project need the FFMPEG. Download it from [there](https://ffmpeg.org).

What I did::

2. `sudo apt update`
1. `sudo apt install ffmpeg`
5. `ffmpeg -version`

