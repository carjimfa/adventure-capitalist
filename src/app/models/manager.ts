export class Manager {
    id:number;
    name:string;
    businessId:number;
    purchasePrice:number;
    imageSrc:string;

    constructor(data?: IManager) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
}

export interface IManager{
    id:number;
    name:string;
    businessId:number;
    purchasePrice:number;
    imageSrc:string;
}
