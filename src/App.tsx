import React, { useState } from "react";
import "./App.css";
import { useMachine } from "@xstate/react";
import { vendingMachine } from "./vendingMachine";
import { interpret } from "xstate";

// Books as a Array of Objects
const BOOKS = [
  {
    title: "English Book",
    author: "A",
    price: 500,
  },
  {
    title: "Math Book",
    author: "B",
    price: 400,
  },
  {
    title: "Science Book",
    author: "C",
    price: 600,
  },
];

// to give each book in a option list
const getBookList = () => {
  let bookList = BOOKS.map((book) => {
    const bookInfo = [book.title, book.author, book.price.toString()];
    return (
      <option key={book.title} value={bookInfo}>
        {book.title} - {book.author} - {book.price}
      </option>
    );
  });

  return bookList;
};

// vending machine service
const service = interpret(vendingMachine)
  .onTransition((state) => console.log(state.value))
  .start();

function App() {
  // to maintain users book choice
  const [choosenBook, setBook] = useState("");
  // to save amount in-transist
  const [preAmount, setGivenAmount] = useState({ paidAmount: 0 });
  // to maintain all currency notes given
  const [inputMoney, setMoney] = useState({
    tenCoins: 0,
    twentyCoins: 0,
    fiftyCoins: 0,
    actualPrice: 0,
  });

  const [currentState, _send] = useMachine(vendingMachine);

  return (
    <div>
      <div className="mt-5 ml-5">
        {/* start button */}
        <button
          type="button"
          className="btn btn-primary"
          onClick={(e) => {
            if (currentState.matches("start")) {
              service.send("BOOK_SELECTION");
              (e.target as HTMLInputElement).classList.replace(
                "btn-primary",
                "btn-secondary"
              );
            }
          }}
        >
          START
        </button>
      </div>
      <div className="container p-5">
        {/* option menu */}
        <label className="row col-md-12 font-weight-bold">Select Book:</label>
        <select
          className="custom-select"
          value={choosenBook}
          onChange={(e) => {
            const selectedBook = e.target.value;
            let price = parseInt(selectedBook.split(",")[2]);
            if (selectedBook === "select") service.send("CANCEL");
            else if (selectedBook !== "select" && choosenBook !== "") {
              service.send("NOTBUYING");
            } else {
              service.send("BUYING", {
                actual_price: price,
              });
              service.send("CALC");
            }
            setMoney({ ...inputMoney, actualPrice: price });
            setBook(selectedBook);
          }}
        >
          <option value="select"> --- Select --- </option>
          {getBookList()}
        </select>
        {/* showing selected book */}
        <p className="row col-md-12 font-weight-light">
          You have chosen&nbsp;
          {
            <span className="font-weight-bold">
              {choosenBook === "select" ? "None" : `${choosenBook}`}
            </span>
          }
        </p>
        {/* taking no.of coins of each type.. */}
        {/* 10 rupee coins */}
        <div className="form-group">
          <label htmlFor="10Coins">Enter no.of 10 rupee notes: </label>
          <input
            className="form-control"
            type="number"
            placeholder="10 coins"
            value={inputMoney.tenCoins}
            onChange={(e) =>
              setMoney({
                ...inputMoney,
                tenCoins: parseInt(e.target.value) || 0,
              })
            }
          />
        </div>
        {/* 20 rupee coins */}
        <div className="form-group">
          <label htmlFor="20Coins">Enter no.of 20 rupee notes: </label>
          <input
            className="form-control"
            type="number"
            placeholder="20 coins"
            value={inputMoney.twentyCoins}
            onChange={(e) =>
              setMoney({
                ...inputMoney,
                twentyCoins: parseInt(e.target.value) || 0,
              })
            }
          />
        </div>
        {/* 50 rupee coins */}
        <div className="form-group">
          <label htmlFor="50Coins">Enter no.of 50 rupee notes: </label>
          <input
            className="form-control"
            type="number"
            placeholder="50 coins"
            value={inputMoney.fiftyCoins}
            onChange={(e) =>
              setMoney({
                ...inputMoney,
                fiftyCoins: parseInt(e.target.value) || 0,
              })
            }
          />
        </div>
        {/* pay button */}
        <button
          className="btn btn-outline-primary mr-3"
          onClick={() => {
            let givenAmount =
              preAmount.paidAmount +
              inputMoney.tenCoins * 10 +
              inputMoney.twentyCoins * 20 +
              inputMoney.fiftyCoins * 50;

            setGivenAmount({ ...preAmount, paidAmount: givenAmount });
            let price = inputMoney.actualPrice;
            console.log(preAmount.paidAmount, price);

            if (givenAmount < price) {
              service.send("LESSER", {
                cash: givenAmount,
                actual_price: inputMoney.actualPrice,
              });
            }
            if (givenAmount > price) {
              service.send("GREATER", {
                cash: givenAmount,
                actual_price: inputMoney.actualPrice,
              });

              setTimeout(() => {
                setGivenAmount({
                  ...preAmount,
                  paidAmount: 0,
                });
                setMoney({
                  ...inputMoney,
                  tenCoins: 0,
                  twentyCoins: 0,
                  fiftyCoins: 0,
                });
              }, 2000);

              service.send("RETURN");
            }
            if (givenAmount === price) {
              service.send("EQUAL", {
                cash: givenAmount,
                actual_price: inputMoney.actualPrice,
              });
              setTimeout(() => {
                setGivenAmount({
                  ...preAmount,
                  paidAmount: 0,
                });
                setBook("select");
                setMoney({
                  tenCoins: 0,
                  twentyCoins: 0,
                  fiftyCoins: 0,
                  actualPrice: 0,
                });
              }, 2000);
            }
          }}
        >
          Pay
        </button>
        {/* reset form */}
        <button
          className="btn btn-primary mr-3"
          onClick={() => {
            setBook("select");
            setMoney({
              tenCoins: 0,
              twentyCoins: 0,
              fiftyCoins: 0,
              actualPrice: 0,
            });
          }}
        >
          Reset
        </button>
        {/* message */}
        <p className="col-md-12 font-weight-light">
          {preAmount.paidAmount > inputMoney.actualPrice
            ? `I don't make change. Please give exact amount. Returning ${preAmount.paidAmount} rupees..`
            : preAmount.paidAmount < inputMoney.actualPrice
            ? `Add ${
                inputMoney.actualPrice - preAmount.paidAmount
              } rupees more..`
            : preAmount.paidAmount > 0
            ? `Payment Success. Happy reading..!`
            : ""}
        </p>
      </div>
    </div>
  );
}

export default App;
