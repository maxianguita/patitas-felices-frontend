import { defineConfig,loadEnv } from "vite";
import process from 'node:process';
import react from "@vitejs/plugin-react";

export default defineConfig(({command,mode})=>{
  if(command==='build'&&process.env.VERCEL_ENV==='production'){
    const env=loadEnv(mode,process.cwd(),'VITE_');
    const value=process.env.VITE_API_URL||env.VITE_API_URL;
    let url;try{url=new URL(value);}catch{throw new Error('Configurá VITE_API_URL antes de publicar.');}
    if(url.protocol!=='https:'||['localhost','127.0.0.1','[::1]'].includes(url.hostname))throw new Error('VITE_API_URL debe usar la API HTTPS pública en producción.');
  }
  return {
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  };
});
