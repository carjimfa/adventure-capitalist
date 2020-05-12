# AdventureCapitalist

## Clone, install and run

Clone

```bash
git clone https://github.com/carjimfa/adventure-capitalist.git
cd adventure-capitalist
```

Install

```bash
npm install
```

Run

```bash
npm run start
```

Visit http://localhost:4200 to play!!

## Game

In this game you're comitted to earn as much money as you can. You start with only 10$ and you have to start both working and buying new work force to build your empire. 

### Businesses

By default you have only 8 business types to buy, but they're configurable in the GameService.ts, where seeding happens. You can add/edit as much businesses as you want.

Businesses have a cost but you can buy as much items of a business type as you want. You can manage to have thousands of vegan restaurants or hundreds of train companies.

### Managers

By default you have 5 managers that will automatize your work and you'll never have to look to it again, never.

Managers, as its name indicates, manage the business for you, so whenever you contract one of them you'll never click work button again.

Each business has a time to generate benefits and an amount of benefits per business item. Of course, you can buy as much items of a single business as you want, multiplying the benefits. 

## Game general structure

The game is built entirely in Angular version 9.0.2 with bootstrap as UI. The game consists on a simple MVC app with a single service that serves everything with singleton objects to maintain data consistency. 

I've used Intervals and Observables Notifications to clear them. In the beginning I planned to use a turn-based engine but it wasn't as fast as this approach. I used `timer` in a first version, but the `remainingTime` was impossible to get and it would have required additional intervals only to check the remaining time to complete a task so I decided to go on with the interval approach and general game-state for each userBusiness.

UserBusiness maintains the state for each purchased business such as: quantity, remaining time to provide benefits, if it is automatized or not... using singletons simplifies data ceralization as having everything in a single point improves code reusability and data access: everything is a reference so that was an advantage.

I used localstorage to maintain state when you close the window and it works fine. I had a few troubles loading the game again but finally is working and it doesn't adds a couple of billions each time you press F5. 

I focused on the engine behind the work functionality. I wanted it to be an interval with control to make decisions for each iteration, to have control in a granularized portion of the entire work. I didn't want it to be a simple state-machine "Work->Earn->Work" but I wanted to have control over the entire work process, I mean, I wanted to be able to control the work process of long-awaited operations, and that's why I'm using intervals.

With simple timers or bigger intervals, saving/loading logic wouldn't be possible because I can't know how much time has passed since I started this 1600 seconds task. Control, that's why. 

### Improvements

The code structure is bad, very bad. GameService should be splitted in 3 different service (as a starting point) with ManagerService and BusinessService. Angular CLI allows to build everything fast and pretty but even with it refactor is on your own so there are a lot of improvements to this code that should be made in order to improve scalability. Of course I had only the weekend to complete the code and Monday, so I focused on the main functionalities: businesses, managers and saving/loading logic. 

I wanted to add power-ups (it would have been very easy) but couldn't do it, also a backend should be there to persist everything, but this is just a MVC and Angular with a couple of seeding methods makes the magic. That seeding methods should be moved to another part in case no backend is provided, to a seed functions under their own service but, it's just an MVP. 

Notifications could also be possible, with modals or bootstrap alerts very easy because we can have an observable in the userMoney or in the Buy button so when you reach 100 coworking you can have a prize or something.

### Starting the game

In the beginning GameService builds the application seeding the data from the businesses and the Managers. We'll have an `array` of Businesses full with businesses, an array of Managers full of managers and an empty array of UserBusiness (the object connecting a business and ourselves). 

### Buying

When we buy a business, we are creating an object UserManager and adding it to the array os `purchasedBusinesses` in GameService. This object will have `quantity`, `isAutomatized` and `remainingTime` attributes, very important to the correct functioning of the game. `quantity` is the number of items of a business type we have bought, `isAutomatized` tells us if the business has a manager attached to it and `remainingTime` is the remainingTime of the current working iteration that needs to be cleared to give benefits. Right after we buy a business item, work button is setted as available and we can start working with it.

### Working

What happens when you click Work button for the first time is that it starts an interval for a second and when it finishes, it will check if remaining time of the current `userBusiness` is zero, if it is zero then will add the corresponding money to `userMoney` variable. If it is not, it will decrease `remainintTime` by 1000 and continue. If we reach zero `remainingTime` and it is not automatized, it will clear the interval emitting a notification in the observable for that business. If it is automatized, then it will start all over again.  

### Managers

When you buy a Business for the first time, you are buying it in 'manual mode'. You have to click work all the time, so Managers automatized that by setting the `isAutomatized` attribute from UserBusiness to `true`, and at the end of the next work iteration, the interval won't clear but it will start again.

### Saving / Loading

For the Save functionality im saving all the `purchasedBusinesses`, `purchasedManagers` and `userMoney` in localStorage along with a Date. When I start the app I try to load this data and continue from the moment it stopped. Save is called by every interval when `remainingTime` is 0.

