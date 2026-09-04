# Plantillas de correo de Supabase

Los mails que manda Supabase vienen **en inglés** por defecto. Un cliente que se
registra en un sitio en español y recibe *"Confirm your signup"* de un remitente
que no reconoce, muchas veces lo borra pensando que es phishing.

## Cómo instalarlas

Supabase → **Authentication** → **Email Templates**. Para cada una, pegar el
contenido del archivo en el campo **Message body** y cambiar también el asunto:

| Plantilla de Supabase | Archivo | Asunto sugerido |
|---|---|---|
| Confirm signup | `confirmar-cuenta.html` | Confirmá tu cuenta en Distribuidora Castelli |
| Reset Password | `recuperar-contrasena.html` | Restablecer tu contraseña - Distribuidora Castelli |

Supabase trae más plantillas (Magic Link, Invite user, Change Email Address,
Reauthentication). Solo hacen falta si se usan esos flujos.

## Variables

Se reemplazan al enviar. Las que usan estas plantillas:

- `{{ .ConfirmationURL }}` — el enlace de acción, ya armado con su token.

Otras disponibles: `{{ .Token }}` (código de 6 dígitos), `{{ .TokenHash }}`,
`{{ .SiteURL }}`, `{{ .Email }}`, `{{ .RedirectTo }}`.

## Decisiones de maquetado

Lo que en una web sería trivial acá no funciona, sobre todo en Outlook de
escritorio, que usa el motor de Word para renderizar:

- **Tablas y estilos en línea.** Nada de flex, grid ni hojas de estilo externas.
- **Botón con el color en el `<td>`**, no solo en el `<a>`: Outlook ignora el
  padding de los enlaces y el botón quedaría como texto suelto.
- **El enlace también en texto plano** debajo del botón, porque hay clientes
  corporativos que eliminan los botones.
- **Logo en JPEG** (`LOGODC2.jpeg`, 130x130, 4 KB). El logo del sitio está en
  `.webp`, que Outlook de escritorio no soporta: se vería un recuadro roto.
- **`bgcolor` además del `style`** en las celdas con fondo, para que el modo
  oscuro de algunos clientes no invierta los colores del encabezado.
- **Texto de vista previa oculto** al inicio: es lo que se lee en la bandeja de
  entrada antes de abrir el mensaje.

## Sobre la validez de los enlaces

Las plantillas dicen "validez limitada" en vez de un número concreto, para no
quedar desactualizadas. El valor real se configura en **Authentication →
Providers → Email** (`Email OTP Expiration`). Si lo fijás, conviene poner el
número explícito en el texto: es información útil para quien lo recibe.

## Antes de darlas por buenas

Mandate una prueba a vos mismo y revisá:

1. Que **no caiga en spam** (es lo más importante).
2. Que el logo se vea, y no un recuadro vacío.
3. Que el botón funcione y que el enlace de texto también.
4. Cómo se ve en el celular, que es donde se van a leer casi todos.
