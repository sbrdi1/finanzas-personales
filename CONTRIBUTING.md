# Contribuir a Finova

Gracias por mejorar Finova. Mantén los cambios pequeños, verificables y enfocados en un solo objetivo.

## Preparar el entorno

1. Instala Node.js 22 LTS y npm.
2. Clona el repositorio.
3. Ejecuta `npm ci` para instalar exactamente las versiones del lockfile.
4. Inicia el entorno con `npm run dev`.

## Flujo recomendado

1. Crea una rama desde `main`: `git switch -c tipo/descripcion-corta`.
2. Implementa el cambio sin incluir secretos ni archivos `.env`.
3. Ejecuta `npm run check`.
4. Crea un commit claro y abre un pull request.

Prefijos sugeridos: `feat/`, `fix/`, `docs/`, `refactor/` y `chore/`.

## Criterios para un pull request

- Explica el problema y la solución.
- Incluye capturas si cambia la interfaz.
- Comprueba el comportamiento en vista móvil y escritorio.
- Conserva la accesibilidad: etiquetas, navegación por teclado, contraste y estados de foco.
- Actualiza la documentación cuando cambien comandos, arquitectura o despliegue.

La integración continua ejecuta lint, comprobación de tipos y build de producción en cada pull request.
