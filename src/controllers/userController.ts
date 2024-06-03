import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { User } from "../models/User";
import { RequestResult } from "../models/RequestResult";

export async function createUser(userJson: any) {
    try {
        const user = new User();
        user.email = userJson.email;
        user.username = userJson.username
        user.firstName = userJson.firstName;
        user.lastName = userJson.lastName;
        user.password = randomString(10);

        const userValidationFailure = validateUser(user);
        if (userValidationFailure != null)
        {
            return userValidationFailure;
        }

        const usernameValidationFailure = validateUsername(user.username);
        if (await usernameValidationFailure != null)
        {
            return usernameValidationFailure;
        }

        const emailValidationFailure = validateEmail(user.email);
        if (await emailValidationFailure != null)
        {
            return emailValidationFailure;
        }
        
        const userRepository = AppDataSource.getRepository(User);
        await userRepository.save(user);
        const result = new RequestResult(201, true, undefined, getUserDataJson(user));
        return result;
    }
    catch (error) {
        console.log(error);
        const result = new RequestResult(500, false, "ServerError", undefined);
        return result;
    }
}

export async function updateUser(userId: number, userJson: any) {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({
            id: userId,
        })

        if (user == null)
        {
            const userNotFoundResult = getUserNotFoundResult();
            return userNotFoundResult;
        }

        const tempUser : User = new User();
        tempUser.id = user.id,
        tempUser.email = userJson.email,
        tempUser.username = userJson.username,
        tempUser.firstName = userJson.firstName,
        tempUser.lastName = userJson.lastName
        tempUser.password = user.password

        const userValidationFailure = validateUser(tempUser);
        if (userValidationFailure != null)
        {
            return userValidationFailure;
        }

        if (user.username != tempUser.username)
        {
            const usernameValidationFailure = validateUsername(tempUser.username);
            if (await usernameValidationFailure != null)
            {
                return usernameValidationFailure;
            }
        }

        if (user.email != tempUser.email)
        {
            const emailValidationFailure = validateEmail(tempUser.email);
            if (await emailValidationFailure != null)
            {
                return emailValidationFailure;
            }
        }
        
        user.email = tempUser.email;
        user.username = tempUser.username
        user.firstName = tempUser.firstName;
        user.lastName = tempUser.lastName;
    
        await userRepository.save(user)
        const result = new RequestResult(200, true, undefined, getUserDataJson(user));
        return result;
    }
    catch (error) {
        console.log(error);
        const result = new RequestResult(500, false, "ServerError", undefined);
        return result;
    }
}

export async function getUserByEmail(userEmail: string)
{
    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({
            email: userEmail
        });
        if (user == null)
        {
            const userNotFoundResult = getUserNotFoundResult();
            return userNotFoundResult;
        }

        const result = new RequestResult(200, true, undefined, getUserDataJson(user));
        return result;
    }
    catch (error) {
        console.log(error);
        const result : any = new RequestResult(500, false, "ServerError", undefined);
        return result;
    }
}

function randomString(n: number)
{
    var s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array(n).join().split(',').map(function() { return s.charAt(Math.floor(Math.random() * s.length)); }).join('');
}

function validateUser(user: User)
{
    if (!user.email || !user.username || !user.firstName || !user.lastName || !user.password)
    {
        const result = new RequestResult(400, false, "ValidationError", undefined);
        return result;
    }
    return null;
}

async function validateUsername(username: string)
{
    const userRepository = AppDataSource.getRepository(User);
    const userWithSameUsername = await userRepository.findOneBy({
        username: username,
    })
    if (userWithSameUsername != null)
    {
        const result = new RequestResult(409, false, "UsernameAlreadyTaken", undefined);
        return result;
    }
    return null;
}

async function validateEmail(email: string)
{
    const userRepository = AppDataSource.getRepository(User);
    const userWithSameEmail = await userRepository.findOneBy({
        email: email,
    })

    if (userWithSameEmail != null)
    {
        const result = new RequestResult(409, false, "EmailAlreadyInUse", undefined);
        return result;
    }
    return null;
}

function getUserNotFoundResult()
{
    const result = new RequestResult(404, false, "UserNotFound", undefined);
    return result;
}

function getUserDataJson(user: User)
{
    const data = <JSON><unknown> {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "firstName": user.firstName,
        "lastName": user.lastName
    };

    return data;
}