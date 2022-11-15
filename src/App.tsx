import React, { useState } from "react";
import { useClientContext } from "./ClientContext";
import "./App.css";

// mixnet v2
const validatorApiUrl = "https://qwerty-validator-api.qa.nymte.ch/api"; // "http://localhost:8081";
const preferredGatewayIdentityKey = undefined; // '36vfvEyBzo5cWEFbnP7fqgY39kFw9PQhvwzbispeNaxL';

const config = {
  clientId: "My awesome client",
  validatorApiUrl,
  preferredGatewayIdentityKey,
};

function App() {
  const { isReady, events, address, connect, sendTextMessage } =
    useClientContext();
  const [message, setMessage] = useState<string>("");
  const [receivedMessage, setReceivedMessage] = useState("");

  React.useEffect(() => {
    if (isReady) {
      connect(config);
    }
  }, [isReady]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Fantastic chat</h1>
      </header>
      <div>
        <div>
          <p>Send message:</p>
          <input placeholder="address" readOnly value={address} />
          <input
            placeholder="message"
            onChange={(event: any) => {
              setMessage(event.target.value);
            }}
            value={message}
          />
          <button
            id="button"
            onClick={(event: any) => {
              sendTextMessage({
                payload: event.target.value,
                recipient: address || "",
              });
            }}
          >
            send
          </button>
        </div>
      </div>
      <div>{receivedMessage && <p>{receivedMessage}</p>}</div>
    </div>
  );
}

export default App;
