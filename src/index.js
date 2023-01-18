import userRoutes from './routes/index.js'
import express from "express"

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/users', userRoutes);

app.listen(3000, ()=> {
    console.log('Server running on port 3000')
})