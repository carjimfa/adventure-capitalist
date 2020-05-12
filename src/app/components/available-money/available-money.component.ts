import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { UserService } from 'src/app/services/user.service';
import { CurrencyService } from 'src/app/services/currency.service';

@Component({
  selector: 'app-available-money',
  templateUrl: './available-money.component.html',
  styleUrls: ['./available-money.component.scss']
})
export class AvailableMoneyComponent implements OnInit {

  constructor(private userService:UserService,
    private currencyService:CurrencyService) { }

  ngOnInit(): void {
  }

  get availableMoneyFormated():string{
    return this.currencyService.formatCurrency(this.userService.userMoney);
  }

}
