import express from "express"

const authRouter = express.Router();

authRouter.get('/signup')
authRouter.get('/login')
authRouter.get('/logout')
authRouter.get('/verify-email')
authRouter.get('/')
authRouter.get('/signup')

export default authRouter;