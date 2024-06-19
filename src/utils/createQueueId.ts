const createQueueId = (spotifyId: string, playlistId: string) =>
  spotifyId + '-' + playlistId;

export default createQueueId;
