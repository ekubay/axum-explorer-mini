// src/server.ts
import { App } from './app';
import dotenv from 'dotenv';

dotenv.config();

const app = new App();
app.start(parseInt(process.env.PORT || '3000'));