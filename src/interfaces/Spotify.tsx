
interface SpotifyImage {
  url: string
  height: number
  width: number
}

interface SpotifyExternalUrls {
  spotify: string
}

export interface SpotifyUser {
  display_name: string
  external_urls: SpotifyExternalUrls
  href: string
  id: string
  images: Array<SpotifyImage>
  type: string
  uri: string
  followers: {
    href: string|null
    total: number
  }
  country: string
  product: string
  explicit_content: {
    filter_enabled: boolean
    filter_locked: boolean
  }
  email: string
}

export interface SpotifyPlaylist {
  collaborative: boolean
  description: string
  external_urls: SpotifyExternalUrls
  href: string
  id: string
  images: Array<SpotifyImage>
  name: string
  owner: {
    external_urls: SpotifyExternalUrls
    followers: {
      href: string|null
      total: number
    }
    href: string
    id: string
    type: string
    uri: string
    display_name: string
  }
  public: boolean
  snapshot_id: string
  tracks: {
    href: string|null
    total: number
  }
  type: string
  uri: string
}