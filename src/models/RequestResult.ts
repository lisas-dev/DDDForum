export class RequestResult {
    responseCode: number;
    responseJson: JSON;

    constructor(responseCode : number = 500, success : boolean = false, error : string = "", data : any = undefined) {
        this.responseCode = responseCode;
        this.responseJson = <JSON><unknown> {
            "error": error,
            "data": data,
            "success": success
        };
    }

    
}
