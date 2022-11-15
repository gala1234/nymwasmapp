import React, { createContext, useContext } from "react";
import {
  createNymMixnetClient,
  NymMixnetClient,
  IWebWorkerEvents,
} from "@nymproject/sdk";

type NymClientConfig = {
  validatorApiUrl: string;
  preferredGatewayIdentityKey?: string;
  clientId: string;
};

type TClientContext = {
  // data
  isReady: boolean;
  address?: string;
  events?: IWebWorkerEvents;
  receivedMessage?: string;

  // methods
  connect: (config: NymClientConfig) => Promise<void>;
  sendTextMessage: (args: {
    payload: string;
    recipient: string;
  }) => Promise<void>;
};

type TData = { payload: string; recipient: string };

export const ClientContext = createContext({} as TClientContext);

export const ClientContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isReady, setReady] = React.useState<boolean>(false);
  const [address, setAddress] = React.useState<string>("");
  const [receivedMessage, setReceivedMessage] = React.useState<string>("");

  const nym = React.useRef<NymMixnetClient | null>(null);

  React.useEffect(() => {
    // on mount of the provider, create the client
    (async () => {
      nym.current = await createNymMixnetClient();
      if (nym.current?.events) {
        nym.current.events.subscribeToConnected((e) => {
          if (e.args.address) {
            setAddress(e.args.address);
          }
        });

        nym.current.events.subscribeToTextMessageReceivedEvent((e) => {
          setReceivedMessage(e.args.payload);
        });
      }
      setReady(true);
    })();

    //
  }, []);

  const connect = async (config: NymClientConfig) => {
    console.log("client", nym.current?.client);
    if (!nym.current?.client) {
      console.error(
        "Nym client has not initialised. Please wrap in useEffect on `isReady` prop of this context."
      );
      return;
    }
    await nym.current.client.start(config);
  };

  const sendTextMessage = async (args: {
    payload: string;
    recipient: string;
  }) => {
    if (nym.current) {
      await nym.current.client.sendMessage(args);
    } else {
      console.error(
        "Nym client has not initialised. Please wrap in useEffect on `isReady` prop of this context."
      );
      return;
    }
  };

  const contextValue = React.useMemo(
    () => ({
      isReady,
      events: nym.current?.events,
      address,
      receivedMessage,
      connect,
      sendTextMessage,
    }),
    [isReady, receivedMessage, nym, address]
  );

  return (
    <ClientContext.Provider value={contextValue}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClientContext = () => useContext(ClientContext);
