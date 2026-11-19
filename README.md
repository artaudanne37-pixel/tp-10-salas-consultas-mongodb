
Trabajo práctico 10 — Consultas de reservas de salas

Descripción

En este trabajo continué con el proyecto de reservas de salas de los trabajos anteriores.

La aplicación está hecha con Node.js, Express y EJS, y utiliza MongoDB Atlas para guardar la información.

En este TP agregué nuevas formas de consultar las reservas. Ahora se pueden filtrar por sala, ordenar los resultados y mostrarlos por páginas. También se mantienen las funciones que ya estaban hechas para crear, buscar, modificar y eliminar reservas.

Para trabajar con la base de datos utilizo Mongoose.

Requisitos

Para poder ejecutar el proyecto se necesita:

- Node.js 22.13 o una versión superior.
- npm.
- Una cuenta de MongoDB Atlas.

Instalación y ejecución

Primero hay que abrir una terminal dentro de la carpeta del proyecto e instalar las dependencias:

npm install

Después hay que configurar el archivo ".env" con los datos de conexión a MongoDB Atlas.

Una vez configurado, se puede iniciar el servidor con:

npm start

La aplicación queda disponible en:

http://localhost:3000

Para revisar el formato del código y ejecutar ESLint se utiliza:

npm run check

Configuración

El proyecto utiliza las siguientes variables de entorno:

Variable| Valor
PORT| 3000
NODE_ENV| development
MONGODB_URI| Cadena de conexión de MongoDB Atlas

Incluí un archivo ".env.example" para mostrar cómo se deben configurar estas variables.

Para que funcione la conexión, hay que crear un archivo ".env" y completar "MONGODB_URI" con la cadena de conexión propia.

En este trabajo utilizo la base de datos "reservas_salas_u10" y la colección "reservas".

El archivo ".env" no se debe subir a GitHub porque contiene los datos privados de conexión.

Organización de los archivos

El proyecto está organizado por carpetas para separar las distintas partes de la aplicación.

Dentro de "src" se encuentran los archivos principales:

- "index.js": inicia el servidor y realiza la conexión con MongoDB.
- "app.js": configura Express y las rutas.
- "config/": contiene la configuración de la conexión a la base de datos.
- "modelos/": contiene el modelo de las reservas.
- "servicios/": se encarga de realizar las operaciones con MongoDB.
- "controladores/": contiene la lógica de las solicitudes.
- "rutas/": define las rutas de la aplicación.
- "middleware/": contiene los middlewares utilizados.

También está la carpeta "scripts", que contiene archivos para comprobar la conexión, crear una reserva y listar las reservas guardadas.

Rutas de la aplicación

Las principales rutas de la parte web son:

Método| Ruta| Función
GET| "/"| Muestra la página de inicio.
GET| "/estado"| Muestra el estado del servicio y la cantidad de reservas.
GET| "/reservas"| Muestra las reservas.
GET| "/reservas/nueva"| Muestra el formulario para crear una reserva.
POST| "/reservas"| Guarda una nueva reserva.
GET| "/reservas/:id"| Muestra una reserva según su ID.

API HTTP

La API permite realizar distintas operaciones sobre las reservas mediante solicitudes HTTP.

Método| Ruta| Función
GET| "/api/reservas"| Consulta las reservas.
GET| "/api/reservas/:id"| Busca una reserva por su ID.
POST| "/api/reservas"| Crea una reserva.
PUT| "/api/reservas/:id"| Reemplaza los datos de una reserva.
PATCH| "/api/reservas/:id"| Modifica algunos datos de una reserva.
DELETE| "/api/reservas/:id"| Elimina una reserva.

Consultas de reservas

Una de las partes principales de este trabajo es la consulta de reservas.

Para realizar las búsquedas se pueden utilizar distintos parámetros:

- "sala": permite buscar reservas de una sala determinada.
- "orden": permite elegir cómo ordenar los resultados.
- "pagina": indica qué página se quiere consultar.
- "limite": indica cuántas reservas se muestran por página.

Los tipos de ordenamiento disponibles son:

- "estudiante": ordena por nombre del estudiante.
- "personas-asc": ordena por cantidad de personas de menor a mayor.
- "personas-desc": ordena por cantidad de personas de mayor a menor.

Si no se indican los parámetros, se utiliza la primera página, con un límite de 2 reservas.

Algunos ejemplos de consultas son:

Consultar las reservas de la primera página:

GET /api/reservas?pagina=1&limite=2

Buscar solamente las reservas de Sala Norte:

GET /api/reservas?sala=Sala%20Norte

Buscar las reservas de Sala Norte y ordenarlas por cantidad de personas:

GET /api/reservas?sala=Sala%20Norte&orden=personas-asc

Consultar la segunda página:

GET /api/reservas?sala=Sala%20Norte&pagina=2&limite=2

La respuesta de la API incluye:

- "datos": las reservas que se encontraron.
- "pagina": la página actual.
- "limite": la cantidad de resultados por página.
- "total": la cantidad total de reservas encontradas.
- "paginas": la cantidad total de páginas.

Crear, modificar y eliminar reservas

Para crear una reserva mediante POST se envía un objeto JSON con los datos correspondientes. Por ejemplo:

{
  "estudiante": "Paula Prueba",
  "email": "paula.prueba@gmail.com",
  "sala": "Sala Norte",
  "fecha": "2026-11-20",
  "turno": "Tarde",
  "personas": 2
}

Si la reserva se crea correctamente, la API devuelve el código "201 Created" y los datos de la reserva guardada. El estado se establece automáticamente como "pendiente".

También se puede utilizar PUT para reemplazar los datos de una reserva y PATCH para modificar solamente algunos campos permitidos.

Por último, DELETE permite eliminar una reserva utilizando su ID.

Validaciones y respuestas

El proyecto tiene distintas validaciones para evitar que se guarden datos incorrectos.

Se controla que los campos estén completos, que el email tenga un formato válido, que la sala y el turno sean permitidos y que la cantidad de personas esté entre 1 y 6.

También se verifica que los IDs sean válidos, que las reservas existan y que los parámetros de consulta tengan valores permitidos.

Los códigos de respuesta utilizados por la API son:

- "200": la solicitud se realizó correctamente.
- "201": la reserva se creó correctamente.
- "204": la reserva se eliminó correctamente.
- "400": hay datos o parámetros incorrectos.
- "404": no se encontró la reserva.
- "500": ocurrió un error interno del servidor.

Pruebas realizadas

Para probar el funcionamiento del proyecto utilicé PowerShell.

Primero comprobé la conexión con MongoDB Atlas y que el servidor iniciara correctamente.

Después realicé distintas pruebas con las solicitudes GET para comprobar las consultas:

- Consulté el listado de reservas.
- Probé la paginación utilizando diferentes páginas y límites.
- Filtré las reservas por sala.
- Ordené los resultados por cantidad de personas.
- Comprobé que una página inválida devolviera el código "400".
- Probé enviar un parámetro no permitido y comprobé que también devolviera el código "400".

Además, ejecuté los comandos para revisar el formato y comprobar el código con ESLint, y ambos finalizaron sin errores.

Scripts utilizados

Para comprobar la conexión con MongoDB Atlas:

node --env-file=.env scripts/comprobar-conexion.js

Para crear una reserva de prueba:

node --env-file=.env scripts/crear-reserva.js

Para listar las reservas guardadas:

node --env-file=.env scripts/listar-reservas.js

Para revisar el formato y ejecutar ESLint:

npm run check

Persistencia de los datos

Las reservas se guardan en MongoDB Atlas, por lo que la información permanece almacenada aunque se detenga el servidor.

Con este trabajo pude agregar nuevas formas de it statusconsultar los datos, utilizando filtros, ordenamiento y paginación, manteniendo las operaciones que ya había realizado en los trabajos anteriores.