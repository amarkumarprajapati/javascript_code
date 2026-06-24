# NestJS — Interview Questions & Answers

---

## General Questions

### 1. What is NestJS?

**Answer:** NestJS is a progressive, open-source **Node.js framework** for building efficient, scalable server-side applications. It is built with **TypeScript** and heavily inspired by **Angular** — using modules, decorators, and dependency injection.

Used for REST APIs, GraphQL APIs, microservices, and WebSocket applications.

```ts
@Controller('users')
export class UsersController {
  @Get()
  findAll() { return 'all users'; }
}
```

---

### 2. Who developed NestJS and why?

**Answer:** NestJS was developed by **Kamil Myśliwiec** (Polish software engineer). He created it to address the lack of consistent architecture in Node.js apps and to bring enterprise patterns (modules, DI, decorators) from Angular to the server side.

---

### 3. When was NestJS first released?

**Answer:** **October 5, 2016.**

---

### 4. What is the difference between Node.js and NestJS?

**Answer:**

| Node.js | NestJS |
| --- | --- |
| JavaScript **runtime** | **Framework** on top of Node |
| Low-level APIs | Structured architecture (modules, DI) |
| No enforced structure | Opinionated, scalable structure |
| JavaScript/TypeScript | TypeScript-first |

Node runs JavaScript. Nest organizes it into modules, controllers, and services with dependency injection.

---

### 5. What is the difference between NestJS and Express?

**Answer:**

| Express | NestJS |
| --- | --- |
| Minimal, unopinionated | Opinionated, structured |
| JavaScript (optional TS) | TypeScript-first |
| Manual dependency management | Built-in Dependency Injection |
| No enforced project structure | Modules, controllers, services |
| Faster to start small projects | Better for large/enterprise apps |

Nest actually **uses Express (or Fastify) under the hood** — it adds architecture on top.

---

### 6. What is the difference between NestJS and Angular?

**Answer:**

| Angular | NestJS |
| --- | --- |
| **Frontend** framework | **Backend** framework |
| Runs in browser | Runs on Node.js server |
| Components, templates | Controllers, services |
| Share concepts: modules, decorators, DI, services | Share concepts: modules, decorators, DI, services |

If you know Angular, NestJS feels familiar.

---

### 7. Is NestJS frontend or backend?

**Answer:** **Backend only.** It handles HTTP requests, business logic, and database interactions on the server.

---

### 8. Why use NestJS?

**Answer:**
- **Scalable architecture** — modules keep large apps organized
- **TypeScript** — type safety, fewer runtime bugs
- **Dependency Injection** — testable, modular code
- **Built-in patterns** — guards, pipes, interceptors, filters
- **Enterprise-ready** — Swagger, microservices, GraphQL, WebSockets
- **Great testing support** — `@nestjs/testing` module

---

### 9. How do you install NestJS and create a project?

**Answer:**

```bash
npm i -g @nestjs/cli
nest new project-name
cd project-name
npm run start:dev
```

---

### 10. How do you generate modules, controllers, and services?

**Answer:**

```bash
nest g module users
nest g controller users
nest g service users
nest g resource users   # generates module + controller + service + DTOs + CRUD
```

---

### 11. What is the entry file of a NestJS application?

**Answer:** **`main.ts`** — bootstraps the root module and starts the HTTP server.

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

`NestFactory.create(AppModule)` creates the IoC container, resolves dependencies, and binds routes.

---

### 12. What HTTP engine does NestJS use?

**Answer:** **Express** by default. Can be swapped to **Fastify** for better performance:

```bash
npm install @nestjs/platform-fastify
```

```ts
const app = await NestFactory.create(AppModule, new FastifyAdapter());
```

---

### 13. Can you use other languages like Python or Ruby with NestJS?

**Answer:** **No** — NestJS runs on the Node.js runtime (JavaScript/TypeScript only). However, you can build separate services in Python/Ruby and communicate with NestJS via **HTTP, gRPC, or message queues** (microservices pattern).

---

## Architecture & Components

### 14. What are the main components of a NestJS application?

**Answer:** Three core building blocks:

| Component | Decorator | Role |
| --- | --- | --- |
| **Module** | `@Module()` | Organizes related features |
| **Controller** | `@Controller()` | Handles HTTP requests, returns responses |
| **Provider/Service** | `@Injectable()` | Business logic, DB access |

```ts
@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

---

### 15. What is a Module in NestJS?

**Answer:** A class decorated with `@Module()` — the **organizational unit** of a NestJS app. Every app has at least one root module (`AppModule`).

```ts
@Module({
  imports: [DatabaseModule],     // other modules
  controllers: [UsersController], // HTTP handlers
  providers: [UsersService],      // injectable classes
  exports: [UsersService],         // available to importing modules
})
export class UsersModule {}
```

Module types: **Feature**, **Shared**, **Global** (`@Global()`), **Dynamic** (`.forRoot()`).

---

### 16. What is a Controller in NestJS?

**Answer:** A class decorated with `@Controller()` — handles **incoming HTTP requests** and returns responses. Should be thin — delegate logic to services.

```ts
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll() { return this.usersService.findAll(); }

  @Post()
  create(@Body() dto: CreateUserDto) { return this.usersService.create(dto); }
}
```

---

### 17. What is a Provider/Service in NestJS?

**Answer:** A class decorated with `@Injectable()` — contains **business logic** and can be injected into controllers or other services via DI.

```ts
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  findAll() { return this.userModel.find().exec(); }
  create(dto: CreateUserDto) { return this.userModel.create(dto); }
}
```

Nest creates a **singleton** instance and manages its lifecycle.

---

### 18. What is the difference between Provider and Service?

**Answer:** A **Service** is a **type of Provider**. Provider is the general concept — anything Nest can inject:

| Provider type | Example |
| --- | --- |
| Class (service) | `@Injectable() UsersService` |
| Value | `{ provide: 'APP_NAME', useValue: 'My API' }` |
| Factory | `{ provide: 'DB', useFactory: () => createConnection() }` |
| Existing | `{ provide: 'Alias', useExisting: UsersService }` |

---

### 19. Can you have a provider without `@Injectable()`?

**Answer:** **Yes** — value and factory providers don't need `@Injectable()`. Only **classes with their own dependencies** need it so Nest knows what to inject into them.

```ts
// No @Injectable needed
{ provide: 'CONFIG', useValue: { port: 3000 } }

// @Injectable needed — has dependencies
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private model: Model<User>) {}
}
```

---

### 20. What are custom providers?

**Answer:** Flexible way to provide values beyond standard services:

```ts
// Value provider
{ provide: 'APP_NAME', useValue: 'My API' }

// Factory provider
{
  provide: 'CONNECTION',
  useFactory: (config: ConfigService) => createConnection(config.get('DB_URI')),
  inject: [ConfigService],
}

// Inject with @Inject
constructor(@Inject('APP_NAME') private appName: string) {}
```

---

## Decorators & Routing

### 21. What are decorators in NestJS?

**Answer:** Special functions prefixed with `@` that attach **metadata** to classes, methods, or parameters. Nest reads this metadata at startup to wire up routes, DI, and validation.

Types:
- **Class:** `@Controller()`, `@Module()`, `@Injectable()`
- **Method:** `@Get()`, `@Post()`, `@UseGuards()`
- **Parameter:** `@Body()`, `@Param()`, `@Query()`
- **Custom:** `@Roles('admin')`, `@CurrentUser()`

---

### 22. What is the role of `@Body()` decorator?

**Answer:** Extracts and parses the **request body** — typically mapped to a DTO for validation.

```ts
@Post()
create(@Body() createUserDto: CreateUserDto) {
  return this.usersService.create(createUserDto);
}
```

Works with `ValidationPipe` to auto-validate against DTO rules.

---

### 23. What is the role of `@Param()` decorator?

**Answer:** Extracts **route parameters** from the URL path.

```ts
@Get(':id')
findOne(@Param('id') id: string) {
  return this.usersService.findOne(id);
}
// GET /users/507f1f77bcf86cd799439011
```

Can combine with pipes: `@Param('id', ParseIntPipe) id: number`

---

### 24. What is the role of `@Query()` decorator?

**Answer:** Extracts **query string** parameters.

```ts
@Get()
findAll(@Query('page') page: number, @Query('limit') limit: number) {
  return this.usersService.findAll(page, limit);
}
// GET /users?page=2&limit=10
```

---

### 25. What is the purpose of `@Res()` decorator?

**Answer:** Injects the underlying **Express response object** — you manage the response manually.

```ts
@Get()
findAll(@Res() res: Response) {
  res.status(200).json({ data: [] });
}
```

**Warning:** Using `@Res()` puts Nest in library-specific mode — you must call `res.json()` or `res.send()` yourself, or the request hangs.

---

### 26. What is dynamic routing in NestJS?

**Answer:** Using route parameters in URL paths to handle variable segments:

```ts
@Get(':id')
findOne(@Param('id') id: string) { ... }

@Get(':userId/orders/:orderId')
findOrder(@Param('userId') userId: string, @Param('orderId') orderId: string) { ... }
```

---

## Middleware, Pipes, Guards, Interceptors

### 27. What is middleware in NestJS?

**Answer:** A function called **before** the route handler — similar to Express middleware. Has access to `req`, `res`, and `next()`.

```ts
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.url}`);
    next();
  }
}

// Register in module
configure(consumer: MiddlewareConsumer) {
  consumer.apply(LoggerMiddleware).forRoutes('*');
}
```

Used for logging, cookie parsing, etc. **HTTP only.**

---

### 28. What are Pipes in NestJS?

**Answer:** Classes that **transform or validate** input data before it reaches the route handler. Implement `PipeTransform`.

```ts
// Global validation
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

// Per parameter
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) { ... }
```

**Built-in pipes:** `ValidationPipe`, `ParseIntPipe`, `ParseFloatPipe`, `ParseBoolPipe`, `ParseUUIDPipe`, `ParseEnumPipe`, `DefaultValuePipe`, `ParseFilePipe`.

---

### 29. What are Guards in NestJS?

**Answer:** Classes implementing `CanActivate` — decide whether a request proceeds to the handler. Used for **authentication and authorization**.

```ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Delete(':id')
remove(@Param('id') id: string) { ... }
```

Returns `true` → proceed. Returns `false` or throws → **403 Forbidden**.

---

### 30. What are Interceptors in NestJS?

**Answer:** Classes implementing `NestInterceptor` — wrap route handler execution. Can transform response, add logging, implement caching. Inspired by **AOP (Aspect-Oriented Programming)**.

```ts
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next.handle().pipe(
      tap(() => console.log(`Took ${Date.now() - now}ms`)),
    );
  }
}
```

Works with **HTTP, WebSockets, and microservices** (unlike middleware).

---

### 31. What is the difference between Interceptors and Middleware?

**Answer:**

| | Middleware | Interceptors |
| --- | --- | --- |
| Scope | HTTP only | HTTP, WebSockets, microservices |
| Response transform | No | Yes — can modify response |
| ExecutionContext | No | Yes — access to handler metadata |
| Use case | Logging, cookies | Logging, caching, response transform |

Use **middleware** for simple HTTP pre-processing. Use **interceptors** when you need to transform responses or work across transport types.

---

### 32. What is the request lifecycle order in NestJS?

**Answer:**

```
Incoming Request
  → Middleware
  → Guards
  → Interceptors (before)
  → Pipes
  → Route Handler
  → Interceptors (after)
  → Exception Filters (if error)
  → Response
```

---

### 33. What is ExecutionContext?

**Answer:** A wrapper providing access to the **current request context** — request, response, handler, and class metadata. Used in guards, interceptors, and custom decorators.

```ts
canActivate(context: ExecutionContext): boolean {
  const request = context.switchToHttp().getRequest();
  return !!request.user;
}
```

---

## Dependency Injection

### 34. What is Dependency Injection in NestJS?

**Answer:** A design pattern where classes **receive dependencies via constructor** instead of creating them itself. Nest's IoC container manages creation and injection.

```ts
@Injectable()
export class UsersService { ... }

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {} // ← auto-injected
}
```

**Benefits:** modularity, testability (inject mocks), separation of concerns.

---

### 35. What is the difference between `@Injectable()` and `@Inject()`?

**Answer:**

| Decorator | Purpose |
| --- | --- |
| `@Injectable()` | Marks a **class** as a provider Nest can manage and inject |
| `@Inject('TOKEN')` | Injects a **specific token** — used for value/factory providers |

```ts
// Class injection — no @Inject needed (TypeScript infers type)
constructor(private usersService: UsersService) {}

// Token injection — @Inject required
constructor(@Inject('APP_NAME') private appName: string) {}
```

---

### 36. What is the difference between DI and IoC?

**Answer:**
- **IoC (Inversion of Control)** — general principle: framework controls program flow, not the developer
- **DI (Dependency Injection)** — specific form of IoC: dependencies are passed in rather than created internally

DI is how NestJS implements IoC. Nest's IoC container creates and wires all providers automatically.

---

### 37. What is a circular dependency and how do you fix it?

**Answer:** When class A depends on B, and B depends on A — Nest can't instantiate either.

**Fix with `forwardRef()`:**

```ts
// users.service.ts
constructor(
  @Inject(forwardRef(() => AuthService))
  private authService: AuthService,
) {}

// auth.service.ts
constructor(
  @Inject(forwardRef(() => UsersService))
  private usersService: UsersService,
) {}
```

Alternative: use `ModuleRef` to retrieve provider lazily.

---

### 38. How do you test with Dependency Injection?

**Answer:** Use `@nestjs/testing` to create an isolated testing module with mock providers:

```ts
const module = await Test.createTestingModule({
  providers: [
    UsersService,
    { provide: getModelToken(User.name), useValue: mockModel },
  ],
}).compile();

const service = module.get<UsersService>(UsersService);
```

---

## DTOs, Validation & Errors

### 39. What are DTOs in NestJS?

**Answer:** **Data Transfer Objects** — classes that define the shape of data for requests/responses.

```ts
export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

Used with `ValidationPipe` for automatic validation.

---

### 40. Why use DTOs?

**Answer:**
- **Validation** — reject bad input before it reaches the handler
- **Type safety** — TypeScript catches errors at compile time
- **Documentation** — Swagger auto-generates API docs from DTOs
- **Security** — `whitelist: true` strips unknown fields

---

### 41. How do you handle errors in NestJS?

**Answer:** Throw built-in HTTP exceptions — Nest auto-formats the response:

```ts
throw new NotFoundException('User not found');       // 404
throw new BadRequestException('Invalid email');        // 400
throw new UnauthorizedException('Invalid token');    // 401
throw new ForbiddenException('Access denied');       // 403
throw new ConflictException('Email already exists'); // 409
```

Custom filter:
```ts
@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.status(404).json({ statusCode: 404, message: exception.message });
  }
}
```

---

## Auth, JWT & Security

### 42. What is the difference between Authentication and Authorization?

**Answer:**

| | Authentication | Authorization |
| --- | --- | --- |
| Question | Who are you? | What can you do? |
| HTTP code | **401** Unauthorized | **403** Forbidden |
| How in Nest | Passport strategies + Guards | RolesGuard + `@Roles()` decorator |

---

### 43. How does NestJS support authentication?

**Answer:** Through:
1. **`@nestjs/passport`** — modular auth strategies (local, JWT, OAuth)
2. **`@nestjs/jwt`** — sign, verify, decode JWTs
3. **Guards** — `AuthGuard('jwt')` protects routes
4. **Custom decorators** — `@CurrentUser()` extracts user from request

```ts
@UseGuards(LocalAuthGuard)
@Post('login')
login(@Request() req) { return this.authService.login(req.user); }

@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) { return req.user; }
```

---

### 44. What is the purpose of `@nestjs/jwt`?

**Answer:** Provides JWT functionality — sign, verify, and decode tokens.

```ts
// auth.module.ts
JwtModule.register({ secret: 'secret', signOptions: { expiresIn: '15m' } })

// auth.service.ts
const token = this.jwtService.sign({ id: user.id, role: user.role });
const payload = this.jwtService.verify(token);
```

---

### 45. Why should tokens have an expiration time?

**Answer:** Security — if a token is stolen, the attacker can only use it until expiry. Short-lived access tokens (15m) limit damage. Refresh tokens (7d, stored in DB) allow getting new access tokens without re-login.

```ts
this.jwtService.sign(payload, { expiresIn: '15m' });
```

---

### 46. How do refresh tokens work in NestJS?

**Answer:**
1. On login → issue access token (15m) + refresh token (7d)
2. Store refresh token in DB
3. When access expires → client sends refresh token to `/auth/refresh`
4. Server verifies refresh token in DB → issues new access token
5. On logout → delete refresh token from DB

---

### 47. How do you secure a NestJS application?

**Answer:**
- **Helmet** — secure HTTP headers
- **CORS** — restrict allowed origins
- **ValidationPipe** — validate all input
- **Guards** — JWT auth + role-based access
- **Rate limiting** — `@nestjs/throttler`
- **HTTPS** — encrypt in transit
- **bcrypt** — hash passwords
- **Env variables** — secrets in `.env`, not code

---

## Database Questions

### 48. How does NestJS handle database interactions?

**Answer:** NestJS has **no built-in ORM**. It integrates with libraries via modules:

| Library | Database | Package |
| --- | --- | --- |
| Mongoose | MongoDB | `@nestjs/mongoose` |
| TypeORM | SQL + MongoDB | `@nestjs/typeorm` |
| Sequelize | SQL | `@nestjs/sequelize` |
| Prisma | SQL + MongoDB | `@prisma/client` |

---

### 49. What is `@InjectRepository()`?

**Answer:** TypeORM decorator — injects a **repository** for a specific entity into a service.

```ts
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  findAll() { return this.usersRepo.find(); }
}
```

---

### 50. How do you connect MongoDB in NestJS?

**Answer:** Use `@nestjs/mongoose`:

```ts
// app.module.ts
MongooseModule.forRoot(process.env.MONGO_URI)

// feature module
MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])

// service
constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
```

---

### 51. What are database transactions and why use them?

**Answer:** Transactions ensure **all-or-nothing** DB operations — if one step fails, all changes roll back. Critical for financial operations, order processing, etc.

```ts
await this.dataSource.transaction(async (manager) => {
  await manager.save(order);
  await manager.decrement(Product, { id }, 'stock', qty);
});
```

---

### 52. What are soft deletes?

**Answer:** Instead of removing a row, set a `deletedAt` timestamp. Data stays in DB for recovery and audit.

```ts
@DeleteDateColumn()
deletedAt?: Date;

// TypeORM
await repo.softDelete(id);  // sets deletedAt
await repo.find({ withDeleted: true }); // include soft-deleted
```

---

## Advanced / Techniques

### 53. How do you manage environment variables?

**Answer:** `@nestjs/config` module:

```ts
ConfigModule.forRoot({ isGlobal: true })

// inject anywhere
constructor(private config: ConfigService) {}
this.config.get<string>('MONGO_URI');
```

---

### 54. How do you generate Swagger API documentation?

**Answer:**

```bash
npm install @nestjs/swagger
```

```ts
const config = new DocumentBuilder()
  .setTitle('My API').setVersion('1.0').addBearerAuth().build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

Use `@ApiProperty()`, `@ApiOperation()`, `@ApiTags()` on DTOs and controllers.

---

### 55. How do you handle file uploads?

**Answer:** Use Multer via `@UseInterceptors`:

```ts
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
uploadFile(@UploadedFile() file: Express.Multer.File) {
  return { filename: file.filename, size: file.size };
}
```

---

### 56. How do you implement caching?

**Answer:** `@nestjs/cache-manager`:

```ts
CacheModule.register({ isGlobal: true, ttl: 300000 })

@Inject(CACHE_MANAGER) private cache: Cache
await this.cache.get('key');
await this.cache.set('key', data, 300000);
await this.cache.del('key');
```

Or use `@CacheKey('products')` and `@CacheTTL(300)` decorators.

---

### 57. How do you schedule tasks (cron jobs)?

**Answer:** `@nestjs/schedule`:

```ts
ScheduleModule.forRoot()

@Cron(CronExpression.EVERY_30_SECONDS)
handleCron() { console.log('Every 30 seconds'); }

@Cron('0 0 * * *')  // midnight daily
handleDaily() { ... }
```

---

### 58. How do you implement API versioning?

**Answer:**

```ts
app.enableVersioning({ type: VersioningType.URI });

@Controller({ path: 'users', version: '1' })
export class UsersV1Controller { ... }

@Controller({ path: 'users', version: '2' })
export class UsersV2Controller { ... }
// GET /v1/users  GET /v2/users
```

Types: URI, Header, Media Type, Custom.

---

### 59. How does NestJS handle CORS?

**Answer:** In `main.ts`:

```ts
app.enableCors({
  origin: 'https://frontend.com',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
```

---

### 60. How do you handle async operations in NestJS?

**Answer:** Use `async/await` in controllers and services — Nest handles Promises automatically:

```ts
@Get()
async findAll(): Promise<User[]> {
  return this.usersService.findAll();
}
```

For streams of values, use **RxJS Observables** in interceptors.

---

### 61. What is the NestJS Logger vs console.log?

**Answer:**

| console.log | NestJS Logger |
| --- | --- |
| No log levels | log, error, warn, debug, verbose |
| No context | Shows class name context |
| Not filterable | Filterable by level in production |

```ts
private readonly logger = new Logger(UsersService.name);
this.logger.log('Creating user');
this.logger.error('Failed', err.stack);
```

Use Logger in production; console.log for quick debugging only.

---

### 62. What is serialization in NestJS?

**Answer:** Controlling which fields appear in API responses — hide sensitive data like passwords.

```ts
export class User {
  name: string;
  email: string;
  @Exclude() password: string;
}

app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
// password automatically excluded from all responses
```

---

### 63. What testing frameworks work with NestJS?

**Answer:** **Jest** (default). Nest provides `@nestjs/testing` for unit and e2e tests:

```ts
const module = await Test.createTestingModule({
  controllers: [UsersController],
  providers: [{ provide: UsersService, useValue: mockService }],
}).compile();
```

Also supports Mocha and Jasmine.

---

## Quick Revision

```
NestJS       = TypeScript backend framework (Angular-inspired)
Module       = @Module() — groups features
Controller   = @Controller() — HTTP handlers
Service      = @Injectable() — business logic
Provider     = anything injectable (class, value, factory)
DI           = constructor injection via IoC container
Pipe         = validate/transform input
Guard        = auth gate (CanActivate) → 401/403
Interceptor  = transform response, logging, caching
Middleware   = Express-style pre-handler (HTTP only)
DTO          = data shape + validation
Order        = Middleware → Guard → Interceptor → Pipe → Handler
main.ts      = entry point
forRoot      = DB connection (AppModule)
forFeature   = register models (feature module)
@InjectModel = inject Mongoose model
401          = not authenticated
403          = not authorized
```
