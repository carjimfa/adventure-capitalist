import { UserBusiness } from './user-business';
import { Manager } from './manager';

export class SaveDto {
    userMoney:number;
    saveDate:Date;
    purchasedBusinesses:Array<UserBusiness>;
    purchasedManagers:Array<Manager>;
    
    constructor(data?: ISaveDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
}

export interface ISaveDto{
    userMoney:number;
    saveDate:Date;
    purchasedBusinesses:Array<UserBusiness>;
    purchasedManagers:Array<Manager>;
}
