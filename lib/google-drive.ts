// Configuración para Google Drive API
export const GOOGLE_DRIVE_CONFIG = {
  apiKey: "process.env.NEXT_PUBLIC_GOOGLE_API_KEY",
  clientId: "process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID",
  discoveryDoc: "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
  scopes: "https://www.googleapis.com/auth/drive.file",
}

// Tipos para los datos que vamos a guardar
export interface StageData {
  stage: number
  bookTitle: string
  bookAuthor: string
  timestamp: string
  name?: string
  comment: string
  rating: number
  sessionId: string
}

// Función para inicializar Google API
export const initializeGoogleAPI = async (): Promise<boolean> => {
  try {
    if (typeof window === "undefined") return false

    // Cargar Google API
    await new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://apis.google.com/js/api.js"
      script.onload = resolve
      document.head.appendChild(script)
    })

    // Cargar Google Identity Services
    await new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://accounts.google.com/gsi/client"
      script.onload = resolve
      document.head.appendChild(script)
    })

    // Inicializar API
    await (window as any).gapi.load("client", async () => {
      await (window as any).gapi.client.init({
        apiKey: GOOGLE_DRIVE_CONFIG.apiKey,
        discoveryDocs: [GOOGLE_DRIVE_CONFIG.discoveryDoc],
      })
    })

    return true
  } catch (error) {
    console.error("Error inicializando Google API:", error)
    return false
  }
}

// Función para autenticar con Google
export const authenticateGoogle = async (): Promise<boolean> => {
  try {
    const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_DRIVE_CONFIG.clientId,
      scope: GOOGLE_DRIVE_CONFIG.scopes,
      callback: (response: any) => {
        if (response.error) {
          console.error("Error de autenticación:", response.error)
          return false
        }
      },
    })

    return new Promise((resolve) => {
      tokenClient.callback = (response: any) => {
        if (response.error) {
          resolve(false)
        } else {
          resolve(true)
        }
      }
      tokenClient.requestAccessToken()
    })
  } catch (error) {
    console.error("Error en autenticación:", error)
    return false
  }
}

// Función para guardar datos en Google Drive
export const saveToGoogleDrive = async (data: StageData): Promise<boolean> => {
  try {
    const fileName = `book-review-${data.sessionId}-stage-${data.stage}.json`
    const fileContent = JSON.stringify(data, null, 2)

    // Crear metadata del archivo
    const metadata = {
      name: fileName,
      parents: ["appDataFolder"], // Carpeta especial de la app
    }

    // Crear el archivo en Drive
    const form = new FormData()
    form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }))
    form.append("file", new Blob([fileContent], { type: "application/json" }))

    const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${(window as any).gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`,
      },
      body: form,
    })

    if (response.ok) {
      console.log(`Datos de la etapa ${data.stage} guardados en Google Drive`)
      return true
    } else {
      console.error("Error guardando en Drive:", await response.text())
      return false
    }
  } catch (error) {
    console.error("Error guardando datos:", error)
    return false
  }
}
