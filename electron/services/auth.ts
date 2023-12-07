import axios from 'axios'
import url from 'url'
//import request from 'request'

import config from '../../config/spotify.auth.json'
import { WebContents } from 'electron/main'
import Spotify from './spotify'

const getCodeFromURL = (callbackURL: string, webContents: WebContents) => {
  const parts = url.parse(callbackURL, true)
  const query = parts.query

  console.log(query, query.code)

  const data = new FormData()
  data.append('code', query.code as string)
  data.append('redirect_uri', 'http://localhost:5173/callback')
  data.append('grant_type', 'authorization_code')

  if (query.code) {
    axios.post('https://accounts.spotify.com/api/token', {
      code: query.code,
      redirect_uri: 'http://localhost:5173/callback',
      grant_type: 'authorization_code'
    }, { 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (Buffer.from(config.id + ':' + config.secret).toString('base64'))
      }
    }).then(response => {
        console.log(response.data)

        const spotify = Spotify.getInstance()
        spotify.keys = { access_token: response.data.access_token }

        Promise.all([ spotify.getUser(), spotify.getTotalLiked()]).then(responses => {
          webContents.send('connect-user', { user: responses[0], total: responses[1] })
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

}

export {
  getCodeFromURL
}