# Seguridad

## Reportar una vulnerabilidad

No publiques vulnerabilidades ni datos sensibles en un issue público. Repórtalos de forma privada mediante la opción **Security > Report a vulnerability** del repositorio en GitHub.

Incluye una descripción, pasos para reproducir, impacto estimado y una posible solución si la conoces.

## Alcance actual

Finova usa Auth.js, GitHub OAuth y PostgreSQL. Las acciones del servidor validan entradas, sesión y propiedad del recurso. Aun así, el proyecto es educativo y debe someterse a auditoría, monitoreo y pruebas de penetración antes de manejar información financiera real.

Nunca incluyas tokens, credenciales ni archivos `.env` en el repositorio. Las variables privadas no deben llevar el prefijo `NEXT_PUBLIC_`.
