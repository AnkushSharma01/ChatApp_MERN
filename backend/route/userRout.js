import express from 'express'
import isLogin from '../middleware/isLogin.js';
import { getCorrentChatters,getUserBySearch } from '../Controlers/urc2.js';

const router = express.Router();

router.get('/search',isLogin,getUserBySearch);

router.get('/currentchatters',isLogin,getCorrentChatters)

export default router