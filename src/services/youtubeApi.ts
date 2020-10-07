import axios from 'axios'

const youtubeApi = axios.create({ baseURL: 'https://www.googleapis.com/youtube/v3/' })

export default youtubeApi

// https://developers.google.com/youtube/v3/docs
// https://developers.google.com/youtube/v3/docs/search/list#usage
