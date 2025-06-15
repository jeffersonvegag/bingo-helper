# Bingo App 🎯

Una aplicación de Bingo interactiva desarrollada con React Native y Expo Router.

## Características

- 🎲 Generación automática de números de Bingo
- 📱 Interfaz intuitiva y responsive
- 🎯 Seguimiento de números marcados
- 📊 Gestión de tickets de Bingo
- 🌐 Funciona en Android, iOS y Web

## Tecnologías utilizadas

- **React Native** - Framework para desarrollo móvil
- **Expo SDK 53** - Plataforma de desarrollo
- **Expo Router** - Navegación basada en archivos
- **TypeScript** - Tipado estático
- **React Native Reanimated** - Animaciones fluidas

## Instalación y configuración

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- Expo Go app en tu dispositivo móvil

### Pasos de instalación

1. **Clona el repositorio**
   ```bash
   git clone [tu-repo-url]
   cd bingo_app

# Solución de problemas comunes
## Error de dependencias
rm -rf node_modules package-lock.json
- npm install --legacy-peer-deps

- npx expo start --clear


# para exportar apk
## exportar ultima instancia
- npx expo login
- npx eas build:configure
- npx eas build -p android --profile preview
