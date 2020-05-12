import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { Business } from 'src/app/models/business';
import { BusinessesService } from 'src/app/services/businesses.service';
import { UserService } from 'src/app/services/user.service';
import { CurrencyService } from 'src/app/services/currency.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private businessesService:BusinessesService,
    private gameService:GameService,
    private userService:UserService,
    private currencyService:CurrencyService) { }

  quantity:string="1";

  ngOnInit(): void {
    this.gameService.loadGame();
  }

  get businesses():Business[]{
    return this.businessesService.businesses.sort(this.businessesService.sortBusinesses);
  }

  isBusy(id:number):boolean{
    return this.businessesService.isBusy(id);
  }

  trackById(index, item:Business):number{
    return item.id; 
  }

  get availableMoney():number{
    return this.userService.userMoney;
  }

  isBuyAvailable(id:number):boolean{
    return this.businessesService.isBuyAvailable(id, parseInt(this.quantity));
  }

  isWorkAvailable(id:number):boolean{
    return this.businessesService.isWorkAvailable(id);
  }

  remainingTime(id:number):number{
    return this.businessesService.remainingTime(id);
  }

  isAutomatized(id:number):boolean{
    return this.businessesService.isAutomatized(id);
  }

  buy(id:number):void{
    this.businessesService.buyBusinessUnit(id,  parseInt(this.quantity));
  }

  price(id:number):string{
    return this.currencyService.formatCurrency(this.businessesService.price(id, parseInt(this.quantity)));
  }

  benefits(id:number):string{
    return this.currencyService.formatCurrency(this.businessesService.benefits(id));
  }

  work(id:number):void{
    this.gameService.work(id);
  }

  businessBoughtQuantity(id:number):number{
    return this.businessesService.businessBoughtQuantity(id);
  }


}
