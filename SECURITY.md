# Seguridad

## Reportar una vulnerabilidad

No publiques vulnerabilidades ni datos sensibles en un issue público. Repórtalos de forma privada mediante la opción **Security > Report a vulnerability** del repositorio en GitHub.

Incluye una descripción, pasos para reproducir, impacto estimado y una posible solución si la conoces.

## Alcance actual

Finova no usa autenticación, base de datos ni servicios externos. Los movimientos se almacenan en `localStorage` y permanecen en el navegador del usuario. Por ello, esta versión es una demostración y no debe usarse como sistema contable ni para guardar información financiera sensible.

Nunca incluyas tokens, credenciales ni archivos `.env` en el repositorio. Las variables privadas no deben llevar el prefijo `NEXT_PUBLIC_`.
