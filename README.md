# Mobile Store

    Aplicación web desarrollada con React y Vite para consultar un catálogo de dispositivos móviles, visualizar sus características técnicas y añadir productos al carrito.

## Tecnologías

- React
- React Router
- Vite
- JavaScript
- CSS
- Vitest
- React Testing Library
- ESLint

## Funcionalidades

- Listado de dispositivos móviles con diseño responsive.
- Búsqueda dinámica por marca y modelo.
- Consulta de características técnicas de cada producto.
- Selección de color y almacenamiento.
- Añadir productos al carrito.
- Persistencia del contador del carrito mediante localStorage.
- Caché de las peticiones GET durante una hora.
- Navegación entre páginas mediante React Router.

## Instalación y ejecución

```bash 
git clone https://github.com/taniacorralbalseiro/frontend-test.git
cd frontend-test
npm install
npm start
```

## Scripts disponibles

- npm start
- npm run dev
- npm run build
- npm test
- npm run lint
- npm run preview

## Tests

El proyecto incluye 49 pruebas automatizadas, distribuidas en 8 archivos, utilizando Vitest y React Testing Library.
    
Las pruebas cubren:
    
- Caché de productos y expiración.
- Peticiones a la API y gestión de errores.
- Visualización y búsqueda de productos.
- Características técnicas de los dispositivos.
- Selección de opciones y operaciones del carrito.
- Estados de carga y cancelación de peticiones.
- Navegación y contador del carrito.
    
Para ejecutarlas:
    
```bash
npm test
```