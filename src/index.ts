import express from "express"
import ytdl from "ytdl-core"
import { youtube } from 'scrape-youtube';

const app = express()
const port = 3000

app.get('/', (_, res) => {
  res.send('SpotHack Server is here!')
})

app.get('/getDownloadUrls', async (req, res) => {
  const youtubeId = req.query?.videoId as string | undefined

  if (!youtubeId) {
    return res.status(400).send('`videoId` not provided - please provide a youtube video id')
  }

  try {
    const videoFormats = await ytdl.getInfo(youtubeId);
    const { approxDurationMs, url } = ytdl.chooseFormat(videoFormats.formats, {
      quality: 'highestaudio',
    });

    res.json({ approxDurationMs, url })
  } catch (error) {
    return res.status(400).send('`videoId` not valid - video not found')
  }
})

app.get('/getYoutubeIds', async (req, res) => {
  const query = req.query?.query as string | undefined

  if (!query) {
    return res.status(400).send('`query` not provided - please provide a search query')
  }

  try {
    const { videos } = await youtube.search(query)    // or

    res.json(videos)
  } catch (error) {
    return res.status(400).send('`query` not valid')
  }
})

app.listen(port, () => {
  console.log(`SpotHack Server app listening on port ${port}`)
})
