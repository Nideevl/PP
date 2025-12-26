    import express from 'express'
    import { authMiddleware } from '../middleware/auth.middleware.js'
    import { getProfile , updateProfile } from '../controllers/user.controllers.js'

    const router = express.Router();

    router.get('/get',authMiddleware,getProfile);
    router.put('/update',authMiddleware, updateProfile);

    export default router;