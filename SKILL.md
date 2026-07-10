---
name: responsive-web-design
description: Usa esta skill cuando el usuario pida crear, mejorar o revisar una página web responsive (mobile-first) en Antigravity. Se activa con frases como "hazla responsive", "adapta esto a mobile", "crea una landing responsive", "revisa breakpoints".
---

# Responsive Web Design Skill

## Objetivo
Construir o adaptar interfaces web que se vean y funcionen correctamente en cualquier tamaño de pantalla (móvil, tablet, escritorio), usando CSS moderno y verificación visual en el navegador integrado de Antigravity.

## Stack por defecto
- HTML5 semántico
- CSS con Flexbox / Grid (sin frameworks pesados salvo que el usuario pida Tailwind/Bootstrap)
- Mobile-first: escribe primero los estilos base para pantallas pequeñas, luego usa `min-width` en media queries para escalar hacia arriba
- Unidades relativas: `rem`, `%`, `vw/vh`, `clamp()` en vez de `px` fijos siempre que sea posible

## Breakpoints estándar
- Móvil: hasta 480px (estilos base, sin media query)
- Tablet: `@media (min-width: 768px)`
- Escritorio: `@media (min-width: 1024px)`
- Pantallas grandes: `@media (min-width: 1440px)`

## Pasos concretos
1. Define la estructura HTML semántica (`header`, `nav`, `main`, `section`, `footer`) sin estilos de layout embebidos.
2. Escribe el CSS base pensando en móvil: una sola columna, tipografía legible (mínimo 16px), botones con área táctil de al menos 44px.
3. Usa `display: flex` o `grid` con `grid-template-columns: repeat(auto-fit, minmax(...))` para que el layout se adapte sin media queries cuando sea posible.
4. Agrega media queries `min-width` para reorganizar en columnas múltiples, mostrar navegación horizontal, o ajustar tamaños de imagen en tablet/escritorio.
5. Usa `clamp(min, preferido, max)` para tipografía y espaciados fluidos en vez de múltiples breakpoints repetidos.
6. Optimiza imágenes con `max-width: 100%; height: auto;` y considera `<picture>` o `srcset` si hay assets de distintas resoluciones.
7. Verifica el resultado en el navegador integrado de Antigravity: renderiza la página y cambia el ancho de la ventana entre 375px, 768px, 1024px y 1440px para confirmar que no hay overflow horizontal ni elementos rotos.
8. Si detectas overflow, revisa `box-sizing: border-box`, márgenes negativos, y contenedores sin `max-width: 100%`.
9. Muestra capturas o resultados en cada breakpoint antes de dar la tarea por terminada.

## Restricciones
- No uses anchos fijos en `px` para contenedores principales.
- No dupliques HTML para desktop/mobile; un solo markup con CSS adaptable.
- Evita JavaScript para layout responsive salvo que sea estrictamente necesario (ej. menú hamburguesa).
- Prioriza accesibilidad: contraste adecuado, `alt` en imágenes, foco visible en elementos interactivos.

## Ejemplo de prompt para el agente
"Implementa esta landing en HTML + CSS puro, mobile-first, con breakpoints en 768px y 1024px. Verifica en el navegador integrado que no haya overflow horizontal en 375px de ancho y muéstrame capturas en móvil, tablet y desktop."
