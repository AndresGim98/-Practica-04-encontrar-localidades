# API de localidades

Servidor desarrollado con Express JS para consultar localidades de la provincia de Buenos Aires a partir del archivo `cities.json`.
El servidor queda disponible en:

```text
http://localhost:3000
```
## Endpoints

```js
const API_URL = "http://localhost:3000";

[
  `GET ${API_URL}/`: "Documentacion de la API y listado de endpoints",
  `GET ${API_URL}/localidades`: "Lista completa de localidades",
  `GET ${API_URL}/localidades/:id`: "Localidad por id, enviado como parametro de ruta",
  `GET ${API_URL}/localidades/buscar?nombre=Guamini`: "Localidades por nombre, enviado como query parameter"
]
```

## Formato de respuestas

Todas las respuestas se entregan en formato JSON.

Las respuestas con mensajes tienen esta estructura:

```json
{
  "status": 200,
  "message": "Mensaje informativo",
  "data": "Informacion solicitada, si corresponde"
}
```

Cuando un recurso no existe, la API responde con codigo `404` y un mensaje informativo. No devuelve arreglos ni objetos vacios con codigo `200`.



## Parametros

- `/localidades/:id`: recibe el `id` de una localidad por parametro de ruta.
- `/localidades/buscar?nombre=Guamini`: recibe `nombre` por query parameter. La busqueda no distingue entre mayusculas, minusculas o tildes.

## Rutas para probar

```text
http://localhost:3000/
http://localhost:3000/localidades
http://localhost:3000/localidades/06147100
http://localhost:3000/localidades/buscar?nombre=Merlo
```

## Codigos de estado utilizados

- `200`: solicitud correcta.
- `400`: faltan parametros requeridos.
- `404`: recurso o ruta no encontrada.
