import { Injectable, NotFoundException } from '@nestjs/common';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserSignInDto } from './dto/user-signin.dto';
import { Roles } from 'src/utility/common/user-roles.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}
  async signup(
  userSignUpDto: UserSignUpDto,
): Promise<{ data: UserEntity; accessToken: string }> {
  const userExists = await this.usersRepository.findOneBy({
    email: userSignUpDto.email,
  });

  if (userExists) {
    throw new NotFoundException('Email Already Exist');
  }

  const hashedPassword = await bcrypt.hash(userSignUpDto.password, 10);

  const newUser = this.usersRepository.create({
    name: userSignUpDto.name,
    email: userSignUpDto.email,
    password: hashedPassword,
    roles: [Roles.USER],
  });

  const user = await this.usersRepository.save(newUser);

  const payload = {
    id: user._id.toString(),
    email: user.email,
  };

  const accessToken = this.jwtService.sign(payload);

  return {
    data: user, // keep as UserEntity instance — do NOT destructure/spread this
    accessToken,
  };
}

  async signin(
    userSignInDto: UserSignInDto,
  ): Promise<{ data: UserEntity; accessToken: string }> {
    const { email, password } = userSignInDto;

    // That select option is telling TypeORM: "only fetch these specific columns from the database, ignore the rest of the entity's fields."
    // This pattern usually shows up in login/auth flows, and there's a specific reason: if password has @Exclude() or select: false set on the entity itself, TypeORM will not return the password column by default on normal queries — which is great for safety everywhere else in your app, but it's a problem specifically in your login logic, because you need the actual hashed password value to compare against what the user typed in (via bcrypt.compare).
   // So this explicit select: [...] is a way of saying: "I know password is normally hidden, but for this one query, I specifically need it back so I can verify the login."


     const user = await this.usersRepository.findOne({
      where: { email: email },
      select: { _id: true, email: true, password: true, name: true },
    });

    
    if (!user) {
      throw new NotFoundException('Email is not exists');
    }

    const hashPassword = user.password;
    const isMatch = await bcrypt.compare(password, hashPassword);
    if (!isMatch) {
      throw new NotFoundException('Some thing wrong');
    }


     // Create Token By PayLoad
    const payload = {
      id: user._id,
      email: user.email,
    };
    const accessToken = this.jwtService.sign(payload);
    
    return {
      data: user,
      accessToken: accessToken,
    };
  }
}
