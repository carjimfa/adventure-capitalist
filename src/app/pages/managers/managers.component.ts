import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { Manager } from 'src/app/models/manager';
import { Business } from 'src/app/models/business';

@Component({
  selector: 'app-managers',
  templateUrl: './managers.component.html',
  styleUrls: ['./managers.component.scss']
})
export class ManagersComponent implements OnInit {

  constructor(private gameService:GameService) { }

  ngOnInit(): void {
    this.gameService.loadGame();
  }

  get managers():Manager[]{
    return this.gameService.managers.sort(this.gameService.sortManagers);
  }

  trackById(index, item:Manager){
    return item.id; 
  }

  buy(id:number){
    this.gameService.buyManager(id);
  }

  isManageravailable(id:number):boolean{
    return this.gameService.isManagerAvailable(id);
  }

  isManagerContracted(id:number):boolean{
    return this.gameService.getManagersPurchasedById(id)?true:false;
  }

  get availableMoney():number{
    return this.gameService.userMoney;
  }

  businessName(businessId:number):string{
    var b=this.gameService.getBusinessById(businessId);
    return b?b.name:"NA";
  }

}
