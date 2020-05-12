import { Injectable } from '@angular/core';
import { UserBusiness } from '../models/user-business';
import { Business } from '../models/business';
import { Subject } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessesService {
  
  businessesPurchased:Array<UserBusiness>=new Array<UserBusiness>();
  businesses:Array<Business>=new Array<Business>();

  constructor(private userService:UserService) { }
  
  seedBusiness(){
    this.businesses.push(
      new Business({
        id:0,
        name:"Lemonade Stand",
        profitsGenerationAmount:1,
        profitsGenerationTime:1,
        purchasePrice:1,
        purchasePriceMultiplier:1,
        workingNotifier:new Subject<number>()
      }),
      new Business({
        id:1,
        name:"Restaurant",
        profitsGenerationAmount:50000,
        profitsGenerationTime:300,
        purchasePrice:25000,
        purchasePriceMultiplier:1.3,
        workingNotifier:new Subject<number>()
      }),
      new Business({
        id:2,
        name:"Coffee Supermarket Stand",
        profitsGenerationAmount:20,
        profitsGenerationTime:10,
        purchasePrice:100,
        purchasePriceMultiplier:1.5,
        workingNotifier:new Subject<number>()
      }),
      new Business({
        id:3,
        name:"Newspaper Street Stand",
        profitsGenerationAmount:150,
        profitsGenerationTime:45,
        purchasePrice:750,
        purchasePriceMultiplier:1.6,
        workingNotifier:new Subject<number>()
      }),
      new Business({
        id:4,
        name:"Pub",
        profitsGenerationAmount:22000,
        profitsGenerationTime:120,
        purchasePrice:20000,
        purchasePriceMultiplier:1.3,
        workingNotifier:new Subject<number>()
      }),
      new Business({
        id:5,
        name:"Vegan Sandwiches Cafe",
        profitsGenerationAmount:142500,
        profitsGenerationTime:500,
        purchasePrice:140000,
        purchasePriceMultiplier:1.5,
        workingNotifier:new Subject<number>()
      }),
      new Business({
        id:6,
        name:"Coworking",
        profitsGenerationAmount:175000,
        profitsGenerationTime:530,
        purchasePrice:150000,
        purchasePriceMultiplier:1.5,
        workingNotifier:new Subject<number>()
      }),
      new Business({
        id:7,
        name:"Train Company",
        profitsGenerationAmount:17500000,
        profitsGenerationTime:1800,
        purchasePrice:150000000,
        purchasePriceMultiplier:1.5,
        workingNotifier:new Subject<number>()
      })
    );
  }

  isBuyAvailable(id:number, quantity:number){
    var businessPurchased=this.getBusinessPurchasedById(id);
    var business=this.getBusinessById(id);
    if(!business){
      return false;
    }
    if(!businessPurchased){
      return this.price(id, quantity)<=this.userService.userMoney;
    }
    return this.price(id, quantity)<=this.userService.userMoney;
  }

  isAutomatized(id:number){
    return this.getBusinessPurchasedById(id).automatized;
  }

  businessBoughtQuantity(id:number):number{
    return this.getBusinessPurchasedById(id)?this.getBusinessPurchasedById(id).quantity:0;
  }

  benefits(id:number):number{
    let purchasedBusiness=this.getBusinessPurchasedById(id);
    let business=this.getBusinessById(id);
    if(!purchasedBusiness){
      return 0;
    }
    return purchasedBusiness.quantity*business.profitsGenerationAmount;
  }

  price(id:number, quantity:number){
    let business=this.getBusinessById(id);
    return business.purchasePrice*quantity;
  }

  isBusy(id:number){
    let businessPurchased=this.getBusinessPurchasedById(id);
    return businessPurchased?businessPurchased.busy:false;
  }

  buyBusinessUnit(busniessId:number, quantity:number){
    let newBusiness=this.getBusinessById(busniessId);
    let price=newBusiness.purchasePrice*quantity;
    if(!newBusiness){
      return;
    }
    if(this.userService.userMoney<(price)){
      return;
    }
    if(this.businessAlreadyPurchased(busniessId)){
      this.businessesPurchased.filter(b=>b.businessId==busniessId)[0].quantity+=quantity;
    }
    else{
      this.businessesPurchased.push(new UserBusiness({
        automatized:false,
        businessId:busniessId,
        quantity:quantity,
        busy:false,
        remainingTime:newBusiness.profitsGenerationTime*1000
      }));
    }
    this.userService.spendMoney(price);
  }

  private businessAlreadyPurchased(busniessId: number) {
    return this.businessesPurchased.filter(b => b.businessId == busniessId).length > 0;
  }

  isWorkAvailable(id:number){
    if(this.businessBoughtQuantity(id) == 0){
      return false;
    }
    let isBusy=this.isBusy(id);
    let isAutomatized=this.isAutomatized(id);
    if(this.isAutomatized(id) && this.isBusy(id)){
      return false;
    }
    return !this.isBusy(id);
  }

  remainingTime(id:number){
    let business=this.getBusinessById(id);
    let purchasedBusiness=this.getBusinessPurchasedById(id);
    if(!purchasedBusiness){
      return business.profitsGenerationTime;
    }
    return purchasedBusiness.remainingTime;
  }

  sortBusinesses(b1:Business, b2:Business){
    if(b1.purchasePrice>b2.purchasePrice){
      return 1;
    }
    return -1;
  }

  public getBusinessById(busniessId: number):Business {
    if(this.businesses.length==0){
      this.seedBusiness();
    }
    return this.businesses.filter(b => b.id == busniessId)[0];
  }

  public getBusinessPurchasedById(busniessId: number):UserBusiness {
    return this.businessesPurchased.filter(b => b.businessId == busniessId)[0];
  }

}
