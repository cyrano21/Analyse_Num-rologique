declare module 'tailwindcss' {
  export interface Config {
    content?: string[] | { [key: string]: any }[];
    theme?: {
      extend?: {
        colors?: { [key: string]: string };
        backgroundImage?: { [key: string]: string };
      };
    };
    plugins?: any[];
  }
}
