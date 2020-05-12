import { Injectable } from '@angular/core';
import { Manager } from '../models/manager';
import { BusinessesService } from './businesses.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ManagersService {

  managers:Array<Manager>=new Array<Manager>();
  managersPurchased:Array<Manager>=new Array<Manager>();

  constructor(private businessesService:BusinessesService,
    private userService:UserService) { }

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
        name:"David Spencer",
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

  sortManagers(b1:Manager, b2:Manager){
    if(b1.purchasePrice>b2.purchasePrice){
      return 1;
    }
    return -1;
  }

  buyManager(id:number):void{
    let valid = this.isManagerPurchaseValid(id);
    if(valid){
      let manager=this.getManagerById(id);
      let business=this.businessesService.getBusinessPurchasedById(manager.businessId);
      this.userService.spendMoney(manager.purchasePrice);
      business.automatized=true;
      this.managersPurchased.push(manager);
    }

  }

  private isManagerPurchaseValid(id: number) {
    if(!this.isValidManagerId(id)){
      return false;
    }
    let manager=this.getManagerById(id);
    if(!this.isValidBusiness(manager)){
      return false;
    }
    if(this.isMoneyAvailable(manager)){
      return false;
    }
    return true;
  }

  private isMoneyAvailable(manager: Manager) {
    return manager.purchasePrice > this.userService.userMoney;
  }

  private isValidBusiness(manager: Manager) {
    let business = this.businessesService.getBusinessPurchasedById(manager.businessId);
    if (!business) {
      return false;
    }
    return true;
  }

  private isValidManagerId(id: number) {
    if (!this.getManagerById(id)) {
      return false;
    }
    if (this.getManagersPurchasedById(id)) {
      return false;
    }
    return true;
  }

  isManagerAvailable(id:number):boolean{
    let manager=this.getManagerById(id);
    if(!manager){
      return false;
    }
    let purchasedBusiness=this.businessesService.getBusinessPurchasedById(manager.businessId);
    if(!purchasedBusiness){
      return false;
    }
    return this.getManagersPurchasedById(id)?false:true;
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
}
