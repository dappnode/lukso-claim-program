import React, { useEffect, useState } from "react";
import { extendTheme, ChakraProvider, Box, Flex } from "@chakra-ui/react";
import { SwitchNetwork } from "./SwitchNetwork";
import { ConnectWallet } from "./ConnectWallet";
import { luksoNetworkParams } from "./params";
import { ConnectInfo, ProviderMessage, ProviderRpcError } from "./types";
import { AccountNotDetected } from "./AccountNotDetected";
import { DappnodeLuksoIncentive } from "./DappnodeLuksoIncentive";
import { ethers } from "ethers";

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};

const theme = extendTheme({ colors });

// 3. Pass the `theme` prop to the `ChakraProvider`
function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLuksoNetwork, setIsLuksoNetwork] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    // window ethereum EIP: https://eips.ethereum.org/EIPS/eip-1193

    window.ethereum.on("chainChanged", (chainId: string) => {
      console.log("event chainChanged: ", chainId);
      window.location.reload();
    });
    window.ethereum.on("accountsChanged", (accounts: Array<string>) => {
      console.log("event accountsChanged");
      console.log("accounts", accounts);
      setAccount(accounts[0]);
    });
    window.ethereum.on("message", (message: ProviderMessage) => {
      console.log("event message", message);
    });
    window.ethereum.on("disconnect", (error: ProviderRpcError) => {
      console.log("disconnect", error);
      setIsConnected(false);
    });
    window.ethereum.on("connect", (connectInfo: ConnectInfo) => {
      console.log("event connect", connectInfo);
      setIsConnected(true);

      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts: string[]) => {
          console.log("accounts", accounts);
          // store it in state
          setAccount(accounts[0]);
        })
        .catch((error: ProviderRpcError) => console.log("error", error));

      if (connectInfo.chainId === luksoNetworkParams.chainIdHex)
        setIsLuksoNetwork(true);
    });
  }, []);

  useEffect(() => {
    if (isLuksoNetwork) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts: string[]) => {
          console.log("accounts", accounts);
          // store it in state
          setAccount(accounts[0]);
        })
        .catch((error: ProviderRpcError) => console.log("error", error));
    }
  }, [isLuksoNetwork]);

  return (
    <ChakraProvider theme={theme}>
      <Flex
        height="100vh" // Full viewport height
        alignItems="center" // Vertical centering
        justifyContent="center" // Horizontal centering
        bgImage="url('/dappnode-lukso.png')"
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
      >
        <Box>
          {!isConnected ? (
            <ConnectWallet setIsConnected={setIsConnected} />
          ) : !isLuksoNetwork ? (
            <SwitchNetwork setIsLuksoNetwork={setIsLuksoNetwork} />
          ) : !account ? (
            <AccountNotDetected setIsConnected={setIsConnected} />
          ) : (
            <DappnodeLuksoIncentive
              account={account}
              browserProvider={new ethers.BrowserProvider(window.ethereum)}
            />
          )}
        </Box>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
