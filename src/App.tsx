import React, { useState } from "react";
import "./App.css";
import { useMachine } from "@xstate/react";
import { vendingMachine } from "./vendingMachine";

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

function App() {
  const [choosenBook, setBook] = useState("");
  // const [current, send] = useMachine(vendingMachine);
  return (
    <div>
      <div className="mt-5 ml-5">
        <button className="btn btn-secondary"> START </button>
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
}

export default App;
