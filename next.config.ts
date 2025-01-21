import type { NextConfig } from "next";
import { DotenvParseInput, expand } from 'dotenv-expand';

const nextConfig: NextConfig = {
  /* config options here */
};

//参考 https://laros.io/how-to-get-the-current-url-with-nextjs-on-vercel
expand({ parsed: { ...(process.env as DotenvParseInput) } });


export default nextConfig;
