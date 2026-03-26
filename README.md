# Proyecto Backend
## Descripción
Este proyecto consiste en el desarrollo de una API REST utilizando NodeJS, Express y MongoDB Atlas, aplicando autenticación con JWT, control de roles, relaciones entre colecciones y subida de imágenes mediante Cloudinary.
El objetivo es poner en práctica los conocimientos adquiridos en el módulo 8 del curso de Desarrollo Web de Rock{TheCode}.

## Tecnologías utilizadas

- NodeJS
- Express
- MongoDB Atlas
- Mongoose
- JWT (jsonwebtoken)
- bcrypt
- dotenv
- Cloudinary
- multer / multer-storage-cloudinary

## Modelos empleados
### Modelo User
El usuario cuenta con los siguientes campos:
- username: string
- password: string, encriptado
- role: string (user o admin)
- image: string, URL de Cloudinary
- items: array de ObjectId relacionados con Item

Los usuarios solo pueden crearse con el rol user, el primeradmin se deberá crear manualmente desde MOngoDB Atlas. Un usuario no puede cambiar su propio rol, solo los admins pueden cambiar roles. Un usuario no puede eliminar a otros usuarios, solo puede eliminarse a el mismo, en cambio un admin puede eliminar a otros usuarios.

### Modelo Item
Colección indeoendiente utilizada para relacionarse con los usuarios.
Item cuanta con los siguientes campos:
- name: string
- type: string

De esta colección se ha creado una seed para falicitar las pruebas del proyecto.

### Relación User - Item
Todos los usuarios tienen un array de items. Se usa $addToSet para evitar duplicados. Los items nuevos no sobreescriben los anteriores. Se utiliza populate para obtener los datos completos.

## Endpoints principales
### Usuarios

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST   | /users/register | Registrar nuevo usuario |
| POST   | /users/login | Login de usuario |
| GET    | /users/:id | Obtener usuario por ID |
| PUT    | /users/:id | Actualizar usuario (username, password, image) |
| PUT    | /users/:id/role | Cambiar rol de usuario (solo admins) |
| DELETE | /users/:id | Eliminar usuario |
| POST   | /users/items | Añadir item al array de usuario |

### Items

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET    | /items | Obtener todos los items |
| GET    | /items/:id | Obtener item por ID |
| POST   | /items | Crear nuevo item |
| PUT    | /items/:id | Actualizar item |
| DELETE | /items/:id | Eliminar item |

 
