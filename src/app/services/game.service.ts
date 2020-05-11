import { Injectable } from '@angular/core';
import { takeUntil, map, timeout, timeInterval, switchMap, takeWhile } from 'rxjs/operators';
import { Subject, Observable, timer, interval, pipe, BehaviorSubject, NEVER } from 'rxjs';
import { Business } from '../models/business';
import { UserBusiness } from '../models/user-business';
import { BusinessPurchasedNotification } from '../models/business-purchased-notification';
import { ObserversModule } from '@angular/cdk/observers';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  gamePurchaseUpdates:Subject<BusinessPurchasedNotification>=new Subject<BusinessPurchasedNotification>();
  businessesPurchased:Array<UserBusiness>=new Array<UserBusiness>();
  businesses:Array<Business>=new Array<Business>();
  busyBusiness:Array<UserBusiness>=new Array<UserBusiness>();
  workingStops:Subject<number>=new Subject<number>();

  //TODO: Working Business Units right Now

  userMoney:number=10;

  constructor() { 
    
  }

  seedBusiness(){
    this.businesses.push(
      new Business({
        id:0,
        name:"Lemonade Stand",
        profitsGenerationAmount:1,
        profitsGenerationTime:0,
        purchasePrice:1,
        purchasePriceMultiplier:1,
        workingNotifier:new Subject<number>()
      }),
      new Business({
        id:1,
        name:"Restaurant",
        profitsGenerationAmount:50000,
        profitsGenerationTime:90,
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
        profitsGenerationTime:75,
        purchasePrice:750,
        purchasePriceMultiplier:1.6,
        workingNotifier:new Subject<number>()
      }),
      new Business({
        id:4,
        name:"Pub",
        profitsGenerationAmount:12000,
        profitsGenerationTime:120,
        purchasePrice:2000,
        purchasePriceMultiplier:1.3,
        workingNotifier:new Subject<number>()
      }),
      new Business({
        id:5,
        name:"Vegan Sandwiches Cafe",
        profitsGenerationAmount:14250,
        profitsGenerationTime:500,
        purchasePrice:140000,
        purchasePriceMultiplier:1.5,
        workingNotifier:new Subject<number>()
      }),
      new Business({
        id:6,
        name:"Coworking",
        profitsGenerationAmount:17500,
        profitsGenerationTime:530,
        purchasePrice:150000,
        purchasePriceMultiplier:1.5,
        workingNotifier:new Subject<number>()
      }),
      new Business({
        id:7,
        name:"Train Company",
        profitsGenerationAmount:1750000,
        profitsGenerationTime:1800,
        purchasePrice:150000000,
        purchasePriceMultiplier:1.5,
        workingNotifier:new Subject<number>()
      })
    );
  }


  sortBusinesses(b1:Business, b2:Business){
    if(b1.purchasePrice>b2.purchasePrice){
      return 1;
    }
    return -1;
  }


  isBusy(id:number){
    return this.getBusinessPurchasedById(id).busy;
  }

  buyBusinessUnit(busniessId:number, quantity:number){
    let newBusiness=this.getBusinessById(busniessId);
    let price=newBusiness.purchasePrice*quantity;
    if(!newBusiness){
      return;
    }
    if(this.userMoney<(price)){
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
    this.userMoney=this.userMoney-price;
    this.gamePurchaseUpdates.next(new BusinessPurchasedNotification({businessId:busniessId, quantity:quantity}));
  }

  // work(businessId:number):Observable<any>{
  //   let response=new Observable<boolean>(observer=>{
  //     let businessPurchased=this.getBusinessPurchasedById(businessId);
  //     if(!businessPurchased){
  //       return;
  //     }
  //     let business=this.getBusinessById(businessPurchased.businessId);
  //     businessPurchased.busy=true;
  //     timer(business.profitsGenerationTime*1000).subscribe((r)=>{
  //       this.userMoney+=businessPurchased.quantity*business.profitsGenerationAmount;
  //       observer.next(true);
  //       businessPurchased.busy=false;
  //     })  
  //   });
  //   return response;
  // }

  work(businessId:number):Observable<any>{
    let businessPurchased=this.getBusinessPurchasedById(businessId);
    if(!businessPurchased){
      return;
    }
    let business=this.getBusinessById(businessPurchased.businessId);
    businessPurchased.busy=true;
    var timer=interval(100);
    timer.pipe(
      takeUntil(business.workingNotifier),
      map((r)=>{
        if(businessPurchased.remainingTime<=0){
          this.userMoney+=businessPurchased.quantity*business.profitsGenerationAmount;
          businessPurchased.busy=false;
          businessPurchased.remainingTime=business.profitsGenerationTime*1000;
          business.workingNotifier.next(1);
        }
        else{
          businessPurchased.remainingTime-=100;
        }
      })).subscribe();
  }


  public getBusinessById(busniessId: number) {
    return this.businesses.filter(b => b.id == busniessId)[0];
  }

  public getBusinessPurchasedById(busniessId: number):UserBusiness {
    return this.businessesPurchased.filter(b => b.businessId == busniessId)[0];
  }

  private businessAlreadyPurchased(busniessId: number) {
    return this.businessesPurchased.filter(b => b.businessId == busniessId).length > 0;
  }

  subscribeToUpdates():Observable<any>{
    return this.gamePurchaseUpdates.asObservable();
  }


}
