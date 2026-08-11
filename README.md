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