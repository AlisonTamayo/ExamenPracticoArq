# Documentación de Arquitectura

## Principios Fundamentales de Clean Architecture

### 1. The Dependency Rule (Regla de Dependencias)

La regla más importante: **Las dependencias del código fuente solo pueden apuntar hacia adentro**, hacia capas de mayor nivel de abstracción.

```
┌────────────────────────────────────────┐
│                                        │
│     CAPA EXTERNA (Detalles)            │
│                                        │
│   ┌────────────────────────────────┐   │
│   │                                │   │
│   │   CAPA INTERMEDIA (Casos)      │   │
│   │                                │   │
│   │   ┌────────────────────────┐   │   │
│   │   │                        │   │   │
│   │   │   DOMINIO (Reglas)     │   │   │
│   │   │                        │   │   │
│   │   └────────────────────────┘   │   │
│   │                                │   │
│   └────────────────────────────────┘   │
│                                        │
└────────────────────────────────────────┘

Dependencias apuntan hacia el centro →
```

### 2. Capas de la Arquitectura

#### Capa 1: Entidades (Domain Layer)
**Propósito**: Encapsular las reglas de negocio más generales y de alto nivel

**Contenido**:
- `User.ts`: Entidad de dominio con validaciones de negocio
- `IUserRepository.ts`: Interfaz (Puerto) para acceso a datos

**Características**:
- Sin dependencias externas (ni frameworks, ni librerías)
- Código TypeScript puro
- Lógica de negocio invariante
- Inmutabilidad de entidades

**Ejemplo**:
```typescript
// La entidad User contiene reglas de negocio:
// - Validación de email
// - Validación de nombre
// - Lógica para determinar si es usuario nuevo
export class User {
  isNewUser(): boolean {
    // Regla de negocio: nuevo usuario si fue creado hace menos de 24h
  }
}
```

#### Capa 2: Casos de Uso (Use Cases Layer)
**Propósito**: Orquestar el flujo de datos hacia y desde las entidades

**Contenido**:
- `CreateUser.ts`: Crear un usuario nuevo
- `GetUser.ts`: Obtener un usuario
- `GetAllUsers.ts`: Obtener todos los usuarios
- `UpdateUser.ts`: Actualizar un usuario

**Características**:
- Define DTOs (Data Transfer Objects)
- Contiene lógica específica de la aplicación
- Depende de interfaces, no de implementaciones
- Orquesta entidades y repositorios

**Ejemplo**:
```typescript
export class CreateUser {
  constructor(private userRepository: IUserRepository) {}
  
  async execute(dto: CreateUserDTO): Promise<User> {
    // 1. Verificar reglas de aplicación (email único)
    // 2. Crear entidad de dominio
    // 3. Persistir usando el repositorio
  }
}
```

#### Capa 3: Adaptadores (Infrastructure & Presentation)
**Propósito**: Convertir datos entre el formato de los casos de uso y el formato externo

**Infrastructure (Adaptador de Salida)**:
- `InMemoryDatabase.ts`: Implementación de almacenamiento
- `UserRepositoryImpl.ts`: Implementación del repositorio

**Presentation (Adaptador de Entrada)**:
- `UserController.ts`: Controlador HTTP
- `userRoutes.ts`: Definición de rutas

**Características**:
- Implementan las interfaces definidas en capas internas
- Manejan detalles técnicos (HTTP, Base de datos, etc.)
- Transforman datos entre formatos

#### Capa 4: Frameworks y Drivers
**Propósito**: Detalles de implementación más externos

**Contenido**:
- Express.js (Framework web)
- TypeScript/Node.js (Plataforma)
- Jest (Testing)

## Patrones de Diseño Aplicados

### 1. Repository Pattern
**Problema**: Necesitamos acceder a datos sin acoplar la lógica de negocio a la implementación

**Solución**:
```typescript
// Interfaz en el dominio
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
}

// Implementación en infraestructura
export class UserRepositoryImpl implements IUserRepository {
  constructor(private database: InMemoryDatabase) {}
  // ... implementación
}
```

**Ventajas**:
- Fácil de testear (usar mock)
- Cambiar implementación sin afectar casos de uso
- Cumple con Dependency Inversion Principle

### 2. Dependency Injection
**Problema**: ¿Cómo conectar las capas sin crear acoplamiento?

**Solución**: Un contenedor que construye el grafo de dependencias

```typescript
export class Container {
  constructor() {
    // Construir de afuera hacia adentro
    this.database = new InMemoryDatabase();
    this.userRepository = new UserRepositoryImpl(this.database);
    this.createUserUseCase = new CreateUser(this.userRepository);
    this.userController = new UserController(this.createUserUseCase);
  }
}
```

**Ventajas**:
- Control centralizado de dependencias
- Fácil cambiar implementaciones
- Testeable (inyectar mocks)

### 3. Use Case Pattern
**Problema**: ¿Dónde poner la lógica de aplicación que no es del dominio?

**Solución**: Casos de uso con responsabilidad única

```typescript
// Cada caso de uso hace una cosa
export class CreateUser {
  async execute(dto: CreateUserDTO): Promise<User> {
    // Lógica específica de este caso de uso
  }
}
```

**Ventajas**:
- Single Responsibility Principle
- Fácil de entender y mantener
- Reutilizable

## Flujo de Datos

### Ejemplo: Crear Usuario

```
Cliente HTTP
    │
    │ POST /api/users
    │ { name, email }
    ↓
┌─────────────────────┐
│  UserController     │ ← Presentation Layer
│  .createUser()      │   (Valida entrada HTTP)
└─────────────────────┘
    │
    │ CreateUserDTO
    ↓
┌─────────────────────┐
│  CreateUser         │ ← Use Case Layer
│  .execute()         │   (Reglas de aplicación)
└─────────────────────┘
    │                 
    │ ← findByEmail() → IUserRepository (Interfaz)
    │                     ↑
    │                     │ implementa
    │                 UserRepositoryImpl
    │                     ↑
    ↓                     │
┌─────────────────────┐   │
│  User Entity        │ ← Domain Layer
│  (validaciones)     │   (Reglas de negocio)
└─────────────────────┘
    │
    │ User válido
    ↓
┌─────────────────────┐
│ UserRepositoryImpl  │ ← Infrastructure Layer
│ .save()             │   (Detalles técnicos)
└─────────────────────┘
    │
    │
    ↓
┌─────────────────────┐
│ InMemoryDatabase    │ ← Database
└─────────────────────┘
```

## Principios SOLID en Acción

### Single Responsibility Principle (SRP)
Cada clase tiene una única razón para cambiar:
- `User`: Solo cambia si cambian las reglas de negocio del usuario
- `CreateUser`: Solo cambia si cambia el proceso de creación
- `UserRepositoryImpl`: Solo cambia si cambia la forma de almacenar

### Open/Closed Principle (OCP)
Abierto para extensión, cerrado para modificación:
```typescript
// Puedo agregar nuevos repositorios sin modificar casos de uso
class MongoUserRepository implements IUserRepository { }
class PostgresUserRepository implements IUserRepository { }
```

### Liskov Substitution Principle (LSP)
Las implementaciones son intercambiables:
```typescript
// Cualquier implementación de IUserRepository funciona
const repo: IUserRepository = new UserRepositoryImpl();
// o
const repo: IUserRepository = new MongoUserRepository();
```

### Interface Segregation Principle (ISP)
Interfaces específicas y cohesivas:
```typescript
// IUserRepository solo tiene métodos relacionados con usuarios
// No tiene métodos de otros dominios
```

### Dependency Inversion Principle (DIP)
Dependencia de abstracciones, no de concreciones:
```typescript
// Use Case depende de la interfaz, no de la implementación
class CreateUser {
  constructor(private userRepository: IUserRepository) {}
  //                                 ↑
  //                            Abstracción
}
```

## Ventajas de Esta Arquitectura

### 1. Testabilidad
```typescript
// Fácil crear mocks
class MockUserRepository implements IUserRepository {
  async findById() { return mockUser; }
}

// Testear caso de uso aisladamente
const useCase = new CreateUser(new MockUserRepository());
```

### 2. Independencia de Frameworks
- Puedes cambiar Express por Fastify sin tocar casos de uso
- Puedes cambiar de base de datos sin tocar dominio

### 3. Independencia de UI
- El mismo backend puede servir REST API, GraphQL, o CLI
- La lógica de negocio no cambia

### 4. Mantenibilidad
- Cambios localizados en una capa
- Fácil encontrar dónde hacer cambios
- Código autodocumentado

### 5. Escalabilidad
- Agregar nuevas funcionalidades es sistemático
- Puedes tener equipos por capa
- Reutilización de casos de uso

## Testing Strategy

### Pirámide de Testing

```
        /\
       /  \      End-to-End (E2E)
      /    \     Pocos, lentos, costosos
     /──────\    
    /        \   Integration Tests
   /          \  Medianos en cantidad
  /────────────\ 
 /              \ Unit Tests
/________________\ Muchos, rápidos, económicos
```

### Tests Implementados

#### Unit Tests (Domain Layer)
```typescript
// User.test.ts - Tests de entidad
describe('User Entity', () => {
  it('should validate email format', () => {
    expect(() => {
      new User('1', 'John', 'invalid-email', new Date());
    }).toThrow('Invalid email format');
  });
});
```

#### Use Case Tests
```typescript
// CreateUser.test.ts - Tests de caso de uso
describe('CreateUser', () => {
  it('should create user with valid data', async () => {
    const mockRepo = new MockUserRepository();
    const useCase = new CreateUser(mockRepo);
    const user = await useCase.execute({
      name: 'John',
      email: 'john@example.com'
    });
    expect(user.email).toBe('john@example.com');
  });
});
```

## Próximos Pasos para Extender

1. **Agregar más entidades**: Product, Order, etc.
2. **Implementar base de datos real**: PostgreSQL, MongoDB
3. **Agregar autenticación**: JWT, OAuth
4. **Implementar eventos**: Event-driven architecture
5. **Agregar caché**: Redis
6. **Implementar logging**: Winston, Pino
7. **Agregar validación**: Zod, Joi
8. **Dockerizar**: Docker Compose

## Conclusiones

Esta arquitectura proporciona:
- ✅ Separación clara de responsabilidades
- ✅ Código testeable y mantenible
- ✅ Independencia de frameworks y tecnologías
- ✅ Escalabilidad para crecer con el proyecto
- ✅ Seguimiento de principios SOLID
- ✅ Facilidad para onboarding de nuevos desarrolladores

La inversión inicial en estructura se paga con creces en:
- Menos bugs
- Desarrollo más rápido a largo plazo
- Código más fácil de entender
- Menor costo de mantenimiento
