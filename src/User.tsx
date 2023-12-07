import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SpotifyPlaylist, SpotifyUser } from './interfaces/Spotify'
import UserStore from './store/UserStore'

function List(props: { items: Array<SpotifyPlaylist>, limit: number, pagination: boolean }) {

  const [currentPage, setCurrentPage] = useState(1)

  const pages = Math.ceil(props.items.length / props.limit)

  const onPreviousHandler = () => {
    setCurrentPage(currentPage-1)
  }

  const onNextHandler = () => {
    setCurrentPage(currentPage+1)
  }

  const onPageHandler = (page: number) => {
    setCurrentPage(page)
  }

  const renderPagination = () => {
    if (!props.pagination) return ''

    return <div>
      <nav className="pagination is-centered" role="navigation" aria-label="pagination">
        <a className={`pagination-previous ${currentPage === 1 ? 'is-disabled' : ''}`} onClick={onPreviousHandler}>Previous</a>
        <a className={`pagination-next ${currentPage === pages ? 'is-disabled' : ''}`} onClick={onNextHandler}>Next page</a>
        <ul className="pagination-list">
          { [... Array(pages)].map((v, index) => {
            const page = index+1
            return (
              <li key={page}><a className={`pagination-link ${page===currentPage ? 'is-current' : ''}`} aria-label={`Goto page ${page}`} onClick={() => onPageHandler(page)}>{page}</a></li>
            )
          }) }
        </ul>
      </nav>
    </div>
  }

  return (
    <>
      <div className="tile is-parent">
        {props.items.slice((currentPage-1)*props.limit, (currentPage*props.limit)).map(playlist => {
          return (
            <div className="playlist-item tile is-child" key={playlist.id}>
              <article className="media">
                <div className="media-left">
                  <figure className="image is-128x128">
                    <img src={playlist.images[0].url} />
                  </figure>
                </div>
                <div className="media-content">
                  <p className="title is-spaced"><Link to={`/playlist/${playlist.id}`}>{playlist.name}</Link></p>
                  <p className="subtitle">{playlist.tracks.total} tracks</p>
                </div>
              </article>
            </div>
          )
        })}
      </div>
      {renderPagination()}
    </>
  )
}

function PlayLists(props: { playlists: Array<SpotifyPlaylist> }) {
  return (
    <div className="playlists tile is-ancestor is-vertical">
      <div className="tile is-parent">
        <p className="title">Playlists</p>
      </div>
      <List items={props.playlists} limit={4} pagination={true} />
    </div>
  )
}

function UserCard(props: { user: SpotifyUser }) {
  return (
    <div className="card">
      <div className="card-content">
        <div className="media">
          <div className="media-left">
            <figure className="image is-48x48">
              <img src={props.user.images[0].url} alt={props.user.id} />
            </figure>
          </div>
          <div className="media-content">
            <p className="title is-4">{props.user.display_name}</p>
            <p className="subtitle is-6">@{props.user.id} <img src={`https://flagsapi.com/${props.user.country}/flat/64.png`} className="icon is-small" /></p>
          </div>
        </div>

        <div className="content">
          <p><b>{props.user.followers.total}</b> followers</p>
        </div>
      </div>
    </div>
  )
}

function User() {
  const store = UserStore()

  const navigate = useNavigate()
  const [playlists, setPlaylists] = useState([])
  const user = store.get('user')

  useEffect(() => {
    if (!user) navigate('/')

    window.ipcRenderer.invoke('spotify-get-playlists')
      .then(setPlaylists)
      .catch(console.error)
  }, [user, navigate])

  return (
    <>
      <div className="columns is-centered">
        <div className="column is-narrow user">
          <UserCard user={user} />
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <PlayLists playlists={playlists} />
        </div>
      </div>
      <div className="columns is-centered">
        <div className="column is-narrow">
          <Link className="button is-link" to="/playlist/create">Create a new playlist</Link>
        </div>
      </div>
    </>
  )
}

export default User