1. nest generate resource auth --no-spec
2. npm i @nestjs/jwt
3. Omit<UserEntity, 'password'>
This is the interesting part. Omit<T, K> is a built-in TypeScript utility type that takes an existing type T and produces a new type with the keys listed in K removed.


So Omit<UserEntity, 'password'> means: "take the UserEntity type (probably your database/user model, which includes a password field), and create a version of it without the password field.



4. @Exclude() is a sticky note on the password field that says "never show this to the outside world, no matter what."



5. That select option is telling TypeORM: "only fetch these specific columns from the database, ignore the rest of the entity's fields."
This pattern usually shows up in login/auth flows, and there's a specific reason: if password has @Exclude() or select: false set on the entity itself, TypeORM will not return the password column by default on normal queries — which is great for safety everywhere else in your app, but it's a problem specifically in your login logic, because you need the actual hashed password value to compare against what the user typed in (via bcrypt.compare).
So this explicit select: [...] is a way of saying: "I know password is normally hidden, but for this one query, I specifically need it back so I can verify the login."



DTO-entity-Controller-service



# Users → Orders (One-to-Many): This means one user can write many reviews, but each review is written by only one user.
# Users → Reviews (One-to-Many): This means one product can appear in many orders, and one order can contain many products.
# Products → Orders (Many-to-Many): This means one product can have many reviews, but each review belongs to only one product.
# Products → Reviews (One-to-Many): This means many products can belong to one category, while each product belongs to one category.
# Products → Categories (Many-to-One): This means many products can belong to one category, but each product belongs to one category.

# API Documentation

Base URL: `http://localhost:3000/api/v1` (global prefix set in `src/main.ts`; port from `PORT` env var).

All request bodies are validated with a global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })` — any field not listed in a DTO below will cause a `400 Bad Request`, not be silently ignored.

Auth: send `Authorization: Bearer <accessToken>` on any route marked 🔒. The token is obtained from `/auth/signup` or `/auth/signin`. 🔒🔑 routes additionally require the `admin` role.

---

## Auth (`/auth`)

### POST /auth/signup
Creates a user with role `user` and returns a JWT.

Payload (`UserSignUpDto`):
```json
{
  "name": "Jane Doe",        // string, required, 3–30 chars
  "email": "jane@doe.com",   // string, required, valid email
  "password": "secret123"    // string, required, min 5 chars
}
```
Response `201`:
```json
{
  "data": { "_id": "...", "email": "jane@doe.com", "name": "Jane Doe", "roles": ["user"], "createdAt": "..." },
  "accessToken": "<jwt>"
}
```
`password` is stripped from `data` (entity field is `@Exclude()`d). Errors: `404` if the email is already registered (`Email Already Exist`).

### POST /auth/signin
Payload (`UserSignInDto`):
```json
{
  "email": "jane@doe.com",   // string, required, valid email
  "password": "secret123"    // string, required, min 5 chars
}
```
Response `201`: same shape as signup (`{ data, accessToken }`). Errors: `404` if the email doesn't exist or the password doesn't match.

---

## Categories (`/categories`)

### POST /categories 🔒🔑 (admin)
Payload (`CreateCategoryDto`):
```json
{
  "title": "Electronics",                                   // string, required, min 5 chars
  "description": "Phones, laptops, and other electronics"   // string, required, min 20 chars
}
```
Response `201`: `{ "status": "Success", "statusCode": 201, "data": <CategoryEntity> }`. `addedBy` is set to the current user server-side.

### GET /categories
Public. Response `200`: `{ "count": <number>, "statusCode": 200, "data": [<CategoryEntity with addedBy: { _id, name, email }>, ...] }`.

### GET /categories/:categoryId 🔒
Response `200`: `{ "status": "Success", "statusCode": 200, "data": <CategoryEntity> }`. `404` if not found.

### PATCH /categories/:id
Payload (`UpdateCategoryDto` — all fields of `CreateCategoryDto`, optional):
```json
{
  "title": "New title",
  "description": "New description of at least twenty characters"
}
```
Response `200`: `{ "status": "Success", "statusCode": 200, "data": <CategoryEntity> }`. `404` if not found.
> Note: unlike `POST`/`GET :id`, this route currently has no `@UseGuards` applied in `categories.controller.ts`, despite mutating data — worth confirming that's intentional before relying on it.

### DELETE /categories/:id
Response `200`: `{ "statusCode": 200, "status": "Success", "message": "Category deleted successfully" }`. `404` if not found.
> Note: also has no guards applied currently.

---

## Products (`/products`)

### POST /products 🔒🔑 (admin)
Payload (`CreateProductDto`):
```json
{
  "title": "Wireless Mouse",              // string, required
  "description": "2.4GHz wireless mouse", // string, required
  "price": 19.99,                          // number, required, positive, max 2 decimal places
  "stock": 100,                            // number, required, >= 0
  "images": ["https://.../img1.jpg"],      // string[], required
  "categoryId": "<category _id>"           // string, required
}
```
> Implementation note: `ProductsService.create` is currently a stub — it returns `{ status: "success", statusCode: 201, data: {} }` without persisting anything or using `categoryId`/`currentUser`. Validation and auth on this route are real; the persistence logic is not implemented yet.

No `GET`, `PATCH`, or `DELETE` routes are wired up in `products.controller.ts` yet, though `UpdateProductDto` already exists for when they are.

---

## User (`/user`)

`UserController` exposes the full CRUD shape (`POST`, `GET`, `GET /:id`, `PATCH /:id`, `DELETE /:id`), but it is a scaffold: `CreateUserDto`/`UpdateUserDto` have no fields, there are no guards, and `UserService` methods return placeholder strings instead of touching the database. Treat this module as not yet implemented — use `/auth/signup` to create users today.

