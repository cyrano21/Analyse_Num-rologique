/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_HUGGINGFACE_API_KEY?: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}

declare global {
  namespace NodeJS {
    interface Process {
      env: NodeJS.ProcessEnv;
    }
    interface ProcessEnv {
      NEXT_PUBLIC_HUGGINGFACE_API_KEY?: string;
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

export {};
