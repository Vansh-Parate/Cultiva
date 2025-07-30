/// <reference types="vite/client" />

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_OPENWEATHER_API_KEY: string
    readonly VITE_GEMINI_API_KEY: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

export {} 