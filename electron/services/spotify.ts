import axios, { AxiosInstance } from 'axios'

interface SpotifyTokens {
  access_token: string
}

class Spotify {
  static instance: Spotify

  private tokens: SpotifyTokens|null
  private user: object|null
  private http: AxiosInstance

  constructor() {
    this.tokens = null
    this.user = null
    this.http = axios.create({
      baseURL: 'https://api.spotify.com/v1',
      headers: this.getHeaders(),
    })
  }

  set keys(tokens: SpotifyTokens) {
    this.tokens = tokens

    // Create new instance with updated tokens
    this.http = axios.create({
      baseURL: 'https://api.spotify.com/v1',
      headers: this.getHeaders(),
    })
  }

  public getUser() {
    this.checkTokens()

    if (this.user) return new Promise((resolve) => resolve(this.user));

    // use the access token to access the Spotify Web API
    return this.http.get('/me')
                    .then(response => {
                      this.user = response.data
                      return response.data
                    })
                    .catch(console.error)
  }

  public getPlaylists() {
    this.checkTokens()

    return this.http.get('/me/playlists?limit=10')
                    .then(response => response.data.items)
  }

  public getPlaylist(id: string) {
    this.checkTokens()

    return this.http.get(`/playlists/${id}`)
                    .then(response => response.data)
                    .catch(console.error)
  }

  public async getLiked(filter: { year: string }) {
    let tracks = []

    let lastYearTrack;
    let url = '/me/tracks?limit=50'
    do {
      const result = await this.http.get(url).then(response => response.data)
      lastYearTrack = result.items.at(-1).added_at.split('-')[0]

      console.log(filter.year, lastYearTrack)

      tracks = tracks.concat(result.items)
      url = result.next
    } while (Number(lastYearTrack) >= Number(filter.year));

    tracks = tracks.filter(track => track.added_at.split('-')[0] === filter.year)
    tracks.reverse() // sort tracks
    
    return tracks
  }

  public createPlaylist(name: string) {
    this.checkTokens()

    return this.http.post(`/users/${this.user?.id}/playlists`, { name })
                    .then(response => response.data)
                    .catch(e => { console.log(e.response) })
  }

  public addTracksToPlaylist(playlistId: string, tracks: Array<string>) {
    this.checkTokens()

    const stack = []
    let items = tracks

    while (items.length) {
      stack.push(this.http.post(`/playlists/${playlistId}/tracks`, { uris: items.splice(0, 100) }))
    }

    return Promise.all(stack).then(results => results.map(result => result.data))
  }

  public request(url: string) {
    this.checkTokens()

    return this.http.get(url)
                    .then(response => response.data)
  }

  private getHeaders() {
    return { 'Authorization': 'Bearer ' + this.tokens?.access_token }
  }

  private checkTokens() {
    if (this.tokens === null) throw new Error('No tokens set up')
  }

  public static getInstance() : Spotify {
    if (!Spotify.instance) Spotify.instance = new Spotify()

    return Spotify.instance
  }
}

export default Spotify