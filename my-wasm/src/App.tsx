import React from "react";
import { client } from "@nymproject/sdk";
import logo from "./logo.svg";
import "./App.css";

const getClient = async () => {
  const session = await client.connect("<<GATEWAY>>");
  return session;
};
function App() {
  console.log("getClient", getClient());
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
