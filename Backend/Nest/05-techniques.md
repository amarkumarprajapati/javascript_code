# NestJS — Techniques

Advanced patterns and production techniques for NestJS applications.

---

## 1. Configuration — @nestjs/config

```bash
npm install @nestjs/config
```

```ts
// app.module.ts
ConfigModule.forRoot({
  isGlobal: true,           // available everywhere without importing
  envFilePath: '.env',      // or ['.env.local', '.env']
});

// inject anywhere
@Injectable()
export class AppService {
  constructor(private config: ConfigService) {}

  getDbUri() {
    return this.config.get<string>('MONGO_URI');
  }
}

// typed config factory
// config/database.config.ts
export default registerAs('database', () => ({
  uri: process.env.MONGO_URI,
  dbName: process.env.DB_NAME,
}));

// app.module.ts
ConfigModule.forRoot({ load: [databaseConfig] })
// access: config.get('database.uri')
```

---

## 2. Authentication — JWT + Passport

```bash
npm install @nestjs/passport @nestjs/jwt passport passport-jwt passport-local bcrypt
npm install -D @types/passport-jwt @types/passport-local
```

### Auth Module setup
```ts
// auth/auth.module.ts
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
```

### Local strategy (login)
```ts
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return user;
  }
}
```

### JWT strategy (protected routes)
```ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { id: string; role: string }) {
    return { id: payload.id, role: payload.role };
  }
}
```

### Auth controller
```ts
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@CurrentUser('id') userId: string) {
    return this.authService.logout(userId);
  }
}
```

---

## 3. Swagger — API Documentation

```bash
npm install @nestjs/swagger
```

```ts
// main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('My API')
  .setDescription('API documentation')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
// Visit: http://localhost:3000/api/docs
```

```ts
// DTO with Swagger decorators
export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;
}

// Controller
@ApiTags('users')
@Controller('users')
export class UsersController {
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Post()
  create(@Body() dto: CreateUserDto) { ... }
}
```

---

## 4. File Uploads — Multer

```bash
npm install @nestjs/platform-express
# multer is included with @nestjs/platform-express
```

```ts
@Post('upload')
@UseInterceptors(FileInterceptor('file', {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const unique = Date.now() + extname(file.originalname);
      cb(null, unique);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
      return cb(new BadRequestException('Invalid file type'), false);
    }
    cb(null, true);
  },
}))
uploadFile(@UploadedFile() file: Express.Multer.File) {
  return { filename: file.filename, size: file.size };
}

// Multiple files
@Post('upload-many')
@UseInterceptors(FilesInterceptor('files', 5))
uploadMany(@UploadedFiles() files: Express.Multer.File[]) {
  return files.map(f => f.filename);
}
```

---

## 5. Caching

```bash
npm install @nestjs/cache-manager cache-manager
```

```ts
// app.module.ts
CacheModule.register({ isGlobal: true, ttl: 300000 }) // 5 min TTL

// service
@Injectable()
export class ProductsService {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll() {
    const cached = await this.cache.get('products');
    if (cached) return cached;

    const products = await this.productModel.find().exec();
    await this.cache.set('products', products, 300000);
    return products;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.productModel.findByIdAndUpdate(id, dto, { new: true });
    await this.cache.del('products'); // invalidate cache
    return product;
  }
}

// Decorator approach
@Get()
@CacheKey('products')
@CacheTTL(300)
findAll() { ... }
```

---

## 6. Task Scheduling — Cron Jobs

```bash
npm install @nestjs/schedule
```

```ts
// app.module.ts
ScheduleModule.forRoot()

// tasks/tasks.service.ts
@Injectable()
export class TasksService {
  @Cron(CronExpression.EVERY_30_SECONDS)
  handleCron() {
    console.log('Runs every 30 seconds');
  }

  @Cron('0 0 * * *')  // midnight daily
  handleDailyCleanup() {
    console.log('Daily cleanup');
  }

  @Interval(10000)  // every 10 seconds
  handleInterval() {
    console.log('Interval task');
  }

  @Timeout(5000)  // once after 5 seconds on startup
  handleTimeout() {
    console.log('Timeout task');
  }
}
```

---

## 7. Rate Limiting

```bash
npm install @nestjs/throttler
```

```ts
// app.module.ts
ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]) // 100 req/min

// global guard
{ provide: APP_GUARD, useClass: ThrottlerGuard }

// per route
@Throttle({ default: { limit: 5, ttl: 60000 } })
@Post('login')
login() { ... }
```

---

## 8. API Versioning

```ts
// main.ts
app.enableVersioning({
  type: VersioningType.URI,  // /v1/users, /v2/users
});

// controller
@Controller({ path: 'users', version: '1' })
export class UsersV1Controller { ... }

@Controller({ path: 'users', version: '2' })
export class UsersV2Controller { ... }

// or per route
@Version('1')
@Get()
findAllV1() { ... }
```

| Type | How version is sent |
| --- | --- |
| URI | `/v1/users` (default) |
| Header | `Custom-Header: 1` |
| Media Type | `Accept: application/json; version=1` |
| Custom | Your own extraction function |

---

## 9. Serialization — Hide Sensitive Fields

```bash
npm install class-transformer
```

```ts
// user entity
export class User {
  id: string;
  name: string;
  email: string;

  @Exclude()
  password: string;
}

// main.ts
app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

// controller returns User instance — password auto-excluded
@Get(':id')
async findOne(@Param('id') id: string) {
  const user = await this.usersService.findOne(id);
  return user; // password not in response
}
```

---

## 10. WebSockets

```bash
npm install @nestjs/websockets @nestjs/platform-socket.io
```

```ts
@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    this.server.emit('message', { text: data, from: client.id });
    return { event: 'message', data: 'sent' };
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.join(room);
  }
}
```

---

## 11. Microservices

```bash
npm install @nestjs/microservices
```

```ts
// main.ts — hybrid app (HTTP + microservice)
const app = await NestFactory.create(AppModule);
app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.TCP,
  options: { host: 'localhost', port: 8877 },
});
await app.startAllMicroservices();
await app.listen(3000);

// message pattern handler
@Controller()
export class MathController {
  @MessagePattern({ cmd: 'sum' })
  sum(@Payload() data: number[]) {
    return data.reduce((a, b) => a + b, 0);
  }
}
```

Transports: TCP, Redis, NATS, MQTT, Kafka, gRPC.

---

## 12. Database Transactions (TypeORM)

```ts
@Injectable()
export class OrdersService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async createOrder(userId: string, items: OrderItem[]) {
    return this.dataSource.transaction(async (manager) => {
      const order = manager.create(Order, { userId, items });
      await manager.save(order);

      for (const item of items) {
        await manager.decrement(Product, { id: item.productId }, 'stock', item.qty);
      }
      return order;
    }); // auto rollback if any step fails
  }
}
```

---

## 13. Event-Driven — EventEmitter

```bash
npm install @nestjs/event-emitter
```

```ts
// app.module.ts
EventEmitterModule.forRoot()

// emit event
@Injectable()
export class OrdersService {
  constructor(private eventEmitter: EventEmitter2) {}

  async create(dto: CreateOrderDto) {
    const order = await this.orderModel.create(dto);
    this.eventEmitter.emit('order.created', order);
    return order;
  }
}

// listen
@Injectable()
export class OrderListener {
  @OnEvent('order.created')
  handleOrderCreated(order: Order) {
    console.log('New order:', order.id);
    // send email, update inventory, etc.
  }
}
```

---

## 14. Health Checks

```bash
npm install @nestjs/terminus
```

```ts
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mongoose: MongooseHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.mongoose.pingCheck('mongodb'),
    ]);
  }
}
// GET /health → { status: 'ok', info: { mongodb: { status: 'up' } } }
```

---

## 15. Logging

```ts
// use NestJS built-in logger
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  async create(dto: CreateUserDto) {
    this.logger.log(`Creating user: ${dto.email}`);
    try {
      return await this.userModel.create(dto);
    } catch (err) {
      this.logger.error(`Failed to create user: ${err.message}`, err.stack);
      throw err;
    }
  }
}
```

---

## 16. Testing

```ts
// users.service.spec.ts
describe('UsersService', () => {
  let service: UsersService;
  let model: Model<UserDocument>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get(getModelToken(User.name));
  });

  it('should find all users', async () => {
    jest.spyOn(model, 'find').mockReturnValue({ exec: () => [{ name: 'John' }] } as any);
    expect(await service.findAll()).toEqual([{ name: 'John' }]);
  });
});
```

---

## 17. Docker Deployment

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
```

```yaml
# docker-compose.yml
services:
  app:
    build: .
    ports: ['3000:3000']
    environment:
      MONGO_URI: mongodb://db:27017/myapp
    depends_on: [db]
  db:
    image: mongo:7
    ports: ['27017:27017']
    volumes: ['mongo-data:/data/db']
volumes:
  mongo-data:
```

---

## Techniques Checklist

| Technique | Package | Use case |
| --- | --- | --- |
| Config | `@nestjs/config` | Environment variables |
| Auth | `@nestjs/passport`, `@nestjs/jwt` | Login, JWT, guards |
| Swagger | `@nestjs/swagger` | API docs |
| File upload | Multer (built-in) | Upload images/files |
| Caching | `@nestjs/cache-manager` | Speed up reads |
| Scheduling | `@nestjs/schedule` | Cron jobs |
| Rate limiting | `@nestjs/throttler` | Prevent abuse |
| Versioning | Built-in | API v1, v2 |
| WebSockets | `@nestjs/websockets` | Real-time |
| Microservices | `@nestjs/microservices` | Service-to-service |
| Events | `@nestjs/event-emitter` | Decouple side effects |
| Health checks | `@nestjs/terminus` | K8s/Docker readiness |
| Serialization | `class-transformer` | Hide sensitive fields |
| Testing | `@nestjs/testing` | Unit + e2e tests |

---

## Interview Q&A

| Question | Answer |
| --- | --- |
| How configure env in Nest? | `ConfigModule.forRoot({ isGlobal: true })` + `ConfigService` |
| How implement JWT auth? | `@nestjs/jwt` + Passport JWT strategy + `AuthGuard('jwt')` |
| How document API? | `@nestjs/swagger` — DocumentBuilder + `@ApiProperty()` |
| How upload files? | `@UseInterceptors(FileInterceptor('file'))` + `@UploadedFile()` |
| How cache responses? | `CacheModule` + `@Inject(CACHE_MANAGER)` or `@CacheKey()` |
| How schedule cron jobs? | `@nestjs/schedule` — `@Cron()` decorator |
| How rate limit? | `@nestjs/throttler` — `ThrottlerGuard` |
| How version APIs? | `app.enableVersioning({ type: VersioningType.URI })` |
| How hide password in response? | `@Exclude()` + `ClassSerializerInterceptor` |
| How test services? | `Test.createTestingModule()` with mock providers |
| How run microservices? | `@MessagePattern()` + `app.connectMicroservice()` |
| How health check? | `@nestjs/terminus` — `@HealthCheck()` endpoint |
