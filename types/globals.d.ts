import { User } from "./types";
export {};

declare global {
  interface CustomJwtSessionClaims extends User {
    id: string; // or any extra field you actually use
  }
}
