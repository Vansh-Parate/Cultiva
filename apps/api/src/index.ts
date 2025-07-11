import cors from 'cors';
import express, { Request, Response } from 'express'
import { userRoute } from '@/routes/index'
import authRoutes  from './routes/auth.route';
import session from 'express-session';
import passport from './auth/passport';
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

const PORT = process.env.PORT || 6969
const app = express()

app.use(express.json())
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use('/api/v1/auth', authRoutes);
app.use(session({ secret:"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", resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/v1/users', userRoute);

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server working fine!!',
  })
})
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})
