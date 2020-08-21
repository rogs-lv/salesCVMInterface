import { Role } from './rol';

export class Usuario {
    idUser: string;
    nameUser: string;
    password: string;
    rol: Role;
    toke?: string;
}