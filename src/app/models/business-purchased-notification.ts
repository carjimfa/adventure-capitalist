export class IBusinessPurchasedNotification {
    businessId:number;
    quantity:number;
}

export class BusinessPurchasedNotification {
    businessId:number;
    quantity:number;

    constructor(data?: IBusinessPurchasedNotification) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
}
