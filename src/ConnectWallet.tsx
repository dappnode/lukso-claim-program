import React from "react";
import { DappnodeButton } from "./DappnodeButton";
import { Box, useToast } from "@chakra-ui/react";

export function ConnectWallet({
  setIsConnected,
}: {
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const toast = useToast();

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // check is connected window.ethereum
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        });
        setIsConnected(true);
        console.log("Wallet connected");
      } catch (error) {
        console.error("Wallet must be connected: ", error);
        toast({
          title: "Wallet Error",
          description: `Failure during wallet connection: ${error.message}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setIsConnected(false);
      }
    } else {
      toast({
        title: "Wallet Error",
        description: "Ethereum wallet not detected.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsConnected(false);
    }
  };

  return (
    <Box>
      <DappnodeButton onClick={connectWallet}>Connect Wallet</DappnodeButton>
    </Box>
  );
}
