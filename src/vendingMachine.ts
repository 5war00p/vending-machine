import { createMachine } from "xstate";

type VMEvents =
  | { type: "BOOK_SELECTION" }
  | { type: "BUYING"; actual_price: number }
  | { type: "NOTBUYING" }
  | { type: "CANCEL" }
  | { type: "HOME" }
  | { type: "CALC" }
  | { type: "EQUAL"; cash: number; actual_price: number }
  | { type: "LESSER"; cash: number; actual_price: number }
  | { type: "GREATER"; cash: number; actual_price: number }
  | { type: "RETURN" };

interface VMContext {
  required_amount: number;
  received_amount: number;
  remaining_amount: number;
  isDone: boolean;
}

const paymentFSM = {
  initial: "take",
  states: {
    take: {
      on: {
        CALC: "check",
      },
    },
    check: {
      on: {
        EQUAL: {
          target: "complete",
          actions: ["accept"],
          cond: "isEqual",
        },
        LESSER: { target: "take", actions: ["addmore"], cond: "isLower" },
        GREATER: { target: "reenter", actions: ["reject"], cond: "isHigher" },
      },
    },
    reenter: {
      on: { RETURN: { target: "take" } },
    },
    complete: {},
  },
};

const vendingMachine = createMachine<VMContext, VMEvents>(
  {
    id: "VM",
    initial: "start",
    // the initial context (extended state) of the statechart
    context: {
      required_amount: 0,
      received_amount: 0,
      remaining_amount: 0,
      isDone: false,
    },
    states: {
      start: {
        on: {
          BOOK_SELECTION: { target: "book", actions: ["setup"] },
        },
      },
      book: {
        on: {
          BUYING: { target: "payment", actions: ["pay"] },
          NOTBUYING: { target: "book" },
          CANCEL: { target: "cancel" },
        },
      },
      payment: {
        type: "compound",
        invoke: {
          id: "main",
          src: "paymentFSM",
          // Required to handle JS failures in the child
          onDone: "success",
          onError: "failure",
        },
        ...paymentFSM,
      },
      success: {
        on: {
          HOME: "start",
        },
      },
      failure: {
        on: {
          HOME: "start",
        },
      },
      cancel: {
        on: {
          HOME: "start",
        },
      },
    },
  },
  {
    services: {
      paymentFSM: (context) => (send) => {},
    },
    actions: {
      setup: (context, event) => {
        context.required_amount = 0;
        context.received_amount = 0;
        context.remaining_amount = 0;
        context.isDone = false;
      },
      pay: (context, event) => {
        const { actual_price }: any = event;
        context.required_amount = actual_price;
      },
      reject: (context, event) => {
        context.received_amount = 0;
      },
      addmore: (context, event) => {
        const { cash, actual_price }: any = event;

        context.received_amount += cash;
        context.remaining_amount = actual_price - context.received_amount;
      },
      accept: (context, event) => {
        context.isDone = true;
      },
    },
    guards: {
      isHigher: (context, event) => {
        const { cash, actual_price }: any = event;

        return cash > actual_price;
      },
      isLower: (context, event) => {
        const { cash, actual_price }: any = event;

        return cash < actual_price;
      },
      isEqual: (context, event) => {
        const { cash, actual_price }: any = event;

        return cash === actual_price;
      },
    },
  }
);

export { vendingMachine };
