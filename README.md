<h1 align="center">
	<a href="https://github.com/Darguima/SpotHack">
		<img alt="SpotHack" src="./readme/Logo/SpotHackLogoHorizontal_500.png" width="350px"/>
	</a>
</h1>

<h2 align="center">
	SpotHack
</h2>

<p align="center">
SpotHack is a project that allows you to convert your Spotify playlists to .mp3 files in the respective folder. Download your favorite music and playlists to listen to when you are offline. SpotHaSpotHack is also an open-source project, so anyone can help by reporting bugs, writing code, contributing to documentation, providing ideas, or just checking the <a href="https://www.github.com/Darguima/SpotHack">homepage</a>.
</p>

<h4 align="center">
⭐ Don't forget to Starring ⭐
</h4>

<h1 align="center">
		<img alt="SpotHack" src="./readme/ScreenShots/AllPages.png" max-height=5000px"/>
</h1>

<br/>

## Version 1.1

You are currently in the branch for the V1.1. All the packages (including React Native) were updated (until the last commit). However, we concluded that one crucial package (`react-native-ytdl`) is outdated and doesn't have replacement by now. So this branch is by now paused.

For future references, this are the next steps to conclude the V1.1:

- [ ] Update the `react-native-ytdl` package or find a replacement
- [ ] Reactive `src/SpotHack_Core/DownloadMachine/machineMethods/foregroundService.ts`
- [ ] Check if the `react-native-ffmpeg` is still working (mainly because `FFmpegKit.disableLogs()`)
- [ ] Find a new Youtube Scraper (optional)
- [ ] Improve the DownloadMachine (optional)

## Table of Contents 🗃️

- [Download & Installation](#download--installation-)
- [How it works?](#how-it-works-)
- [Getting Started](#getting-started-)
- [API Credentials](#api-credentials)
- [Pages/Features](#pagesfeatures-)
- [Technologies Used](#technologies-used-)
- [Disclaimer](#-disclaimer-)
- [License](#license-%EF%B8%8F)

## Download & Installation 📥📲

You can download this app from the Releases section or build the code with any changes you may want.

* [Download APK](https://github.com/Darguima/SpotHack/releases/download/v1.0.1/SpotHack.apk) - (don't forget the [API Credentials](#api-credentials) and the [SpotHack Server](#spothack-server-))
* [Download and Build the Code](#getting-started-)
* [Download APK 🔑](https://github.com/Darguima/SpotHack/releases/download/v1.0.1/SpotHackLocked.zip) for my friends - (__need password to install__ 🔒)

###### Note: This project was only developed for Android, no IOS support available;

## How it works? ⚙⚙

After you select your music or playlist, our `Download Machine` will use the `YouTube Scraper` or the YouTube API to search for the music video, starting with the artist's name followed by the track name. Once we get the YouTube ID, we can download the music video and convert it to `.mp3` with `ffmpeg`.

## Getting Started 🚀

### Prerequisites

- `Git` to clone the repository;

- `Yarn` to install dependencies;

- `Node 18` or newer;

- To run the project, you will need the `React Native` Environment configured. You can follow the [ReactNative Official Documentation](https://reactnative.dev/docs/environment-setup#development-os);


##### Cloning

```bash
$ git clone git@github.com:Darguima/SpotHack.git
```

##### Installing Dependencies

```bash
$ yarn
```

##### Setting the SpotHack Server 🌐

Unfortunately, after the first version we needed to create a server to deal with some steps.

You can save the Server URL in a `.env` file or input them directly on the App. To deploy the server you can follow our [tutorial](#spothack-server-).

##### Set credentials for third-party APIs 🪪

This App use 2 third-party APIs:
* Spotify Api (Web Api)
* Youtube Api (YouTube Data API v3) - optional

You can save this credentials in a `.env` file or input them directly on the App. To get the required credentials you can follow our [tutorial](#api-credentials).

### Setup 🛠️

- To setup the application you can use:

```bash
yarn start
yarn android
```

At this moment you should have a Android Emulator with `SpotHack` running


### Building the APK

#### Generate a KeyStore 🔑

Fill in the required fields (and remember the password):

```bash
$ keytool -genkey -v -keystore android/app/spothack.keystore -alias spothack -keyalg RSA -keysize 2048 -validity 10000
```

#### Edit the gradle ✏️

Edit the file `android/app/build.gradle`, changing `storePassword` and `keyPassword` to the previous password.

#### Assemble 🧑‍🏭

```bash
cd android
./gradlew assembleRelease
```

###### Based on [this](https://instamobile.io/android-development/generate-react-native-release-build-android/) tutorial.

---

## SpotHack Server 🌐

The initial version of SpotHack managed to don't rely on a server, however, due the Youtube restrictions and the React Native limitations, we had to create a Node.js server that is dealing with some steps (by now, is doing the Youtube Scrape and the conversion from the video Id to a downloadable link).

To host this server, you can use basic computers (like Raspberry Pi), since it is just a small [Express](http://expressjs.com/) server. If you don't want a dedicated server, you can even use your computer, as long as the server is on when you are using the app.

To setup the server you can follow the next steps:

```bash
# Clone this repo on a dedicated folder
$ git clone git@github.com:Darguima/SpotHack.git SpotHackServer 

# Enter the folder
$ cd SpotHackServer

# Go to the server branch
$ git switch server

# Install the dependencies
$ yarn

# Start the server
$ yarn build
$ yarn deploy
```

Now you need to provide the server URL to the app. This URL is the link that you use to access the server from **outside the localhost** (probably is `https://<server_IP>:3000`). To store the URL, you can create a file named `.env` with the following structure, or you can input it directly in the app, below the login page or in the app settings.

```env
SPOTHACK_SERVER_URL= ...
```

---

## API Credentials 🪪

To store the credentials, you can create a file named `.env` with the following structure, or you can input the credentials directly in the app, below the Login Page.

```env
SPOTIFY_CLIENT_ID= ...
SPOTIFY_CLIENT_SECRET= ...
YOUTUBE_API_KEY= ...
```

### Spotify

As the entire app is based on Spotify's repertoire, it is required to have access to their API, or in other words, a `Client ID` and a `Client Secret`. To get these tokens, you can follow this tutorial:

1. Access the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).

2. Login with any Spotify Account.

3. Click on `Create App` (name of your choice).

4. Edit the Settings - add `com.darguima.spothack://oauthredirect` to `Redirect URIs`

5. Go to `Users and Access` > `Add new user` and fill in with your users accounts.

6. Now you are able to copy the `Client ID` and the `Client Secret`

https://user-images.githubusercontent.com/49988070/164891563-79bcd7d5-7d0e-417c-b77f-27917792968b.mp4

### YouTube

Unlike Spotify, the YouTube API is not essential for the app flow, so you can omit this key without any issues. However, if for some reason the [`YouTube Scrape` Server](https://github.com/HermanFassett/youtube-scrape) is not working, this can serve as a backup plan for Music Download.

Unlike Spotify, YouTube API is not essential for the App flow, so you can omit this key without problems, but if for some reason the [`YouTube Scrape` Server](https://github.com/HermanFassett/youtube-scrape) is not working, this can be a plan B for Music Download. Getting the `API Key` is a bit more complicated than for Spotify; follow these steps:

1. Access the [Google Cloud Platform Console](https://console.cloud.google.com/getting-started-).

2. Login with any Google Account.

3. Click on `Select a Project` > `New Project`.

4. Create a project with a name of your choice and Select it.

5. Select in `Navigation Menu` > `APIs and services` > `Library`

6. Search and Enable `YouTube Data API v3`

7. Go to `OAuth consent Screen` and select `External` > `Create`, then fill in the required inputs and continue to the end.

8. Go to `Credentials` and click `Create Credentials` > `API key`. Now you can copy the key!

https://user-images.githubusercontent.com/49988070/164891593-d4cd9acc-14b3-428c-a65d-604975ad4a83.mp4

## Pages/Features 📚

### Login Page

<img src="./readme/ScreenShots/LoginPage.png" style='width: 80%'/>

* Enter your APIs tokens (if not configured on APK building).
* Login !!

___

### Home Page

<img src="./readme/ScreenShots/HomePage.png" style='width: 30%'/>

* Shortcuts to "Outdated Playlists", "Downloads Manager", "Settings Page" and others ...

___

### Search Pages

<img src="./readme/ScreenShots/SearchPage.png" style='width: 80%'/>

* Search for your favorite musics and playlists.
* Download them !!

___

### Download Page

<img src="./readme/ScreenShots/DownloadPage.png" style='width: 30%'/>

* Follow the download status of your musics.
* Know about the errors.

___

### Settings Page

<img src="./readme/ScreenShots/SettingsPage.png" style='width: 80%'/>

* Change the "Root Path", "Download Default Source", "Music Time Limit", and the Render Mode.

___

### Outdate Playlist Page

<img src="./readme/ScreenShots/OutdatedPlaylistsPage.png" style='width: 30%'/>

* Follow your playlist Status.
* Download the news musics.
* Delete the old ones.

___

### Add Playlist Page

<img src="./readme/ScreenShots/AddPlaylistPage.png" style='width: 45%'/>

* Reference a Playlist to a folder, if we can't do it.

___


## Technologies Used 💻

- core ⚛
	- JavaScript/TypeScript
	- React Native

- storage 💾
	- [Async Storage](https://github.com/react-native-async-storage/async-storage) - to save data as settings and histories
	- [react-native-encrypted-storage](https://github.com/emeraldsanto/react-native-encrypted-storage) - to save users' APIs tokens
	- [react-native-dotenv](https://github.com/goatandsheep/react-native-dotenv) - to save my APIs tokens

- download 📥
	- [react-native-ffmpeg](https://github.com/tanersener/react-native-ffmpeg) - used to convert mp4 videos downloaded to mp3
	- [react-native-fs](https://github.com/itinance/react-native-fs) - used to save the mp3 files on the chosen path
	<!-- - [react-native-foreground-service](https://github.com/voximplant/react-native-foreground-service) - used to keep the download process active even if in background or closed -->

- others
	- [react-native-inappbrowser-reborn](https://github.com/proyecto26/react-native-inappbrowser) - used to access the Spotify Login Page

---

## 🚨 Disclaimer 🚨

This project can be considered a piracy service to download music. No source code here was used in production, nor was it ever used with the idea of making money. I only disposed of the code as open source because this is a study project. If you want to use it as a service, use it at your own risk, but remember that artists and publishers are likely to own the downloaded music.


## License 👨🏾‍⚖️
This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
