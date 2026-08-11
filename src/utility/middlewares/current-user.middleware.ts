import { Injectable, NestMiddleware } from '@nestjs/common';
import { isArray } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { UserEntity } from 'src/user/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserEntity;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (
      !authHeader ||
      isArray(authHeader) ||
      !authHeader.startsWith('Bearer ')
    ) {
      req.currentUser = undefined;
      next();
      return;
    } else {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.decode(token);
        if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
          throw new Error('Invalid token payload');
        }

        const userId = decoded.id;
        const currentUser = await this.usersRepository.findOneBy({
          _id: new ObjectId(userId),
        });
        req.currentUser = currentUser ?? undefined;
        next();
      } catch (error) {
        req.currentUser = undefined;
        next();
      }
    }
  }
}
