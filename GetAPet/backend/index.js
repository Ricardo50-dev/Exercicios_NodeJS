import express from 'express';
import cors from 'cors';
import UserRoutes from './routes/UserRoutes.js'
import PetRoutes from './routes/PetRoutes.js'

const app = express()

app.use(express.json())

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

app.use(express.static('public'))

//Routes
app.use('/users', UserRoutes)
app.use('/pets', PetRoutes)

app.listen(5000)