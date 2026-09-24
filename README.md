# IA-Recuerdo

Prototipo de recordatorios hablados y guías paso a paso. React, TypeScript, Vite y Capacitor para Android. Los datos se conservan en este dispositivo; no hay cuentas ni sincronización.

## Ejecutar en tu computadora

1. Instala **Node.js 24 LTS**, que incluye npm: https://nodejs.org/en/download
2. Abre PowerShell en esta carpeta (donde está `package.json`).
3. Ejecuta:

```powershell
npm.cmd ci
npm.cmd run dev
```

Abre http://127.0.0.1:5173/ en Chrome o Edge. Mantén abierta la terminal; Ctrl+C detiene el servidor. En macOS/Linux usa `npm` en lugar de `npm.cmd`.

También puedes usar `iniciar.cmd` en Windows después de instalar Node. Instala dependencias solo si faltan y arranca el servidor. Si el puerto 5173 ya está ocupado por esta app, abre la dirección existente. No necesitas iniciar dos servidores.

Si PowerShell bloquea `npm.ps1`, usa `npm.cmd`, como en los ejemplos, sin cambiar la política de seguridad. Si no encuentra Node/npm, cierra y abre la terminal después de instalar Node.

Para llevar estos cambios a otra computadora, copia esta carpeta sin `node_modules`, `dist` ni `.git`, e instala con `npm ci`. Los cambios son locales hasta que se publiquen en GitHub; clonar el repositorio remoto antes de publicarlos obtiene la versión anterior.

## Funciones actuales

- Crear y modificar avisos por dictado guiado o controles táctiles; se revisa el resumen antes de guardar.
- Fecha y hora futuras, anticipación opcional y frecuencia única, diaria o semanal.
- Aviso visual dentro de la aplicación y lectura hablada: de 1 a 5 repeticiones, con 30 segundos de pausa después de cada lectura. Tres por defecto.
- Si hay anticipación, se anuncia al comenzar esa anticipación y de nuevo al llegar la hora. Si la app estaba cerrada, el aviso se atiende al volver; no se promete puntualidad en segundo plano.
- Listo, posposición configurable, silenciar y cancelación confirmada. Listo en un aviso recurrente programa la siguiente fecha futura.
- Varias guías con progreso independiente, navegación por voz y pausa. Se mantienen las dos guías de ejemplo originales.
- Perfil local: nombre, tutor y teléfono, modelo de dispositivo, rutina y temas preferidos. Las sugerencias se basan en temas marcados, no en IA.
- Ayuda para llamar al tutor: abre el marcador del teléfono con el contacto configurado.
- Pregunta opcional una vez al día al entrar en inicio.

## Probar la voz

Toca **Hablar** antes de cada frase. El botón pasa a **Detener escucha**. Permite el micrófono cuando el navegador lo solicite. La compatibilidad y conexión necesarias dependen del motor de voz del dispositivo. El navegador integrado puede no ofrecer reconocimiento.

Ejemplo de creación:

1. Inicio: `crear aviso`.
2. Contenido: `Llamar a mi hija`.
3. `siguiente`.
4. `mañana a las diez de la mañana` o `dentro de cinco minutos`.
5. `avísame quince minutos antes` o `sin anticipación`.
6. Opcionales: `todos los días`, `cada semana`, `una sola vez`, `repetir tres veces`, `posponer diez minutos`.
7. Revisa el resumen y di `guardar`.

En Mis avisos: `modificar Llamar a mi hija` o `cancelar Llamar a mi hija`. Al editar, `texto Llamar a mi hermana` cambia el contenido. Si hay nombres duplicados, elige el aviso con su botón.

En una guía: `siguiente`, `atrás`, `repite`, `más despacio`, `pausar`. En el catálogo, di el título completo para abrirla. Cambiar de guía conserva el progreso.

Cuando aparece un aviso: `listo`, `más tarde`, `posponer cinco minutos` o `silenciar`. Después de la última repetición, se cierra el aviso y se conserva como pendiente; silenciar no significa completar. En avisos recurrentes, al silenciar o agotar repeticiones se programa la siguiente fecha futura.

El reconocimiento de fecha tiene una gramática acotada (hoy, mañana, pasado mañana o dentro de minutos/horas). Para otras fechas, utiliza el calendario. No se interpreta lenguaje libre con un modelo de IA todavía.

## Lo que queda pendiente

- API de generación y comprensión de lenguaje natural, fuentes verificadas y catálogo ampliado (YouTube, tienda, comida, Uber).
- Adaptación efectiva de guías al modelo de teléfono y a la rutina.
- Activación por frase sin tocar y control desde segundo plano mientras se usa otra aplicación.
- Notificaciones nativas con la app cerrada, funcionamiento sin conexión verificado en Android y Alexa.

Los recordatorios actuales requieren la app en ejecución. Las guías son ejemplos locales; el modo exclusivamente en línea corresponde a la futura generación con IA. No se incluyen claves API ni se envía el perfil a un servicio.

## Comprobar cambios

```powershell
npm.cmd test
npm.cmd run build
```

Las pruebas cubren fechas ambiguas o inválidas, medianoche, anticipación, posposición y recurrencia. La compilación web no sustituye pruebas de micrófono y voz en un teléfono.

## Android

Instala Android Studio y los requisitos de Capacitor 8: https://capacitorjs.com/docs/getting-started/environment-setup

```powershell
npm.cmd run android
```

Este comando compila, sincroniza y abre Android Studio. Selecciona un teléfono/emulador y ejecuta Run. Después de cambios web: `npm.cmd run cap:sync` y vuelve a ejecutar en Android Studio. El nombre mostrado es IA-Recuerdo y se conserva `mx.iarecuerdo.app` para no cambiar la identidad de la aplicación instalada.

## Organización

- `src/lib/reminders.ts`: fechas y programación de avisos.
- `src/lib/voice.ts`: síntesis y reconocimiento.
- `src/components/voice-command.tsx`: interacción de voz por frase.
- `src/screens/`: inicio, avisos, guías y perfil.
- `src/data/demo.ts`: ejemplos y tipos.
- `tests/`: pruebas de lógica de recordatorios.
