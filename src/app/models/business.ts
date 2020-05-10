export interface IBusiness{
    id:number;
    name:string;
    profitsGenerationTime:number;
    profitsGenerationAmount:number;
    purchasePrice:number;
    purchasePriceMultiplier:number;
}

export class Business implements IBusiness {
    id:number;
    name:string;
    profitsGenerationTime:number;
    profitsGenerationAmount:number;
    purchasePrice:number;
    purchasePriceMultiplier:number;

    constructor(data?: IBusiness) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
}
