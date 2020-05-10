export interface IUserBusiness{
    businessId:number;
    quantity:number;
    automatized:boolean;
    busy:boolean;
    remainingTime:number;
}

export class UserBusiness {
    businessId:number;
    quantity:number;
    automatized:boolean;
    busy:boolean;
    remainingTime:number;

    constructor(data?: IUserBusiness) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
}
