import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { Manager } from 'src/app/models/manager';
import { Business } from 'src/app/models/business';
import { ManagersService } from 'src/app/services/managers.service';
import { UserService } from 'src/app/services/user.service';
import { BusinessesService } from 'src/app/services/businesses.service';

@Component({
  selector: 'app-managers',
  templateUrl: './managers.component.html',
  styleUrls: ['./managers.component.scss']
})
export class ManagersComponent implements OnInit {

  constructor(private managersService:ManagersService,
    private gameService:GameService,
    private userService:UserService,
    private businessesService:BusinessesService) { }

  ngOnInit(): void {
    this.gameService.loadGame();
  }

  get managers():Manager[]{
    return this.managersService.managers.sort(this.managersService.sortManagers);
  }

  trackById(index, item:Manager){
    return item.id; 
  }

  buy(id:number){
    this.managersService.buyManager(id);
  }

  isManageravailable(id:number):boolean{
    return this.managersService.isManagerAvailable(id);
  }

  isManagerContracted(id:number):boolean{
    return this.managersService.getManagersPurchasedById(id)?true:false;
  }

  get availableMoney():number{
    return this.userService.userMoney;
  }

  businessName(businessId:number):string{
    var b=this.businessesService.getBusinessById(businessId);
    return b?b.name:"NA";
  }

}
