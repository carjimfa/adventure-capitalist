import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-available-money',
  templateUrl: './available-money.component.html',
  styleUrls: ['./available-money.component.scss']
})
export class AvailableMoneyComponent implements OnInit {

  constructor(private gameService:GameService) { }

  ngOnInit(): void {
  }

  get availableMoneyFormated():string{
    return this.gameService.formatCurrency(this.gameService.userMoney);
  }

}
