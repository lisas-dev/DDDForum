import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { createUser, updateUser, getUserByEmail } from './controllers/userController';
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { User } from "./models/User";

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;

app.post('/users/new', async (req: Request, res: Response) => {
    const result = await createUser(req.body);
    var responseCode : number = 500;
    if (result?.responseCode != undefined)
    {
        responseCode = result.responseCode;
    }
    res.status(responseCode).json(result?.responseJson);
})

app.post('/users/edit/:userId', async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const result = await updateUser(userId, req.body);
    var responseCode : number = 500;
    if (result?.responseCode != undefined)
    {
        responseCode = result.responseCode;
    }
    res.status(responseCode).json(result?.responseJson);
});

app.get('/users', async (req: Request, res: Response) => {
    const userEmail = req.query.email?.toString() ?? "";
    const result = await getUserByEmail(userEmail);
    res.status(result.responseCode).json(result.responseJson);
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

AppDataSource.initialize().then(async () => {
    console.log('TypeORM data source is intialized')
}).catch(error => console.log(error))
