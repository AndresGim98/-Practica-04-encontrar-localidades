import express from "express";
import fs from "node:fs";

const app = express();
const PORT = 3000;

// Esta funcion prepara los textos para comparar nombres sin diferenciar mayusculas, minusculas o tildes.
const normalizeText = (text) =>
  text
    // Convierte el texto a minusculas.
    .toLowerCase()
    // Separa las letras de los acentos.
    .normalize('NFD')
    // Elimina los acentos del texto.
    .replace(/[\u0300-\u036f]/g, '');

const data = fs.readFileSync("./cities.json", "utf-8");
const parsed = JSON.parse(data);
const cities = Array.isArray(parsed.localidades)
  ? parsed.localidades
  : Object.values(parsed.localidades);

console.log("Ciudades cargadas:", cities.length);

// Ruta raíz: documenta la API, sus endpoints y cómo usarlos
app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    message: "API de localidades de la Provincia de Buenos Aires",
    descripcion: "Esta API permite consultar las localidades bonaerenses.",
    endpoints: [
      {
        metodo: "GET",
        ruta: "/localidades",
        descripcion: "Devuelve el listado completo de localidades",
      },
      {
        metodo: "GET",
        ruta: "/localidades/:id",
        descripcion: "Devuelve la localidad que coincida con el id indicado",
        parametros: { 
          id: "string (parámetro de ruta)" 
        },
        ejemplo: "/localidades/0612801238",
      },
      {
        metodo: "GET",
        ruta: '/localidades/buscar?nombre=Guamini',
        descripcion: "Busca localidades cuyo nombre contenga el texto indicado",
        parametros: {
           nombre: "Nombre o parte del nombre de una localidad."}
      },
    ],
  });
});

// Ruta /localidades: devuelve todas las localidades del array
app.get("/localidades", (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Listado completo de localidades",
    data: cities,
  });
});

// Ruta /localidades/buscar: debe ir ANTES de /:id para que Express
// no interprete "buscar" como un valor del parámetro :id
app.get("/localidades/buscar", (req, res) => {
  const { nombre } = req.query;

  if (nombre) {
   const nombreBuscado = normalizeText(nombre);
        const filteredResults = cities.filter((localidad) =>
            normalizeText(localidad.nombre).includes(nombreBuscado)
        );

        if (filteredResults.length > 0) {
            res.json({
                status: 200,
                message: 'Localidades encontradas',
                data: filteredResults
            });
        } 
        
        else {
            res.status(404).json({
                status: 404,
                message: 'Recurso no encontrado',
                data: null
            });
        }
    } else {
        res.status(400).json({
            status: 400,
            message: 'Debe enviar el parametro query nombre. Ejemplo: /localidades/buscar?nombre=Guamini',
            data: null
        });
    }
});

// Ruta /localidades/:id: busca una localidad por su id (parámetro de ruta)
app.get("/localidades/:id", (req, res) => {
  const id = req.params.id;

  const localidad = cities.find((localidad) => localidad.id === id);

  if (localidad !== undefined) {
        res.json({
            status: 200,
            message: 'Localidad encontrada',
            data: localidad
        });
    } else {
        res.status(404).json({
            status: 404,
            message: 'Recurso no encontrado',
            data: null
        });
    }
});

// Para rutas no definidas
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: "Ruta inexistente",
    data: null
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});