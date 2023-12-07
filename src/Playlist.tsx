import { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import Navigation from './Navigation'


interface LoaderArguments {
  params: {
    [attribute: string]: string
  }
}

export async function loader(args: LoaderArguments) {
  const playlist = await window.ipcRenderer.invoke('spotify-get-playlist', args.params.id)

  return { playlist }
}

function Playlist() {
  const { playlist } = useLoaderData()
  const [playlistItem, setPlaylist] = useState(playlist)

  const formatDuration = (duration) => {
    const duration_s = duration / 1000 // in seconds
    const minutes = Math.floor(duration_s / 60) // in minutes
    const seconds = (duration_s % 60).toFixed(0)


    return `${minutes}:${(Number(seconds) < 10 ? '0' : '') + seconds}`
  }

  const getPlaylistTracks = async (url: string) => {
    if (url === null) return;
    
    const result = await window.ipcRenderer.invoke('spotify-get-url', url)
    const _playlist = playlist

    _playlist.tracks = result
    setPlaylist({..._playlist})
  }

  const onPreviousHandler = () => {
    getPlaylistTracks(playlistItem.tracks.previous)
  }

  const onNextHandler = () => {
    getPlaylistTracks(playlistItem.tracks.next)
  }
  
  return (
    <>
      <Navigation />
      <div className="container">
        <div className="block">
          <p className="title is-2 playlist-name">{playlistItem.name}</p>
        </div>
        <nav className="pagination is-centered" role="navigation" aria-label="pagination">
          <a className={`pagination-previous ${playlistItem.tracks.previous === null ? 'is-disabled' : ''}`} onClick={onPreviousHandler}>Previous</a>
          <a className={`pagination-next ${playlistItem.tracks.next === null ? 'is-disabled' : ''}`} onClick={onNextHandler}>Next page</a>
        </nav>
        <table className="table is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Artist</th>
              <th>Album</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {playlistItem.tracks.items.map(item => {
              return (
                <tr key={item.track.id}>
                  <td>
                    <figure className="image is-64x64">
                      <img src={item.track.album.images[0].url} />
                    </figure>
                  </td>
                  <td>{item.track.name}</td>
                  <td>{item.track.artists.map(artist => artist.name).join(',')}</td>
                  <td>{item.track.album.name}</td>
                  <td>{formatDuration(item.track.duration_ms)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Playlist