# NestJS — Fundamentals

Core building blocks every NestJS developer must know.

---

## 1. Modules

The **organizational unit** of a NestJS app. Every app has at least one root module.

```ts
@Module({
  imports: [],       // other modules this module needs
  controllers: [],   // HTTP route handlers
  providers: [],     // services, repositories, factories
  exports: [],       // providers available to modules that import this one
})
export class FeatureModule {}
```

| Module type | Decorator / Pattern | When to use |
| --- | --- | --- |
| **Feature** | Standard `@Module()` | Group one domain (users, orders) |
| **Shared** | `exports: [Service]` | Reuse service across modules |
| **Global** | `@Global()` | Config, DB — available everywhere |
| **Dynamic** | `.forRoot()` / `.register()` | Pass config at import time |

```ts
// Shared module pattern
@Module({
  providers: [UsersService],
  exports: [UsersService],  // ← other modules can use UsersService
})
export class UsersModule {}

// Import in another module
@Module({ imports: [UsersModule] })
export class OrdersModule {}  // can inject UsersService
```

---

## 2. Controllers

Handle **incoming HTTP requests** and return responses. Thin layer — delegate logic to services.

```ts
@Controller('users')           // base route: /users
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()                        // GET /users
  findAll() { return this.usersService.findAll(); }

  @Get(':id')                   // GET /users/:id
  findOne(@Param('id') id: string) { return this.usersService.findOne(id); }

  @Post()                       // POST /users
  create(@Body() dto: CreateUserDto) { return this.usersService.create(dto); }

  @Patch(':id')                 // PATCH /users/:id (partial update)
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Put(':id')                   // PUT /users/:id (full replace)
  replace(@Param('id') id: string, @Body() dto: CreateUserDto) { ... }

  @Delete(':id')                // DELETE /users/:id
  remove(@Param('id') id: string) { return this.usersService.remove(id); }
}
```

### Parameter decorators

| Decorator | Source | Example |
| --- | --- | --- |
| `@Param('id')` | URL path `/users/:id` | `"507f1f77bcf86cd799439011"` |
| `@Query('page')` | Query string `?page=2` | `"2"` |
| `@Body()` | Request body JSON | `{ name: "John" }` |
| `@Headers('authorization')` | Request header | `"Bearer eyJ..."` |
| `@Req()` | Full Express request | `req.user`, `req.ip` |
| `@Ip()` | Client IP | `"192.168.1.1"` |

### HTTP status codes
```ts
@Post()
@HttpCode(201)
create(@Body() dto: CreateUserDto) { ... }

@Delete(':id')
@HttpCode(204)
remove(@Param('id') id: string) { ... }
```

---

## 3. Providers & Services

**Providers** = anything Nest can inject. **Services** = the most common provider type.

```ts
@Injectable()
export class UsersService {
  private users = [];

  findAll() { return this.users; }
  findOne(id: string) { return this.users.find(u => u.id === id); }
  create(dto: CreateUserDto) { ... }
}
```

Register in module:
```ts
@Module({
  providers: [UsersService],  // Nest creates singleton instance
  exports: [UsersService],
})
```

### Custom providers

```ts
// Value provider
{ provide: 'APP_NAME', useValue: 'My API' }

// Factory provider
{
  provide: 'CONNECTION',
  useFactory: (config: ConfigService) => createConnection(config.get('DB_URI')),
  inject: [ConfigService],
}

// Class provider (alias)
{ provide: 'AliasedService', useClass: UsersService }

// Inject custom token
constructor(@Inject('APP_NAME') private appName: string) {}
```

---

## 4. Dependency Injection

Classes receive dependencies via **constructor** — Nest's IoC container manages lifecycle.

```ts
@Injectable()
export class OrdersService {
  constructor(
    private usersService: UsersService,   // class provider — auto-resolved
    @Inject('APP_NAME') private appName: string,  // token provider
  ) {}
}
```

**Benefits:**
- **Testability** — inject mocks in tests
- **Modularity** — swap implementations via providers
- **Single responsibility** — each class focuses on its job

### Circular dependency fix
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

---

## 5. DTOs (Data Transfer Objects)

Define the **shape and validation rules** for incoming/outgoing data.

```ts
import { IsString, IsEmail, IsOptional, MinLength, IsEnum } from 'class-validator';

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

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
```

Enable globally:
```ts
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,              // strip fields not in DTO
  forbidNonWhitelisted: true,     // error on extra fields
  transform: true,              // auto-convert types (string "5" → number 5)
}));
```

---

## 6. Pipes

Transform or validate data **before** it reaches the handler.

```ts
// Built-in pipes
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) { ... }

@Get()
find(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number) { ... }

// Custom pipe
@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string) {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Invalid ID');
    }
    return value;
  }
}
```

| Built-in Pipe | Does |
| --- | --- |
| `ValidationPipe` | Validates DTO with class-validator |
| `ParseIntPipe` | String → integer |
| `ParseFloatPipe` | String → float |
| `ParseBoolPipe` | String → boolean |
| `ParseUUIDPipe` | Validates UUID format |
| `ParseEnumPipe` | Validates enum value |
| `DefaultValuePipe` | Default if undefined/null |
| `ParseFilePipe` | Validates uploaded file |

---

## 7. Guards

Decide if a request proceeds to the handler. Used for **authentication and authorization**.

```ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) return true;
    const { user } = context.switchToHttp().getRequest();
    return roles.some(role => user.role === role);
  }
}

// Custom decorator for roles
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// Usage
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Delete(':id')
remove(@Param('id') id: string) { ... }
```

Returns `true` → proceed. Returns `false` or throws → 403 Forbidden.

---

## 8. Interceptors

Wrap route handler — transform response, add logging, caching. Inspired by **AOP**.

```ts
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest();
    console.log(`→ ${req.method} ${req.url}`);

    return next.handle().pipe(
      tap(() => console.log(`← ${req.method} ${req.url} ${Date.now() - now}ms`)),
    );
  }
}

// Apply globally
app.useGlobalInterceptors(new LoggingInterceptor());
// Or per route
@UseInterceptors(LoggingInterceptor)
```

---

## 9. Middleware

Express-style functions — run before route handler. HTTP only.

```ts
// functional middleware
export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`${req.method} ${req.url}`);
  next();
}

// class middleware
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.url}`);
    next();
  }
}

// register in module
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    // or .forRoutes({ path: 'users', method: RequestMethod.GET })
  }
}
```

---

## 10. Exception Filters

Catch exceptions and format error responses.

```ts
// Built-in — use directly
throw new NotFoundException('User not found');
throw new BadRequestException(['email must be valid']);
throw new UnauthorizedException();
throw new ForbiddenException();
throw new ConflictException('Email already exists');

// Custom filter
@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response.status(404).json({
      statusCode: 404,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

---

## 11. Custom Decorators

```ts
// @CurrentUser() — extract user from request
export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);

// Usage
@Get('profile')
getProfile(@CurrentUser() user: UserPayload) {
  return user;
}

@Get('profile/email')
getEmail(@CurrentUser('email') email: string) {
  return { email };
}
```

---

## Execution Order Summary

```
Request
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

## Quick Reference

```
@Module()       → organize app into features
@Controller()   → HTTP route handlers
@Injectable()   → mark as injectable provider
@Get/@Post()    → HTTP method decorators
@Body()         → request body
@Param()        → route parameter
@Query()        → query string
@UseGuards()    → apply auth guard
@UseInterceptors() → apply interceptor
@UsePipes()     → apply pipe
ValidationPipe  → validate DTOs globally
CanActivate     → guard interface
NestInterceptor → interceptor interface
PipeTransform   → pipe interface
ExceptionFilter → filter interface
```
