import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import Navigation from './Navigation'


interface LoaderArguments {
  params: {
    [attribute: string]: string
  }
}

export async function loader(args: LoaderArguments) {
  const { track, infos } = await window.ipcRenderer.invoke('spotify-get-track-infos', args.params.id)

  return { track, infos }
}

function Track() {
  const { track, infos } = useLoaderData()
  //const [trackItem, setTrack] = useState(infos)
  const navigate = useNavigate()

  const formatDuration = (duration) => {
    const duration_s = duration / 1000 // in seconds
    const minutes = Math.floor(duration_s / 60) // in minutes
    const seconds = (duration_s % 60).toFixed(0)


    return `${minutes}:${(Number(seconds) < 10 ? '0' : '') + seconds}`
  }
  
  return (
    <>
      <Navigation />
      <div className="container">
        <div className="block">
          <p className="title is-2 playlist-name">Infos for {track.name}</p>
          <span className="icon"><a onClick={() => navigate(0)}><i className="fas fa-rotate"></i></a></span>
        </div>
        <table className="table is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Artist</th>
              <th>Album</th>
              <th>Duration</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {infos.tracks.map(item => {
              return (
                <tr key={item.id}>
                  <td>
                    <figure className="image is-64x64">
                      <img src={item.album.images[0].url} />
                    </figure>
                  </td>
                  <td><a href={item.uri}>{item.name}</a></td>
                  <td>{item.artists.map(artist => artist.name).join(', ')}</td>
                  <td><a href={item.album.uri}>{item.album.name}</a></td>
                  <td>{formatDuration(item.duration_ms)}</td>
                  <td>
                    <span className="icon has-text-info">
                      <Link to={`/track/${item.id}`}><i className="fas fa-info-circle"></i></Link>
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Track