// src/common/middleware/url-validation.middleware.ts

import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UrlValidationService } from '../services/url-validation.service';

@Injectable()
export class UrlValidationMiddleware implements NestMiddleware {
  constructor(
    private readonly urlValidationService: UrlValidationService,
  ) {}

  use(req: Request, _: Response, next: NextFunction) {
    const urlToCheck = req.body.url || req.query.url;

    if (!urlToCheck) {
      return next();
    }

    if (typeof urlToCheck !== 'string' || !this.urlValidationService.isValidUrl(urlToCheck)) {
      throw new BadRequestException('invalid_url');
    }

    next();
  }
}
