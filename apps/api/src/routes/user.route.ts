import { Router } from 'express'
import prisma from '@/db/index'
const router: Router = Router()
router.get('/', async (req, res) => {
  const users = await prisma.user.findMany()
  res.status(200).json(users)
})
router.get('/:id', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.params.id,
    },
  })
  res.status(200).json(user)
})
export default router
