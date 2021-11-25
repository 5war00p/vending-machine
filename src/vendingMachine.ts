import { createMachine } from "xstate";

const vendingMachine = createMachine<undefined>({
  id: "vending",
  initial: "start",
  states: {
    start: {
      on: {
        BOOK_SELECTION: "book",
      },
    },
    book: {
      on: {
        YES: { target: "payment" },
        NO: { target: "book" },
        CANCEL: { target: "start" },
      },
    },
    payment: {
      on: {
        DONE: "success",
        FAILED: "failure",
      },
    },
    success: {
      on: {
        TRY_ANOTHER: "start",
      },
    },
    failure: {
      on: {
        TRY_AGAIN: "start",
      },
    },
  },
});

export { vendingMachine };
