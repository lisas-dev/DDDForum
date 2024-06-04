export class RequestResult {
    public static readonly Errors = {
        UsernameAlreadyTaken: 'UserNameAlreadyTaken',
        EmailAlreadyInUse: 'EmailAlreadyInUse',
        ValidationError: 'ValidationError',
        ServerError: 'ServerError',
        ClientError: 'ClientError',
        UserNotFound: 'UserNotFound'
      }

    responseCode: number;
    responseJson: JSON;

    constructor(responseCode : number = 500, success : boolean = false, error : string | undefined = undefined, data : any = undefined) {
        this.responseCode = responseCode;
        this.responseJson = <JSON><unknown> {
            "error": error,
            "data": data,
            "success": success
        };
    }
}
