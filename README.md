# Guía de Despliegue - StreamFlix IPTV

Esta es una aplicación de IPTV estilo Netflix optimizada para Smart TV y dispositivos móviles.

## Requisitos Previos
1. Tener instalado [Node.js](https://nodejs.org/) en tu computadora.
2. Una cuenta en [GitHub](https://github.com/) (gratis).
3. Una cuenta en [Vercel](https://vercel.com/) (gratis).

## Pasos para tener tu propia URL permanente:

### 1. Preparación Local
Crea una carpeta en tu computadora y copia todos los archivos de este proyecto. La estructura debe ser:
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `index.html`
- `public/` (contiene manifest.json y sw.js)
- `src/` (contiene App.tsx, main.tsx, index.css, types.ts, etc.)

### 2. Instalación
Abre una terminal en esa carpeta y ejecuta:
```bash
npm install
```

### 3. Subir a GitHub
1. Crea un nuevo repositorio en GitHub.
2. Sigue las instrucciones para subir tu código (git init, git add, git commit, git push).

### 4. Desplegar en Vercel
1. Entra en Vercel y dale a **"Import Project"**.
2. Selecciona el repositorio de GitHub que acabas de crear.
3. Dale a **"Deploy"**.
4. ¡Vercel te dará una URL permanente como `tu-app.vercel.app`!

## Notas Importantes
- **CORS:** Si las listas M3U por URL no cargan, usa la opción de **"Pegar Manualmente"**. Los navegadores bloquean peticiones externas por seguridad, pero el pegado manual funciona siempre.
- **PWA:** Una vez en tu URL de Vercel, podrás instalar la app en Android TV desde el menú del navegador.
