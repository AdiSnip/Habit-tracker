import { Router } from 'express';
import { updateUser, updateXP } from '../../controllers/Update/updateuser.controller.js';

const updateuser = Router();

// Route to update user information (can remain POST or PATCH as you like)
updateuser.post('/', updateUser);

// Change this to PATCH for partial update of XP
updateuser.patch('/xp', updateXP);

export default updateuser;
