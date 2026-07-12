import { Role } from "./common/types";

export enum TokenType {
  INVITE = 'invite',
  RECOVERY = 'recovery',
}

export interface UserPayload {
  fullName: string;
  username: string;
  userId: number;
  role: Role;
  roleId?: number;
  organisationId: number;
  subId: number;
  permissions?: string[];
}

export interface LoggedInUser {
  fullName: string;
  username: string;
  userId: number;
  role: Role;
  roleId?: number;
  organisationId: number;
  subId: number;
  permissions?: string[];
}

