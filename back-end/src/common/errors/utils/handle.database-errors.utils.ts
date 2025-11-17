import { DatabaseError } from "../types/databaseError";
import { PrismaClientError } from "../types/prismaClientError";
import { UniqueConstraintError } from "../types/uniqueConstraintError";


enum PrismaErrors {
    UniqueConstraintFail = 'P2002'
}

export const handleDatabaseErrors = (e: PrismaClientError): Error => {
    switch (e.code) {
        case PrismaErrors.UniqueConstraintFail:
            return new UniqueConstraintError(e);

        default:
            return new DatabaseError(e.message)
    }
}