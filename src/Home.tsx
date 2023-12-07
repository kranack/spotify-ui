import config from '../config/spotify.auth.json'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserStore from './store/UserStore'

interface QueryObject {
  [attribute: string]: string
}

const querystring = {
  stringify: (o: QueryObject) => {
    const res = []

    for (const attr in o) {
      res.push(`${attr}=${o[attr] as string}`)
    }

    return res.join('&')
  }
}

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function(length: number) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  
  return text;
};

function Home() {
  const store = UserStore()
  const navigate = useNavigate()

  const connectionHandler = () => {
    window.location.replace('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: config.id,
        scope: 'user-read-private user-read-email user-library-read playlist-modify-public',
        redirect_uri: 'http://localhost:5173/callback',
        state: generateRandomString(16)
      })
    )
  }

  useEffect(() => {
    window.ipcRenderer.on('connect-user', (e, data) => {
      console.log(e, data.user)
      store.set('user', data.user)

      navigate('/user')
    })
  })

  return (
    <div className="home columns is-centered">
      <div className="column is-narrow">
        <button className="button is-primary is-large" onClick={connectionHandler}>Connect to Spotify</button>
      </div>
    </div>
  )
}

export default Home