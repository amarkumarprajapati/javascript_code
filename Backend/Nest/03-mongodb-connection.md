# NestJS — MongoDB Connection (Mongoose)

NestJS has no built-in database. For MongoDB, use **`@nestjs/mongoose`** — official integration wrapping Mongoose ODM.

---

## Setup — Step by Step

### 1. Install packages
```bash
npm install @nestjs/mongoose mongoose
npm install -D @types/mongoose   # if using TypeScript
```

### 2. Environment variable
```env
# .env
MONGO_URI=mongodb://localhost:27017/myapp
# or MongoDB Atlas:
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/myapp
```

### 3. Load env with ConfigModule
```bash
npm install @nestjs/config
```

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // load .env globally
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
})
export class AppModule {}
```

**Why `forRootAsync`?** Injects `ConfigService` so URI comes from env — not hardcoded.

**Simple sync version (dev only):**
```ts
MongooseModule.forRoot('mongodb://localhost:27017/myapp')
```

---

## Define Schema & Model

```ts
// users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })  // adds createdAt, updatedAt
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true, select: false })  // hidden by default
  password: string;

  @Prop({ enum: ['user', 'admin'], default: 'user' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
```

---

## Register Schema in Feature Module

```ts
// users/users.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],  // export if other modules need UsersService
})
export class UsersModule {}
```

`forRoot()` = connection (once in AppModule).
`forFeature()` = register models (per feature module).

---

## Inject Model in Service

```ts
// users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = new this.userModel(dto);
    return user.save();
  }

  async findAll(page = 1, limit = 10): Promise<User[]> {
    return this.userModel
      .find()
      .select('-password')
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .select('-password')
      .exec();
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`User #${id} not found`);
  }
}
```

---

## Controller with DTOs

```ts
// users/dto/create-user.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

// users/users.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.usersService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
```

Enable global validation in `main.ts`:
```ts
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
```

---

## Schema Hooks — Hash Password Before Save

```ts
import * as bcrypt from 'bcrypt';

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```

---

## Populate — References Between Collections

```ts
// orders/schemas/order.schema.ts
@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop([String])
  items: string[];

  @Prop({ required: true })
  total: number;
}

// orders/orders.service.ts
async findOne(id: string) {
  return this.orderModel.findById(id).populate('userId', 'name email').exec();
}
```

Register both schemas:
```ts
MongooseModule.forFeature([
  { name: Order.name, schema: OrderSchema },
  { name: User.name, schema: UserSchema },
])
```

---

## Indexes

```ts
UserSchema.index({ email: 1 });
UserSchema.index({ createdAt: -1 });
```

Or in schema:
```ts
@Prop({ index: true })
email: string;
```

---

## Connection Events & Graceful Shutdown

```ts
// database/database.module.ts
import { Module, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URI)],
})
export class DatabaseModule implements OnModuleInit, OnModuleDestroy {
  constructor(@InjectConnection() private connection: Connection) {}

  onModuleInit() {
    this.connection.on('connected', () => console.log('MongoDB connected'));
    this.connection.on('error', (err) => console.error('MongoDB error:', err));
  }

  async onModuleDestroy() {
    await this.connection.close();
  }
}
```

---

## Refresh Token with MongoDB (Auth pattern)

```ts
// auth/schemas/refresh-token.schema.ts
@Schema({ timestamps: true })
export class RefreshToken {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  token: string;

  @Prop({ default: Date.now, expires: 604800 }) // TTL 7 days
  createdAt: Date;
}

// auth/auth.service.ts — on login
await this.refreshTokenModel.create({ userId: user._id, token: refreshToken });

// on logout
await this.refreshTokenModel.deleteMany({ userId });

// on refresh
const stored = await this.refreshTokenModel.findOne({ userId, token });
if (!stored) throw new UnauthorizedException('Revoked');
```

---

## Generate Full Resource with CLI

```bash
nest g resource users
# ? REST API
# ? Yes generate CRUD
# Creates: module, controller, service, DTOs, entities
# Then replace TypeORM entity with Mongoose schema
```

---

## Common Errors & Fixes

| Error | Cause | Fix |
| --- | --- | --- |
| `Cannot resolve dependencies` | Model not registered in module | Add `MongooseModule.forFeature()` |
| `MongoServerError: E11000 duplicate key` | Unique constraint violated | Handle in service, return 409 |
| `Cast to ObjectId failed` | Invalid ID format | Use `ParseMongoIdPipe` or validate |
| Connection timeout | Wrong URI / network | Check MONGO_URI, Atlas IP whitelist |
| `ValidationError` | Schema validation failed | Fix DTO + schema rules |

---

## MongoDB vs SQL in Nest

| | Mongoose (MongoDB) | TypeORM (SQL) |
| --- | --- | --- |
| Package | `@nestjs/mongoose` | `@nestjs/typeorm` |
| Inject | `@InjectModel(User.name)` | `@InjectRepository(User)` |
| Schema | `@Schema()` class | `@Entity()` class |
| Register | `forFeature([{ name, schema }])` | `TypeOrmModule.forFeature([User])` |
| Query | `this.userModel.find()` | `this.userRepo.find()` |
| Relations | `.populate()` | `.relations` / joins |

---

## Interview Q&A

| Question | Answer |
| --- | --- |
| How connect MongoDB to Nest? | `@nestjs/mongoose` → `MongooseModule.forRoot(uri)` in AppModule |
| forRoot vs forFeature? | forRoot = DB connection; forFeature = register models per module |
| How inject model? | `@InjectModel(User.name) private userModel: Model<UserDocument>` |
| How define schema? | `@Schema()` class + `@Prop()` fields + `SchemaFactory.createForClass()` |
| How validate input? | DTOs + `ValidationPipe` globally |
| How hide password? | `@Prop({ select: false })` + `.select('-password')` |
| How hash password? | Mongoose `pre('save')` hook with bcrypt |
| Config from env? | `ConfigModule.forRoot()` + `MongooseModule.forRootAsync()` |
| How populate? | `.populate('userId', 'name email')` on query |
| Refresh token in Mongo? | Separate schema, TTL index, delete on logout |
