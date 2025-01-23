/// <reference types="tailwindcss" />

declare module 'tailwindcss' {
  import { Config } from 'tailwindcss';
  const config: Config;
  export default config;
}
