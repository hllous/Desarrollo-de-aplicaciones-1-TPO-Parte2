## Desarrollo de Aplicaciones 1

### TPO Parte 2
**Integrantes:**
- Nicolas Facundo Llousas. LU: 1147795
- Sebastian Andres Deya. LU: 1167157
- Valentina Frisoli. LU: 1167852
- Ignacio Sanchez Zinny. LU: 1167840
- Ignacio Bergallo. LU: 1173481
- Francisco Garriga. LU:1168942

---

### Cómo ejecutar el proyecto

> El proyecto usa un **módulo nativo Android** (Kotlin), por lo que requiere compilación nativa. No se puede correr con Expo Go.

**Requisitos previos:**
- [Node.js](https://nodejs.org/) instalado
- [Android Studio](https://developer.android.com/studio) instalado con un emulador configurado (AVD)
- Variable de entorno `ANDROID_HOME` apuntando al SDK de Android

---

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repo>
   cd Desarrollo-de-aplicaciones-1-TPO-Parte2
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Abrir el emulador de Android**
   Desde Android Studio → Device Manager → Play, o desde la terminal:
   ```bash
   $avd = & "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe" -list-avds | Select-Object -First 1
   & "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe" -avd $avd
   ```

4. **Compilar y correr en el emulador**
   ```bash
   npx expo run:android
   ```
   La primera vez tarda varios minutos porque compila el código nativo con Gradle.

5. **Navegar a la pantalla "Dispositivo"**
   Abrir el menú lateral (drawer) y seleccionar **Dispositivo** para ver la información obtenida desde el módulo nativo Kotlin.

> Para correr en celular físico: habilitar **Depuración USB** en el dispositivo y conectarlo por cable antes del paso 4.
