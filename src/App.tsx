import React, { useState } from "react";
import "./App.css";
import { useMachine } from "@xstate/react";
import { vendingMachine } from "./vendingMachine";
import { interpret } from "xstate";

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

/* function App() {
  const [choosenBook, setBook] = useState("");
  const [currentState, send] = useMachine(vendingMachine);

  return (
    <div>
      <div className="row">
        <div className="mt-5 ml-5">
          <button
            className="btn btn-primary"
            onClick={(e) => {
              if (currentState.matches("start")) send("BOOK_SELECTION");
              (e.target as HTMLInputElement).classList.replace(
                "btn-primary",
                "btn-secondary"
              );
            }}
          >
            START
          </button>
        </div>
        <div className="mt-5 ml-5">
          <button
            className="btn btn-primary"
            onClick={(e) => {
              if (currentState.matches("cancel")) send("HOME");
              (e.target as HTMLInputElement).classList.replace(
                "btn-primary",
                "btn-secondary"
              );
            }}
          >
            CANCEL
          </button>
        </div>
      </div>
      <div className="container p-5">
        <label className="row col-md-12 font-weight-bold">Select Book:</label>
        <select
          className="custom-select"
          onChange={(e) => {
            const selectedBook = e.target.value;
            setBook(selectedBook);
          }}
        >
          <option value="select"> --- Select --- </option>
          {getBookList()}
        </select>
        <p className="row col-md-12 font-weight-light">
          You have chosen&nbsp;
          {<span className="font-weight-bold">{`${choosenBook}`}</span>}
        </p>

        <div className="form-group">
          <label htmlFor="10Coins">Enter no.of 10 rupee notes: </label>
          <input
            className="form-control"
            type="number"
            placeholder="10 coins"
          />
        </div>
        <div className="form-group">
          <label htmlFor="20Coins">Enter no.of 20 rupee notes: </label>
          <input
            className="form-control"
            type="number"
            placeholder="20 coins"
          />
        </div>
        <div className="form-group">
          <label htmlFor="50Coins">Enter no.of 50 rupee notes: </label>
          <input
            className="form-control"
            type="number"
            placeholder="50 coins"
          />
        </div>

        <button className="btn btn-outline-primary mr-3"> Pay </button>
      </div>
    </div>
  );
} */

const service = interpret(vendingMachine)
  .onTransition((state) => console.log(state.value))
  .start();

function App() {
  const [choosenBook, setBook] = useState("");
  const [preAmount, setGivenAmount] = useState(0);
  const [inputMoney, setMoney] = useState({
    tenCoins: 0,
    twentyCoins: 0,
    fiftyCoins: 0,
    actualPrice: 0,
  });
  const [currentState, send] = useMachine(vendingMachine);

  return (
    <div>
      <div className="mt-5 ml-5">
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
        <label className="row col-md-12 font-weight-bold">Select Book:</label>
        <select
          className="custom-select"
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
        <p className="row col-md-12 font-weight-light">
          You have chosen&nbsp;
          {
            <span className="font-weight-bold">
              {choosenBook === "select" ? "None" : `${choosenBook}`}
            </span>
          }
        </p>

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

        <button
          className="btn btn-outline-primary mr-3"
          onClick={() => {
            let givenAmount =
              preAmount +
              inputMoney.tenCoins * 10 +
              inputMoney.twentyCoins * 20 +
              inputMoney.fiftyCoins * 50;

            setGivenAmount(givenAmount);
            let price = inputMoney.actualPrice;
            console.log(givenAmount, price);

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
              setGivenAmount(0);
              service.send("RETURN");
            }
            if (givenAmount === price) {
              service.send("EQUAL", {
                cash: givenAmount,
                actual_price: inputMoney.actualPrice,
              });
              setGivenAmount(0);
            }
          }}
        >
          Pay
        </button>
        <button
          className="btn btn-primary mr-3"
          onClick={() => {
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
      </div>
    </div>
  );
}

export default App;
