import { SetMetadata } from '@nestjs/common';
import { Role } from '../models/Role';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
