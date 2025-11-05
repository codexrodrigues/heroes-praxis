// Shim for Angular Material internal hashed d.ts imports referenced by @praxisui/*
// These hashes can vary between builds; declare them to avoid TS2307 during compilation.

declare module '@angular/material/paginator.d-Zo1cMMo4' {
  export * from '@angular/material/paginator';
}

declare module '@angular/material/error-options.d-CGdTZUYk' {
  // The library only needs the presence of the module; no types required.
  export {};
}

