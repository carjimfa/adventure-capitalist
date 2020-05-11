import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { Business } from 'src/app/models/business';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private gameService:GameService) { }

  quantity:string="1";

  ngOnInit(): void {
    if(this.businesses.length==0){
      this.gameService.seedBusiness();
    }
  }

  get businesses():Business[]{
    return this.gameService.businesses.sort(this.gameService.sortBusinesses);
  }

  isBusy(id:number):boolean{
    return this.gameService.isBusy(id);
  }

  trackById(index, item:Business):number{
    return item.id; 
  }

  get availableMoney():number{
    return this.gameService.userMoney;
  }

  get availableMoneyFormated():string{
    return this.gameService.formatCurrency(this.gameService.userMoney);
  }

  isBuyAvailable(id:number):boolean{
    return this.gameService.isBuyAvailable(id, parseInt(this.quantity));
  }

  isWorkAvailable(id:number):boolean{
    return this.gameService.isWorkAvailable(id);
  }

  remainingTime(id:number):number{
    return this.gameService.remainingTime(id);
  }

  isAutomatized(id:number):boolean{
    return this.gameService.isAutomatized(id);
  }

  buy(id:number):void{
    this.gameService.buyBusinessUnit(id,  parseInt(this.quantity));
  }

  price(id:number):string{
    return this.gameService.formatCurrency(this.gameService.price(id, parseInt(this.quantity)));
  }

  benefits(id:number):string{
    return this.gameService.formatCurrency(this.gameService.benefits(id));
  }

  work(id:number):void{
    this.gameService.work(id);
  }

  businessBoughtQuantity(id:number):number{
    return this.gameService.businessBoughtQuantity(id);
  }


}
