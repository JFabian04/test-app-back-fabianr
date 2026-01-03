#  Hexagonal Express API - TypeScript

REST API con **arquitectura hexagonal (Ports and Adapters)**, **Express.js**, **TypeScript** y **MySQL**. Diseñado como prueba técnica con calidad de producción.

---

##  Requisitos previos

- **Node.js** 18+
- **npm** 9+
- **MySQL** 8.0+

---

## Inicio rápido

### 1. Clonar e instalar dependencias

```bash
git clone <repositorio>
cd test-back
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env.development` en la raíz:

```env
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=
DB_NAME=services_db
NODE_ENV=development
PORT=3000
```

### 3. Levantar el backend

```bash
# Modo desarrollo (con hot-reload)
npm run dev

# Producción
npm run build
npm start
```

El servidor estará disponible en **http://localhost:3000**

---

##  Ejecutar tests

### Correr todos los tests

```bash
npm test
```

### Tests en modo watch

```bash
npm test:watch
```

### Cobertura de tests

```bash
npm test:coverage
```

**Resultado esperado:**
- 13 tests pasando
- 2 test suites (service + repository)
- Coverage: 70%+ en todas las métricas

---

## Documentación de la API

### Acceder a Swagger

Una vez levantado el servidor, accede a:

```
http://localhost:3000/api-docs
```

### Endpoints principales

#### Listar usuarios (con paginación y búsqueda)

```
GET /api/v1/users?page=1&limit=10&search=John
```

#### Crear usuario

```
POST /api/v1/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### Obtener usuario por ID

```
GET /api/v1/users/:id
```

#### Actualizar usuario

```
PUT /api/v1/users/:id
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.new@example.com"
}
```

#### Eliminar usuario (soft delete)

```
DELETE /api/v1/users/:id
```

#### Exportar usuarios a CSV

```
GET /api/v1/users/export
```

Descarga archivo: `users_1234567890.csv`

---

## Estructura del proyecto / Arquitectura hexagonal

```
src/
├── app.ts                          # Servidor Express
├── index.ts                        # Punto de entrada
├── container.ts                    # Inyección de dependencias
├── config/
│   ├── database.ts                 # Conexión Sequelize
│   ├── envs.config.ts              # Validación con Zod
│   └── swagger.config.ts           # Documentación OpenAPI
├── decorators/
│   └── withTryCatch.ts             # Wrapper async/await
├── domain/
│   ├── entities/
│   │   └── User.ts                 # Entidad de dominio
│   ├── errors/
│   │   └── UserAlreadyExistsError.ts
│   └── ports/
│       └── UserRepository.ts       # Interfaz de puerto
├── infrastructure/
│   ├── db/sequelize/
│   │   ├── models/
│   │   │   └── user.model.ts       # Modelo ORM
│   │   └── repositories/
│   │       └── UserRepositorySequelize.ts # Adaptador
│   └── http/
│       ├── controllers/
│       │   └── user.controller.ts
│       ├── middlewares/
│       │   ├── error.middleware.ts
│       │   └── validation.middleware.ts
│       ├── dtos/
│       │   ├── CreateUserDto.ts
│       │   └── UpdateUserDto.ts
│       ├── errors/
│       │   └── HttpException.ts
│       ├── routes/v1/
│       │   ├── user.route.ts
│       │   └── index.ts
│       └── services/
│           ├── user.service.ts
│           └── user-export.service.ts
├── utils/
│   └── logger.ts                   # Winston logging
└── __tests__/unit/
    ├── user.service.test.ts
    └── user.repository.test.ts
```


## 📦 Scripts disponibles

```bash
npm run dev              # Desarrollo con hot-reload
npm run build            # Compilar TypeScript
npm start                # Producción
npm test                 # Tests
npm test:watch           # Tests en watch
npm test:coverage        # Coverage
npm run lint             # ESLint
npm run lint:fix         # Fijar ESLint issues
npm run format           # Prettier
npm run format:check     # Verificar Prettier
npm run clean            # Limpiar dist/
```

---

## 🔒 Seguridad

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Control de origen
- **Rate limiting**: 100 req/15 min
- **Input validation**: Zod + class-validator
- **Soft delete**: Auditoría de cambios
- **Winston logging**: Trazabilidad de errores
