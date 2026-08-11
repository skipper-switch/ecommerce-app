import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UserSignUpDto {
  @IsNotEmpty({message: "Name is required"})
  @IsString({message: "Name must be string"})
  @MinLength(3, {message: "Name must be at least 3 characters"})
  @MaxLength(30, {message: "Name must be at most 30 characters"})
  name!: string;

  @IsNotEmpty({message: "Email is required"})
  @IsEmail({}, {message: "Please provide a valid email"})
  email!: string;

  @IsNotEmpty({message: "Password is required"})
  @MinLength(5, {message: "Password must be at least 5 characters"})
  password!: string;
}