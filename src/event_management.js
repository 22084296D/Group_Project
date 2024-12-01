import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import { init_eventdb, create_event, fetch_events } from './eventdb.js';

const route = express.Router();
const form = multer();

route.use(express.json());
route.use(express.urlencoded({ extended: true }));


export default route;