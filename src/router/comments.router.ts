import express from 'express'; 
import {fetchComments, postComment, postReply} from '../controllers/comments.controller';
import { verifyToken } from '../middleware/authMiddleware';



const router = express.Router();

router.get('/:movie_id', fetchComments);
router.post('/',verifyToken, postComment);
router.post('/reply',verifyToken, postReply);

export default router;