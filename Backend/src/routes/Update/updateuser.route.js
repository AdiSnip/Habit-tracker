import {Router} from 'express';
import updateUser from '../../controllers/Update/updateuser.controller.js';

const router = Router();
// Route to update user information
router.put('/', updateUser);
// Export the router
export default router;