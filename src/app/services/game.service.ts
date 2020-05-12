import { Injectable } from '@angular/core';
import { takeUntil, map, timeout, timeInterval, switchMap, takeWhile } from 'rxjs/operators';
import { Subject, Observable, timer, interval, pipe, BehaviorSubject, NEVER } from 'rxjs';
import { Business } from '../models/business';
import { UserBusiness } from '../models/user-business';
import { BusinessPurchasedNotification } from '../models/business-purchased-notification';
import { ObserversModule } from '@angular/cdk/observers';
import { Manager } from '../models/manager';
import { SaveDto } from '../models/savedto';
import { UserService } from './user.service';
import { BusinessesService } from './businesses.service';
import { ManagersService } from './managers.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  loaded:boolean=false;
  constructor(private userService:UserService,
    private businessesService:BusinessesService,
    private managersService:ManagersService) { 
    
  }

  saveGame(){
    let saveDto=new SaveDto({
      userMoney:this.userService.userMoney,
      purchasedBusinesses:this.businessesService.businessesPurchased,
      purchasedManagers:this.managersService.managersPurchased,
      saveDate:new Date(Date.now())
    });
    localStorage.setItem("game", JSON.stringify(saveDto));
  }

  resetGame(){
    this.businessesService.businesses.forEach(element=>{
      element.workingNotifier.next(0);
    });
    this.managersService.managersPurchased=new Array<Manager>();
    this.businessesService.businessesPurchased=new Array<UserBusiness>();
    this.userService.resetMoney();
    localStorage.removeItem("game");
  }

  loadGame(){
    if(this.loaded){
      return;
    }
    this.managersService.seedManagers();
    this.businessesService.seedBusiness();
    let saveDtoRaw=localStorage.getItem("game");
    if(saveDtoRaw){
      let savedGame:SaveDto=new SaveDto(JSON.parse(saveDtoRaw));
      this.managersService.managersPurchased=savedGame.purchasedManagers;
      this.businessesService.businessesPurchased=savedGame.purchasedBusinesses;
      this.userService.setMoney(savedGame.userMoney);
      let miliSecondsDifference=(Math.ceil(new Date(Date.now()).getTime()-new Date(savedGame.saveDate).getTime()));
      let secondsDifference=miliSecondsDifference/1000;
      this.loadAutomatizedBusinesses(miliSecondsDifference, secondsDifference);
      this.loadNonAutomatizedBusinesses(secondsDifference);
    }
    this.loaded=true;
  }

  private loadNonAutomatizedBusinesses(secondsDifference: number) {
    this.businessesService.businessesPurchased.filter(b => !b.automatized).forEach(element => {
      let business = this.businessesService.getBusinessById(element.businessId);
      if (secondsDifference > element.remainingTime) {
        element.remainingTime = 0;
        let generatedMoney = element.quantity * business.profitsGenerationAmount;
        this.userService.earnMoney(generatedMoney);
      }
      else {
        element.remainingTime = element.remainingTime - secondsDifference;
      }
      this.work(element.businessId);
    });
  }

  private loadAutomatizedBusinesses(miliSecondsDifference: number, secondsDifference: number) {
    this.businessesService.businessesPurchased.filter(b => b.automatized).forEach(element => {
      let business = this.businessesService.getBusinessById(element.businessId);
      if (miliSecondsDifference > element.remainingTime) {
        let workUnitsMissed = (Math.floor(secondsDifference / business.profitsGenerationTime));
        let generatedMoney = workUnitsMissed * element.quantity * business.profitsGenerationAmount;
        this.userService.earnMoney(generatedMoney);
      }
      else{
        element.remainingTime-=miliSecondsDifference;
      }
      this.work(business.id);
    });
  }
  
  work(businessId:number):Observable<any>{
    let businessPurchased=this.businessesService.getBusinessPurchasedById(businessId);
    if(!businessPurchased){
      return;
    }
    let business=this.businessesService.getBusinessById(businessPurchased.businessId);
    businessPurchased.busy=true;
    var timer=interval(100);
    timer.pipe(
      takeUntil(business.workingNotifier),
      map((r)=>{
        if(businessPurchased.remainingTime<=0){
          this.userService.earnMoney(businessPurchased.quantity*business.profitsGenerationAmount);
          businessPurchased.remainingTime=business.profitsGenerationTime*1000;
          if(!businessPurchased.automatized){
            businessPurchased.busy=false;
            business.workingNotifier.next(1);
          }
          this.saveGame();
        }
        else{
          businessPurchased.remainingTime-=100;
        }
      })).subscribe();
  }

}
