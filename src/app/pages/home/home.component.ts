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

  ngOnInit(): void {
    if(this.businesses.length==0){
      this.gameService.seedBusiness();
    }
  }

  get businesses():Business[]{
    return this.gameService.businesses.sort(this.gameService.sortBusinesses);
  }

  isBusy(id:number){
    return this.gameService.isBusy(id);
  }

  trackById(index, item:Business){
    return item.id; 
  }

  get availableMoney():number{
    return this.gameService.userMoney;
  }

  buy(id:number){
    this.gameService.buyBusinessUnit(id, 1);
  }

  work(id:number){
    this.gameService.work(id).subscribe();
  }

  businessBoughtQuantity(id:number):number{
    return this.gameService.getBusinessPurchasedById(id)?this.gameService.getBusinessPurchasedById(id).quantity:0;
  }


}
