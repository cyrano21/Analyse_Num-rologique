/// <reference types="node" />

declare global {
  namespace NodeJS {
    interface Global {
      process: NodeJS.Process;
    }
    interface ProcessEnv {
      NEXT_PUBLIC_HUGGINGFACE_API_KEY?: string;
      NODE_ENV: 'development' | 'production' | 'test';
      [key: string]: string | undefined;
    }
  }
}

export {};
