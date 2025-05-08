<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/darguima/spothack">
    <img src="./readme/Logo/SpotHackLogoHorizontal_500.png" alt="SpotHack thumbnail" width="350px">
  </a>

  <h3 align="center">SpotHack</h3>

  <p align="center">
    Convert your Spotify Playlists to offline versions that are always up to date, without paying the Premium.
    <br />
    <br />
    <a href="#️-download--installation">Download Project</a>
    &middot;
    <a href="#-getting-started-with-development">Start Developing</a>
  </p>

<h4 align="center">
⭐ Don't forget to Starring ⭐
</h4>

  <div align="center">

[![TypeScript][TypeScript-badge]][TypeScript-url]
[![ReactNative][ReactNative-badge]][ReactNative-url]

  </div>

  <p align="center">
    <img alt="SpotHack Media" src="./readme/ScreenShots/AllPages.png" width="100%" height="auto" />
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>📋 Table of Contents</summary>

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Download & Installation](#️-download--installation)
- [Getting Started with Development](#-getting-started-with-development)
- [API Credentials](#api-credentials)
- [Contributing](#-contributing)
- [License](#️-license)
- [Disclaimer](#️-disclaimer)
</details>



## 🔍 About The Project

### ⚙️ How it works?

After you select your music or playlist, our `Download Machine` will, with the [YouTube Scraper](https://github.com/HermanFassett/youtube-scrape) or the [YouTube API](https://developers.google.com/youtube/v3), search for the music video, with the query starting with the artists name followed by the track name. Once we get the YouTube ID we can download the music video and convert it to  `.mp3` with `ffmpeg`.

### 📱 Pages

<details>
  <summary>Click to expand pages</summary>

### Login Page

<img src="./readme/ScreenShots/LoginPage.png" style='width: 80%'/>

* Enter your APIs tokens (if not configured on APK building).
* Login !!

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

</details>



## ⬇️ Download & Installation

You can download this App in the Releases or build the code with some changes that  you may want.

* [Download APK](https://github.com/Darguima/SpotHack/releases/download/v1.0.1/SpotHack.apk) - (don't forget the [API Credentials](#api-credentials))
* [Download and Build the Code](#-getting-started-with-development)
* [Download APK 🔑](https://github.com/Darguima/SpotHack/releases/download/v1.0.1/SpotHackLocked.zip) for my friends - (__need password to install__ 🔒) 



## 🚀 Getting Started with Development

To get a local copy up and running follow these simple example steps.

### 1. Prerequisites

Start by installing the following tools:

* [Git](https://git-scm.com/downloads) - Version Control System

* [Yarn](https://yarnpkg.com/getting-started/install) - Package Manager

* For run the project you will need the `React Native` Environment configured. You can follow the [ReactNative Official Documentation](https://reactnative.dev/docs/environment-setup#development-os);

###### Note: This project was only tested and developed for Android, so I don't know if it works properly in IOS. Is recommended that you run it in an `Android Phone`;

### 2. Cloning

Now clone the repository to your local machine. You can do this using Git:

```bash
$ git clone https://github.com/Darguima/SpotHack.git
# or
$ git clone git@github.com:Darguima/SpotHack.git
```

### 3. Dependencies

Install the dependencies using Yarn:

```bash
$ yarn
```

### 4. Set credentials for third-party APIs 🪪

This App use 2 third-party APIs:
* Spotify Api (Web Api)
* Youtube Api (YouTube Data API v3)

You can save this credentials in a `.env` file or input them directly on the App. To get the required credentials you can follow our [tutorial](#api-credentials).

### 4. Setup 🛠️

- To setup the application you can use:

```bash
yarn start
yarn android
```

At this moment you should have a Android Emulator with `SpotHack` running

### 5. Building the APK

#### Generate a KeyStore 🔑

Fill in the required inputs (and remember the password):

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

## API Credentials🪪

For store the credentials you can create a file `.env` with the next structure or you can input the credentials directly in the App, on Login Screen.

```env
SPOTIFY_CLIENT_ID= ...
SPOTIFY_CLIENT_SECRET= ...
YOUTUBE_API_KEY= ...
```

### Spotify

As the entire App is based on Spotify's repertoire, it is required have access to their API, or in others words: a `Client Id` and a `Client Secret`. To get this tokens you can follow the next tutorial:

1. Access the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).

2. Login with any Spotify Account.

3. Click on `Create App` (name of your choice).

4. Edit the Settings - add `com.darguima.spothack://oauthredirect` to `Redirect URIs`

5. Go to `Users and Access` > `Add new user` and fill in with your users accounts.

6. Now you are able to copy the `Client ID` and the `Client Secret`

https://user-images.githubusercontent.com/49988070/164891563-79bcd7d5-7d0e-417c-b77f-27917792968b.mp4

### YouTube

Unlike Spotify, YouTube API is not essential for the App flow, so you can omit this key without problems, but if for some reason the [`YouTube Scrape` Server](https://github.com/HermanFassett/youtube-scrape) is not working, this can be a plan B for Music Download. To get the `API Key` is a little more complicated than Spotify; Follow the next steps:

1. Access the [Google Cloud Platform Console](https://console.cloud.google.com/getting-started-).

2. Login with any Google Account.

3. Click on `Select a Project` > `New Project`.

4. Create a project with a name of your choice and Select it.

5. Select in `Navigation Menu` > `APIs and services` > `Library`

6. Search and Enable `YouTube Data API v3`

7. Go to `OAuth consent Screen` and select `External` > `Create`, then fill in the required inputs and continue to the end.

8. Go to `Credentials` and click `Create Credentials` > `API key`. Now you can copy the key!

https://user-images.githubusercontent.com/49988070/164891593-d4cd9acc-14b3-428c-a65d-604975ad4a83.mp4



## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## ⚖️ License

Distributed under the MIT LICENSE. See `LICENSE` file for more information.



## ⚠️ Disclaimer

This project can be considered a piracy service to download music. No source code here was used in production, nor was it ever used with the idea of making money. I only disposed of the code as open source because this is a study project. If you want to use it as a service, use it at your own risk, but remember that artists and publishers are likely to own the downloaded music.



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[project-thumbnail]: ./readme/Logo/SpotHackLogoHorizontal_500.png

[university-badge]: https://img.shields.io/badge/University-Universidade%20do%20Minho-red?style=for-the-badge
[subject-badge]: https://img.shields.io/badge/Subject-[UNI_SUBJECT_NAME]-blue?style=for-the-badge
[grade-badge]: https://img.shields.io/badge/Grade-[UNI_GRADE]%2F20-brightgreen?style=for-the-badge

[JavaScript-badge]: https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[JavaScript-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript

[TypeScript-badge]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org

[React.js-badge]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/

[Next.js-badge]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/

[ReactNative-badge]: https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[ReactNative-url]: https://reactnative.dev
