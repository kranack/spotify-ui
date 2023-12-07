import { ipcMain } from 'electron'
import Spotify from './services/spotify'

export function registerHandlers() {
  ipcMain.handle('spotify-get-playlists', async () => {
    const spotify = Spotify.getInstance()
    const playlists = await spotify.getPlaylists()

    return playlists
  })

  ipcMain.handle('spotify-get-playlist', async (e, id) => {
    const spotify = Spotify.getInstance()
    const playlist = await spotify.getPlaylist(id)
    
    console.log(playlist)

    return playlist
  })

  ipcMain.handle('spotify-get-url', async (e, url) => {
    const spotify = Spotify.getInstance()
    const result = await spotify.request(url)

    console.log(result)

    return result
  })

  ipcMain.handle('spotify-create-playlist', async (e, name, fill) => {
    const spotify = Spotify.getInstance()
    const playlist = await spotify.createPlaylist(name)
    
    if (fill) {
      const tracks = await spotify.getLiked({ year: name })
      const uris = tracks.map(track => track.track.uri)

      await spotify.addTracksToPlaylist(playlist.id, uris)
    }
    return playlist.id
  })

  ipcMain.handle('spotify-get-track-infos', async (e, id) => {
    const spotify = Spotify.getInstance()
    const track = await spotify.getTrack(id)
    const infos = await spotify.getTrackInfos(id)
    console.log(id, infos)

    return { track, infos }
  })
}