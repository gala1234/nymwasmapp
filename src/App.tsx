import React, { useState, useEffect } from "react";
import { createNymMixnetClient, NymMixnetClient } from "@nymproject/sdk";
import "./App.css";

// mixnet v2
const validatorApiUrl = "https://qwerty-validator-api.qa.nymte.ch/api"; // "http://localhost:8081";
const preferredGatewayIdentityKey = undefined; // '36vfvEyBzo5cWEFbnP7fqgY39kFw9PQhvwzbispeNaxL';

function App() {
  const [selfAddress, setSelfAddress] = useState("");
  const [payload, setPayload] = useState("");
  // const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  // const [client, setClient] = useState<NymMixnetClient["client"]>();

  const getClient = async () => {
    const nym: NymMixnetClient = await createNymMixnetClient();
    const { events, client } = nym;
    if (client && events) {
      client.start({
        clientId: "My awesome client",
        validatorApiUrl,
        preferredGatewayIdentityKey,
      });
      events.subscribeToConnected((e) => {
        if (e.args.address) {
          const selfAddress = e.args.address;
          console.log("Address is: " + selfAddress);
          setSelfAddress(selfAddress);
          document
            ?.getElementById("button")
            ?.addEventListener("click", function () {
              console.log("selfAddress", selfAddress);
              client.sendMessage({ payload, recipient: selfAddress });
            });
        }
      });

      nym.events.subscribeToTextMessageReceivedEvent((e) => {
        console.log("Got a message: ", e, e.args.payload);
        setPayload(`Got a messaje:  ${e.args.payload}`);
      });
    }
  };

  useEffect(() => {
    getClient();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Fantastic chat</h1>
      </header>
      <div>
        <div>
          <p>Send message:</p>
          <input
            placeholder="address"
            // onChange={(event: any) => {
            //   setRecipient(event.target.value);
            // }}
            value={selfAddress}
          />
          <input
            placeholder="message"
            onChange={(event: any) => {
              setMessage(event.target.value);
            }}
            value={message}
          />
          <button id="button">send</button>
        </div>
      </div>
      <div>{payload && <p>{payload}</p>}</div>
    </div>
  );
}

export default App;
