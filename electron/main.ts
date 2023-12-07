import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'

import { getCodeFromURL } from './services/auth'
import Spotify from './services/spotify'

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    width: 1200,
    height: 800
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }

  // Catch callback
  win.webContents.session.webRequest.onBeforeRequest({ urls: [ 'http://localhost:5173/callback*' ] }, async (e) => {
    console.log(e.url)
    
    if (win?.webContents) getCodeFromURL(e.url, win.webContents)

    return;
  })

  // IPC Main handler
  ipcMain.handle('spotify-get-playlists', async (e) => {
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
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
