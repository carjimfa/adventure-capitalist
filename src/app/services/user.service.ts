import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private moneyAmount:number=10;

  constructor() { }

  get userMoney(){
    return this.moneyAmount;
  }

  spendMoney(amount:number):void{
    this.moneyAmount-=amount;
  }

  earnMoney(amount:number):void{
    this.moneyAmount+=amount;
  }

  resetMoney():void{
    this.moneyAmount=10;
  }

  setMoney(amount:number):void{
    this.moneyAmount=amount;
  }
}
