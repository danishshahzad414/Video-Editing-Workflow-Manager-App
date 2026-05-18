declare global {
  interface Window {
    gapi: any
    google: any
  }
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || ''
const ROOT_FOLDER_ID = import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID || ''
const SCOPES = 'https://www.googleapis.com/auth/drive.file'

let tokenClient: any = null
let accessToken: string | null = null

export async function initGoogleDrive(): Promise<void> {
  return new Promise((resolve) => {
    if (window.gapi) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://apis.google.com/js/api.js'
    script.onload = () => {
      window.gapi.load('client', async () => {
        await window.gapi.client.init({ apiKey: API_KEY, discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'] })
        resolve()
      })
    }
    document.head.appendChild(script)
  })
}

export async function getAccessToken(): Promise<string> {
  if (accessToken) return accessToken
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.onload = () => {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (resp: any) => {
          if (resp.error) { reject(resp.error); return }
          accessToken = resp.access_token
          resolve(resp.access_token)
        },
      })
      tokenClient.requestAccessToken()
    }
    document.head.appendChild(script)
  })
}

async function findOrCreateFolder(name: string, parentId: string): Promise<string> {
  const token = await getAccessToken()
  const searchResp = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=name='${name}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false&fields=files(id)`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const searchData = await searchResp.json()
  if (searchData.files?.length > 0) return searchData.files[0].id

  const createResp = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, mimeType: 'application/vnd.google-apps.folder', parents: [parentId] }),
  })
  const createData = await createResp.json()
  return createData.id
}

async function setPublicPermission(fileId: string, token: string): Promise<void> {
  await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'reader', type: 'anyone' }),
  })
}

export interface DriveUploadResult {
  fileId: string
  webViewLink: string
  directDownloadUrl: string
}

export async function uploadToDrive(
  file: File,
  counselorName: string,
  subfolder?: string,
  onProgress?: (pct: number) => void
): Promise<DriveUploadResult> {
  const token = await getAccessToken()

  const counselorFolderId = await findOrCreateFolder(counselorName, ROOT_FOLDER_ID)
  const targetFolderId = subfolder
    ? await findOrCreateFolder(subfolder, counselorFolderId)
    : counselorFolderId

  const metadata = { name: file.name, parents: [targetFolderId] }
  const form = new FormData()
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
  form.append('file', file)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink')
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText)
        await setPublicPermission(data.id, token)
        resolve({
          fileId: data.id,
          webViewLink: data.webViewLink,
          directDownloadUrl: `https://drive.google.com/uc?export=download&id=${data.id}`,
        })
      } else {
        reject(new Error(`Upload failed: ${xhr.responseText}`))
      }
    }
    xhr.onerror = () => reject(new Error('Network error during upload'))
    xhr.send(form)
  })
}
