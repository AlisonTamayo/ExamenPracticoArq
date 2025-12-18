# Examen Práctico de Arquitectura - Alison Tamayo

Este proyecto es una demostración práctica de **Clean Architecture** (Arquitectura Limpia) implementada en TypeScript con Node.js y Express.

## 📋 Tabla de Contenidos

- [Introducción](#introducción)
- [Arquitectura](#arquitectura)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Principios Aplicados](#principios-aplicados)
- [Instalación](#instalación)
- [Uso](#uso)
- [Testing](#testing)
- [API Endpoints](#api-endpoints)

## 🎯 Introducción

Este proyecto demuestra la implementación de Clean Architecture con los siguientes objetivos:
- Separación de responsabilidades en capas bien definidas
- Independencia de frameworks y tecnologías externas
- Testabilidad del código de negocio
- Mantenibilidad y escalabilidad del código

## 🏗️ Arquitectura

### Clean Architecture - Capas

El proyecto está organizado en capas concéntricas, donde las dependencias apuntan hacia el centro:

```
┌─────────────────────────────────────┐
│     Presentation Layer (Routes)    │  ← UI/HTTP
├─────────────────────────────────────┤
│       Controllers (Adapters)        │  ← Adaptadores
├─────────────────────────────────────┤
│      Use Cases (Application)        │  ← Lógica de Aplicación
├─────────────────────────────────────┤
│    Domain (Entities + Interfaces)   │  ← Lógica de Negocio
└─────────────────────────────────────┘
         ↑
         │ Implementan
┌────────┴────────┐
│ Infrastructure  │  ← Base de Datos, Servicios Externos
└─────────────────┘
```

### 1. **Domain Layer (Capa de Dominio)**
- **Entidades**: `User` - Contiene la lógica de negocio pura
- **Interfaces de Repositorio**: `IUserRepository` - Contratos para acceso a datos
- **Sin dependencias externas** - Solo TypeScript puro

### 2. **Use Cases Layer (Capa de Casos de Uso)**
- `CreateUser` - Crear un nuevo usuario
- `GetUser` - Obtener un usuario por ID
- `GetAllUsers` - Obtener todos los usuarios
- `UpdateUser` - Actualizar información de usuario
- Orquesta el flujo entre entidades y repositorios

### 3. **Infrastructure Layer (Capa de Infraestructura)**
- `InMemoryDatabase` - Almacenamiento en memoria
- `UserRepositoryImpl` - Implementación concreta del repositorio
- Detalles de implementación que pueden cambiar fácilmente

### 4. **Presentation Layer (Capa de Presentación)**
- `UserController` - Maneja las peticiones HTTP
- `Routes` - Define los endpoints de la API
- Adapta las peticiones HTTP a los casos de uso

## 📁 Estructura del Proyecto

```
src/
├── domain/                    # Capa de Dominio
│   ├── entities/
│   │   ├── User.ts           # Entidad User con validaciones
│   │   └── User.test.ts      # Tests unitarios
│   └── repositories/
│       └── IUserRepository.ts # Interfaz del repositorio
├── usecases/                  # Capa de Casos de Uso
│   ├── CreateUser.ts
│   ├── CreateUser.test.ts
│   ├── GetUser.ts
│   ├── GetAllUsers.ts
│   └── UpdateUser.ts
├── infrastructure/            # Capa de Infraestructura
│   ├── database/
│   │   └── InMemoryDatabase.ts
│   └── repositories/
│       └── UserRepositoryImpl.ts
├── presentation/              # Capa de Presentación
│   ├── controllers/
│   │   └── UserController.ts
│   └── routes/
│       └── userRoutes.ts
├── config/
│   └── container.ts          # Inyección de Dependencias
├── app.ts                     # Configuración de Express
└── server.ts                  # Punto de entrada
```

## ✨ Principios Aplicados

### 1. **SOLID Principles**
- **S**ingle Responsibility: Cada clase tiene una única responsabilidad
- **O**pen/Closed: Abierto para extensión, cerrado para modificación
- **L**iskov Substitution: Las implementaciones pueden sustituirse
- **I**nterface Segregation: Interfaces específicas y cohesivas
- **D**ependency Inversion: Dependencias hacia abstracciones

### 2. **Dependency Rule**
Las dependencias apuntan hacia el centro (Domain). Las capas externas conocen las internas, pero no al revés.

### 3. **Repository Pattern**
Abstrae el acceso a datos mediante interfaces, permitiendo cambiar la implementación sin afectar la lógica de negocio.

### 4. **Dependency Injection**
Los componentes reciben sus dependencias, facilitando el testing y la flexibilidad.

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/AlisonTamayo/ExamenPracticoArq.git
cd ExamenPracticoArq

# Instalar dependencias
npm install

# Compilar TypeScript
npm run build
```

## 💻 Uso

### Desarrollo
```bash
# Ejecutar en modo desarrollo con auto-reload
npm run dev
```

### Producción
```bash
# Compilar el proyecto
npm run build

# Ejecutar el servidor compilado
npm start
```

El servidor se ejecutará en `http://localhost:3000`

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

### Linting

```bash
# Verificar código
npm run lint

# Corregir problemas automáticamente
npm run lint:fix
```

## 🔌 API Endpoints

### Root
```
GET /
```
Retorna información sobre la API y endpoints disponibles.

### Usuarios

#### Crear Usuario
```
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### Obtener Todos los Usuarios
```
GET /api/users
```

#### Obtener Usuario por ID
```
GET /api/users/:id
```

#### Actualizar Usuario
```
PUT /api/users/:id
Content-Type: application/json

{
  "name": "Jane Doe"
}
```

### Ejemplos con curl

```bash
# Crear un usuario
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'

# Obtener todos los usuarios
curl http://localhost:3000/api/users

# Obtener un usuario específico
curl http://localhost:3000/api/users/[USER_ID]

# Actualizar un usuario
curl -X PUT http://localhost:3000/api/users/[USER_ID] \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe"}'
```

## 🎓 Conceptos Demostrados

1. **Clean Architecture**: Separación clara de capas con reglas de dependencia
2. **Domain-Driven Design**: Entidades con lógica de negocio encapsulada
3. **Repository Pattern**: Abstracción del acceso a datos
4. **Dependency Injection**: Composición de objetos sin acoplamiento fuerte
5. **Immutability**: Entidades inmutables para mantener integridad
6. **Test-Driven Development**: Tests unitarios para validar comportamiento
7. **Type Safety**: TypeScript con configuración estricta

## 📚 Recursos Adicionales

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/tags/domain%20driven%20design.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

## 👤 Autor

**Alison Tamayo**

---

Este proyecto fue creado como examen práctico de arquitectura de software.