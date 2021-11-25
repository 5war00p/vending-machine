import { createMachine } from "xstate";

const paymentFSM = {
  initial: "take",
  states: {
    take: {
      on: {
        NEXT: "check",
      },
    },
    check: {
      on: {
        SUCCESS: "complete",
        LESSER: "take",
        GREATER: "return",
      },
    },
    complete: {},
    return: {},
  },
};

const vendingMachine = createMachine<undefined>({
  id: "VM",
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
      ...paymentFSM,
    },
    success: {
      on: {
        TRY_ANOTHER: "start",
      },
    },
    failure: {
      on: {
        TRY_AGAIN: "payment",
      },
    },
  },
});

export { vendingMachine };
