# NestJS — How It Works

---

## Big Picture

NestJS is a **structured layer on top of Express (or Fastify)**. It doesn't replace Node — it organizes your code using **modules, dependency injection, and decorators** so large apps stay maintainable.

```
Client HTTP Request
        ↓
Express/Fastify (underlying engine)
        ↓
NestJS Middleware
        ↓
Guards (auth check)
        ↓
Interceptors (before)
        ↓
Pipes (validate/transform input)
        ↓
Controller → Service → Database
        ↓
Interceptors (after — transform response)
        ↓
Exception Filters (if error)
        ↓
HTTP Response
```

---

## Bootstrapping — How App Starts

**Entry file: `main.ts`**

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // creates IoC container
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
```

What happens:
1. `NestFactory.create(AppModule)` — reads `@Module()` metadata, registers all providers in the **IoC container**
2. Resolves dependency tree — creates instances, injects via constructors
3. Binds controllers to HTTP routes on Express/Fastify
4. `app.listen(3000)` — starts the HTTP server

---

## IoC Container & Dependency Injection

Nest manages object creation. You declare **what** you need; Nest provides **how**.

```ts
// users.service.ts
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll() {
    return this.userModel.find().exec();
  }
}

// users.controller.ts
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {} // ← injected automatically

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}

// users.module.ts
@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

**Flow:** AppModule imports UsersModule → Nest creates UsersService → injects into UsersController → controller handles routes.

---

## Module System — App Structure

```
AppModule (root)
├── ConfigModule          (global config)
├── DatabaseModule        (MongoDB connection)
├── AuthModule            (login, JWT, guards)
├── UsersModule           (feature)
│   ├── UsersController
│   ├── UsersService
│   └── UserSchema
└── ProductsModule        (feature)
    ├── ProductsController
    └── ProductsService
```

### Module types

| Type | Purpose | Example |
| --- | --- | --- |
| **Feature** | One domain/feature | `UsersModule`, `OrdersModule` |
| **Shared** | Export providers for reuse | `exports: [UsersService]` |
| **Global** | Available everywhere without import | `@Global()` on `DatabaseModule` |
| **Dynamic** | Configurable at runtime | `ConfigModule.forRoot()`, `MongooseModule.forRoot()` |

```ts
@Module({
  imports: [UsersModule],       // other modules
  controllers: [AppController], // HTTP handlers
  providers: [AppService],      // injectable classes
  exports: [AppService],        // make available to importing modules
})
export class AppModule {}
```

---

## Request Lifecycle — Step by Step

```
1. INCOMING REQUEST
   GET /api/v1/users/5?page=1

2. MIDDLEWARE (optional)
   LoggerMiddleware → logs request, calls next()

3. GUARDS
   JwtAuthGuard → verifies token → req.user = { id: 5, role: 'admin' }
   RolesGuard → checks @Roles('admin') → allow/deny

4. INTERCEPTORS (before)
   LoggingInterceptor → starts timer

5. PIPES
   ParseIntPipe on :id → "5" becomes 5
   ValidationPipe on @Body() → validates DTO fields

6. ROUTE HANDLER
   UsersController.findOne(5) → UsersService.findOne(5) → MongoDB query

7. INTERCEPTORS (after)
   TransformInterceptor → wraps response as { data: ..., statusCode: 200 }
   LoggingInterceptor → logs duration

8. EXCEPTION FILTER (if error thrown)
   HttpExceptionFilter → { statusCode: 404, message: 'Not found' }

9. RESPONSE SENT
   200 { data: { id: 5, name: 'John' }, statusCode: 200 }
```

---

## Decorators — How Nest Knows What to Do

Decorators attach **metadata** that Nest reads at startup via TypeScript reflection.

```ts
@Controller('users')          // class: this handles /users routes
export class UsersController {

  @Get(':id')                  // method: GET /users/:id
  @UseGuards(JwtAuthGuard)     // method: require auth
  @Roles('admin')              // custom: require admin role
  findOne(
    @Param('id', ParseIntPipe) id: number,  // param: extract + validate id
    @Query('fields') fields: string,         // query: ?fields=name,email
  ) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {  // body: validate against DTO
    return this.usersService.create(createUserDto);
  }
}
```

---

## Pipes — Input Validation & Transformation

Run **after guards, before handler**. Transform or reject bad input.

```ts
// Global — in main.ts
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,        // strip unknown properties
  forbidNonWhitelisted: true, // throw on unknown properties
  transform: true,        // auto-transform types
}));

// DTO with validation rules
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

---

## Guards — Authentication & Authorization

```ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;
    const { user } = context.switchToHttp().getRequest();
    return roles.includes(user.role);
  }
}

// Usage
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Delete(':id')
remove(@Param('id') id: string) { ... }
```

---

## Interceptors — Response Transformation

```ts
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({ data, statusCode: context.switchToHttp().getResponse().statusCode })),
    );
  }
}
```

---

## Exception Filters — Error Handling

```ts
// Built-in exceptions
throw new NotFoundException('User not found');       // 404
throw new BadRequestException('Invalid email');      // 400
throw new UnauthorizedException('Invalid token');    // 401
throw new ForbiddenException('Access denied');       // 403

// Global filter
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception instanceof HttpException
      ? exception.getStatus() : 500;

    response.status(status).json({
      statusCode: status,
      message: exception instanceof HttpException
        ? exception.message : 'Internal server error',
    });
  }
}
```

---

## NestJS vs Express — Mental Model

| Express | NestJS equivalent |
| --- | --- |
| `app.get('/users', fn)` | `@Get()` in `@Controller('users')` |
| `app.use(middleware)` | Middleware class or functional middleware |
| Manual require/inject | DI container — constructor injection |
| No structure enforced | Modules enforce separation |
| `try/catch` everywhere | Exception filters + pipes |
| Manual validation | ValidationPipe + class-validator DTOs |
| Manual auth middleware | Guards + Passport strategies |

---

## Project Structure (Production)

```
src/
├── main.ts                 # bootstrap
├── app.module.ts           # root module
├── config/
│   └── configuration.ts    # env config
├── common/
│   ├── guards/             # JwtAuthGuard, RolesGuard
│   ├── interceptors/       # Logging, Transform
│   ├── filters/            # Exception filters
│   ├── pipes/              # Custom pipes
│   └── decorators/         # @Roles(), @CurrentUser()
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── strategies/         # jwt.strategy.ts, local.strategy.ts
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── schemas/user.schema.ts
│   └── dto/
│       ├── create-user.dto.ts
│       └── update-user.dto.ts
└── products/
    └── ...
```

---

## CLI Commands

```bash
nest new my-app                    # create project
nest g module users                # generate module
nest g controller users            # generate controller
nest g service users               # generate service
nest g resource users              # full CRUD (module + controller + service + DTOs)
nest g guard auth                  # generate guard
nest g interceptor logging         # generate interceptor
nest g filter http-exception       # generate exception filter
nest start --watch                 # dev mode with hot reload
nest build                         # compile to dist/
```
