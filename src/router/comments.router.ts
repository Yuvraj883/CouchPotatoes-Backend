import express from 'express'; 
import {fetchComments} from '../controllers/comments.controller';


const router = express.Router();

router.get('/:movie_id', fetchComments);
// router.post('/', postcomment);

export default router;