import { SpotifyUser } from "../interfaces/Spotify"

interface DataSet {
  [attribute: string]: string|number|object|SpotifyUser
}

class UserStore {
  private static instance: UserStore
  private dataset: DataSet

  constructor() {
    this.dataset = {}
  }

  public set(key: string, value: string|number|object|SpotifyUser) {
    this.dataset[key] = value
  }

  public get(key: string) {
    return this.dataset[key]
  }

  public static getInstance() {
    if (!UserStore.instance) UserStore.instance = new UserStore()
    
    return UserStore.instance
  }
}

export default UserStore.getInstance