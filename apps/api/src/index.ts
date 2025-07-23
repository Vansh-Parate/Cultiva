import cors from 'cors';
import express, { Request, Response } from 'express'
import authRoutes  from './routes/auth.route';
import session from 'express-session';
import passport from './auth/passport';
import dotenv from 'dotenv'
import plantIdentifyRouter from './routes/plantIdentify.route';
import router from './routes/plant.route';
import userRoute from './routes/user.route';
import speciesRoute from './routes/species.route';

dotenv.config({ path: '.env' })

const PORT = process.env.PORT || 6969
const app = express()

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://green-care-gamma.vercel.app'
  ],
  credentials: true,
}));

app.use('/api/v1/auth', authRoutes);
app.use(session({ 
  secret: process.env.SESSION_SECRET || 'default-secret', 
  resave: false, 
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/v1/users', userRoute);
app.use('/api/identify-plant', plantIdentifyRouter);
app.use('/api/v1/plants',router);
app.use('/api/v1/species',speciesRoute)

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server working fine!!',
  })
})
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})
