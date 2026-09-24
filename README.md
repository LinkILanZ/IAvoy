# IAvoy

Prototipo (avance dummy) de una app para personas mayores: avisos por voz y guías paso a paso.
Usuaria de referencia: **Chuy, 68 años**.

## Stack

| Capa        | Tecnología                                                                                                                       |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| UI          | React 19 + TypeScript + Vite                                                                                                     |
| Componentes | shadcn/ui (estilo new-york, adaptado a la paleta de la propuesta)                                                                |
| Estilos     | Tailwind CSS v4                                                                                                                  |
| App móvil   | Capacitor 8 (Android)                                                                                                            |
| Voz         | `@capacitor-community/text-to-speech` y `@capacitor-community/speech-recognition` en el teléfono; Web Speech API en el navegador |
| Tipografía  | Atkinson Hyperlegible Next (diseñada para baja visión)                                                                           |

## Qué funciona en este avance

- **Lectura en voz alta** (texto → voz): avisos, pasos de las guías y la ayuda.
- **Dictado** (voz → texto) para crear un aviso. Si el dispositivo no lo permite, se puede escribir.
- Aviso emergente cuando llega la hora (con la app abierta), con **Listo / Más tarde**.
- Guía de ejemplo con progreso guardado.
- Todo lo demás es dummy: datos locales, sin backend, sin notificaciones del sistema.

> Para probar un aviso rápido: _Decir un aviso → Siguiente → “Probar: avisarme en 1 minuto”_.

## Empezar

```bash
npm install
npm run dev          # navegador (usa Chrome para el dictado)
```

### Android

Requiere Android Studio.

```bash
npm run android      # build + cap sync + abre Android Studio
```

Desde Android Studio, ejecutar en un teléfono o emulador. El permiso de micrófono ya está declarado en
`android/app/src/main/AndroidManifest.xml`.

Después de cada cambio en el front: `npm run cap:sync`.

## Agregar más componentes de shadcn

`components.json` ya está configurado:

```bash
npx shadcn@latest add select
```

Revisar que el componente nuevo respete las reglas visuales (abajo).

## Reglas visuales (diapositiva 5)

- Cuatro colores: **fondo** `#F4F7FA`, **texto** `#14233B`, **acción** `#BFE5D3`, **ayuda** `#FFD66B`.
- Siempre texto oscuro sobre fondo claro. **Nunca letra blanca.**
- Bordes visibles (2 px). Botones principales de 96 px de alto; ningún objetivo táctil menor a 48 px.
- Una instrucción por pantalla. El botón **Ayuda** está en todas.
- El micrófono solo se activa al tocarlo.

Los tokens viven en `src/index.css`.

## Estructura

```
src/
  components/
    ui/               componentes shadcn (button, card, dialog, …)
    speak-button.tsx  botón “Escuchar” reutilizable
    reminder-alert.tsx
    help-dialog.tsx
  lib/voice.ts        capa de voz (nativo / web)
  screens/            inicio, nuevo aviso, mis avisos, guías
  data/demo.ts        datos de ejemplo
```

## Siguiente versión (fuera de este avance)

Notificaciones del sistema con la app cerrada (`@capacitor/local-notifications`), comandos por voz
(“repite”, “siguiente”) y la integración opcional con Alexa.
