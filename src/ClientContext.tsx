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
  const [address, setAddress] = React.useState<string>();

  const nym = React.useRef<NymMixnetClient | null>(null);

  React.useEffect(() => {
    // on mount of the provider, create the client
    (async () => {
      nym.current = await createNymMixnetClient();
      if (nym.current?.events) {
        nym.current.events.subscribeToConnected((e) => {
          setAddress(e.args.address);
        });
      }
      setReady(true);
    })();

    //
  }, []);

  const connect = async (config: NymClientConfig) => {
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
    if (!nym.current?.client) {
      console.error(
        "Nym client has not initialised. Please wrap in useEffect on `isReady` prop of this context."
      );
      return;
    }
    await nym.current.client.sendMessage(args);
  };

  const contextValue = React.useMemo(
    () => ({
      isReady,
      events: nym.current?.events,
      address,
      connect,
      sendTextMessage,
    }),
    [isReady, nym, address]
  );

  return (
    <ClientContext.Provider value={contextValue}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClientContext = () => useContext(ClientContext);
