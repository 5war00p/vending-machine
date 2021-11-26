# Description of the project

Building a state machine for the Vending Machine using **XState** pacakge which a customer can request to buy a book and pay the cash as machine acceptable currency  notes or coins with the simple UI using **React** which gives a vision of the entire vending machine process.

## Installation of XState
```
npm install xstate
```
&nbsp;&nbsp;&nbsp;&nbsp;or

```
npm install xstate@latest
```

## React hooks and utilities for using XState in React applications
```
npm install @xstate/react
```

## Available Scripts

In the project directory, to run react server you can use:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

also other scripts that are generated by default but here we are not going to use them.

## Documentation

XState Visualizer for the Vending Machine to see the visualization 📉 on
[stately.ai/viz](https://stately.ai/viz/92a01aa7-3382-4e4d-a82b-9126afd99fd2 "Vending Machine state diagram")

The main two files are _vendingMachine.ts_ and _App.ts_

#### vendingMachine.ts

This is the file that contains defninition of our VM(Vending Machine) state machine as two-level state model.
First level is **vendingMachine** and the Second is **paymentFSM**. The flow transfers from vendgin machine to payment when user tries to pay to the vending machine.

#### App.ts

All the UI part and the integration of actions based on the events that defined as in state machine is done on _App.ts_ itself.

The UI conducts following activities of the state machine:
* A start button allows user to select a book.
* if user chooses a book then he allowed to make payment of defined currency notes(coins).
* if he fails to choose then it cancels transaction and return start state.
* if user fails to add exact money then machine asks to add more money.
* if user adds more money than the price of book then it return all the money and asks to re-enter money again.
* if user deposit exact money then it returns success message and return to home.

## Contribution
The main purpose of this repository is to apply knowledge of Finite State Machine to make a vending machine. And this project is done as an assignment of **O-Slash(O/)**.

## License
MIT licensed
