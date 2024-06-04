import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { User } from "../models/User";
import { RequestResult } from "../models/RequestResult";

export async function CreateUser(userJson: any) {
    try {
        const user = new User();
        user.email = userJson.email;
        user.username = userJson.username
        user.firstName = userJson.firstName;
        user.lastName = userJson.lastName;
        user.password = RandomString(10);

        const userValidationFailure = ValidateUserFieldsNotEmpty(user);
        if (userValidationFailure != null)
        {
            return userValidationFailure;
        }

        const usernameValidationFailure = await ValidateUsernameNotTaken(user.username);
        if (usernameValidationFailure != null)
        {
            return usernameValidationFailure;
        }

        const emailValidationFailure = await ValidateEmailNotTaken(user.email);
        if (emailValidationFailure != null)
        {
            return emailValidationFailure;
        }
        
        const userRepository = AppDataSource.getRepository(User);
        await userRepository.save(user);
        const result = new RequestResult(201, true, undefined, GetUserDataJson(user));
        return result;
    }
    catch (error) {
        console.log(error);
        //const result = new RequestResult(500, false, "ServerError", undefined);
        const result = new RequestResult(500, false, RequestResult.Errors.ServerError, undefined);
        return result;
    }
}

export async function UpdateUser(userId: number, userJson: any) {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({
            id: userId,
        })

        if (user == null)
        {
            const userNotFoundResult = GetUserNotFoundResult();
            return userNotFoundResult;
        }

        const tempUser : User = new User();
        tempUser.id = user.id,
        tempUser.email = userJson.email,
        tempUser.username = userJson.username,
        tempUser.firstName = userJson.firstName,
        tempUser.lastName = userJson.lastName
        tempUser.password = user.password

        const userValidationFailure = ValidateUserFieldsNotEmpty(tempUser);
        if (userValidationFailure != null)
        {
            return userValidationFailure;
        }

        if (user.username != tempUser.username)
        {
            const usernameValidationFailure = await ValidateUsernameNotTaken(tempUser.username);
            if (usernameValidationFailure != null)
            {
                return usernameValidationFailure;
            }
        }

        if (user.email != tempUser.email)
        {
            const emailValidationFailure = await ValidateEmailNotTaken(tempUser.email);
            if (emailValidationFailure != null)
            {
                return emailValidationFailure;
            }
        }
        
        user.email = tempUser.email;
        user.username = tempUser.username
        user.firstName = tempUser.firstName;
        user.lastName = tempUser.lastName;
    
        await userRepository.save(user)
        const result = new RequestResult(200, true, undefined, GetUserDataJson(user));
        return result;
    }
    catch (error) {
        console.log(error);
        //const result = new RequestResult(500, false, "ServerError", undefined);
        const result = new RequestResult(500, false, RequestResult.Errors.ServerError, undefined);
        return result;
    }
}

export async function GetUserByEmail(userEmail: string)
{
    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({
            email: userEmail
        });
        if (user == null)
        {
            const userNotFoundResult = GetUserNotFoundResult();
            return userNotFoundResult;
        }

        const result = new RequestResult(200, true, undefined, GetUserDataJson(user));
        return result;
    }
    catch (error) {
        console.log(error);
        const result : any = new RequestResult(500, false, "ServerError", undefined);
        return result;
    }
}

function RandomString(n: number)
{
    var s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array(n).join().split(',').map(function() { return s.charAt(Math.floor(Math.random() * s.length)); }).join('');
}

function ValidateUserFieldsNotEmpty(user: User)
{
    if (!user.email || !user.username || !user.firstName || !user.lastName || !user.password)
    {
        //const result = new RequestResult(400, false, "ValidationError", undefined);
        const result = new RequestResult(400, false, RequestResult.Errors.ValidationError, undefined);
        return result;
    }
    return null;
}

async function ValidateUsernameNotTaken(username: string)
{
    const userRepository = AppDataSource.getRepository(User);
    const userWithSameUsername = await userRepository.findOneBy({
        username: username,
    })
    if (userWithSameUsername != null)
    {
        //const result = new RequestResult(409, false, "UsernameAlreadyTaken", undefined);
        const result = new RequestResult(409, false, RequestResult.Errors.UsernameAlreadyTaken, undefined);
        return result;
    }
    return null;
}

async function ValidateEmailNotTaken(email: string)
{
    const userRepository = AppDataSource.getRepository(User);
    const userWithSameEmail = await userRepository.findOneBy({
        email: email,
    })

    if (userWithSameEmail != null)
    {
        //const result = new RequestResult(409, false, "EmailAlreadyInUse", undefined);
        const result = new RequestResult(409, false, RequestResult.Errors.EmailAlreadyInUse, undefined);
        return result;
    }
    return null;
}

function GetUserNotFoundResult()
{
    //const result = new RequestResult(404, false, "UserNotFound", undefined);
    const result = new RequestResult(404, false, RequestResult.Errors.UserNotFound, undefined);
    return result;
}

function GetUserDataJson(user: User)
{
    const data = JSON.parse(JSON.stringify(user));
    delete data.password;
    return data;
}