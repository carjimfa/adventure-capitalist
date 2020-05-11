import { Injectable } from '@angular/core';
import { takeUntil, map, timeout, timeInterval, switchMap, takeWhile } from 'rxjs/operators';
import { Subject, Observable, timer, interval, pipe, BehaviorSubject, NEVER } from 'rxjs';
import { Business } from '../models/business';
import { UserBusiness } from '../models/user-business';
import { BusinessPurchasedNotification } from '../models/business-purchased-notification';
import { ObserversModule } from '@angular/cdk/observers';
import { Manager } from '../models/manager';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  gamePurchaseUpdates:Subject<BusinessPurchasedNotification>=new Subject<BusinessPurchasedNotification>();
  businessesPurchased:Array<UserBusiness>=new Array<UserBusiness>();
  businesses:Array<Business>=new Array<Business>();
  managers:Array<Manager>=new Array<Manager>();
  managersPurchased:Array<Manager>=new Array<Manager>();
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

  seedManagers(){
    this.managers.push(
      new Manager({
        businessId:0,
        id:0,
        name:"Irene Jimenez",
        purchasePrice:0,
        imageSrc:"./assets/girl-1.jpg"
      }),
      new Manager({
        businessId:1,
        id:1,
        name:"Amanda Grace",
        purchasePrice:50000,
        imageSrc:"./assets/girl-2.jpg"
      }),
      new Manager({
        businessId:2,
        id:2,
        name:"Roberto Leal",
        purchasePrice:250000,
        imageSrc:"./assets/boy-1.jpg"
      }),
      new Manager({
        businessId:3,
        id:3,
        name:"Repurt Morduch",
        purchasePrice:500000,
        imageSrc:"./assets/boy-2.jpg"
      }),
      new Manager({
        businessId:6,
        id:6,
        name:"Martha Lynch",
        purchasePrice:1500000,
        imageSrc:"./assets/girl-4.jpg"
      }),
      new Manager({
        businessId:7,
        id:7,
        name:"Laura Robertson",
        purchasePrice:2000000,
        imageSrc:"./assets/girl-5.jpg"
      })
      );
  }

  formatCurrency(amount:number){
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    return formatter.format(amount);
  }
  
  isBuyAvailable(id:number, quantity:number){
    var businessPurchased=this.getBusinessPurchasedById(id);
    var business=this.getBusinessById(id);
    if(!business){
      return false;
    }
    if(!businessPurchased){
      return this.price(id, quantity)<=this.userMoney;
    }
    return this.price(id, quantity)<=this.userMoney;
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

  sortManagers(b1:Manager, b2:Manager){
    if(b1.purchasePrice>b2.purchasePrice){
      return 1;
    }
    return -1;
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

  buyManager(id:number):void{
    if(!this.getManagerById(id)){
      return;
    }
    if(this.getManagersPurchasedById(id)){
      return;
    }
    let manager=this.getManagerById(id);
    let business=this.getBusinessPurchasedById(manager.businessId);
    if(!business){
      return;
    }
    if(manager.purchasePrice>this.userMoney){
      return;
    }
    this.userMoney-=manager.purchasePrice;
    business.automatized=true;
    this.managersPurchased.push(manager);
  }

  isManagerAvailable(id:number):boolean{
    let manager=this.getManagerById(id);
    if(!manager){
      return false;
    }
    let purchasedBusiness=this.getBusinessPurchasedById(manager.businessId);
    if(!purchasedBusiness){
      return false;
    }
    return this.getManagersPurchasedById(id)?false:true;
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
          businessPurchased.remainingTime=business.profitsGenerationTime*1000;
          if(!businessPurchased.automatized){
            businessPurchased.busy=false;
            business.workingNotifier.next(1);
          }
        }
        else{
          businessPurchased.remainingTime-=100;
        }
      })).subscribe();
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

  public getManagerById(managerId: number) {
    if(this.managers.length==0){
      this.seedManagers();
    }
    return this.managers.filter(b => b.id == managerId)[0];
  }

  public getManagersPurchasedById(managerId: number):Manager {
    return this.managersPurchased.filter(b => b.id == managerId)[0];
  }

  private businessAlreadyPurchased(busniessId: number) {
    return this.businessesPurchased.filter(b => b.businessId == busniessId).length > 0;
  }

  subscribeToUpdates():Observable<any>{
    return this.gamePurchaseUpdates.asObservable();
  }


}
