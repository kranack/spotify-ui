import { Link, useNavigate } from 'react-router-dom'
import Navigation from "./Navigation";

export default function PlaylistForm() {
  let nameInput : HTMLInputElement|null = null
  let autoFillInput : HTMLInputElement|null = null
  const navigate = useNavigate()

  const onCreateHandler = async () => {
    const name = nameInput?.value
    const autoFill = autoFillInput?.checked

    if (!name) return;
    
    console.log(name, autoFill)
    const playlistId = await window.ipcRenderer.invoke('spotify-create-playlist', name, autoFill)

    if (playlistId) navigate(`/playlist/${playlistId}`)
  }

  return (
    <>
      <Navigation />
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-half">
            <div className="field">
              <label className="label">Name</label>
              <div className="control">
                <input className="input" type="text" placeholder="Playlist name" ref={node => (nameInput = node)} />
              </div>
            </div>
            <div className="field">
              <div className="control">
                <label className="checkbox">
                  <input type="checkbox" ref={node => (autoFillInput = node)} />
                  Auto-fill
                </label>
              </div>
            </div>
            <div className="field is-grouped">
              <div className="control">
                <button className="button is-link" onClick={onCreateHandler}>Create</button>
              </div>
              <div className="control">
                <Link className="button is-link is-light" to="/user">Cancel</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}