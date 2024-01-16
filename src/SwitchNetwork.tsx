import React from "react";
import { Box, useToast } from "@chakra-ui/react";
import { luksoNetworkParams } from "./params";
import { DappnodeButton } from "./DappnodeButton";

declare global {
  interface Window {
    ethereum: any;
  }
}

export function SwitchNetwork({
  setIsLuksoNetwork,
}: {
  setIsLuksoNetwork: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const toast = useToast();

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: luksoNetworkParams.chainIdHex }],
      });
      setIsLuksoNetwork(true);
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: luksoNetworkParams.chainIdHex,
                chainName: luksoNetworkParams.name,
                rpcUrls: [luksoNetworkParams.rpcUrl],
              },
            ],
          });
          setIsLuksoNetwork(true);
        } catch (addError) {
          // handle "add" error
          toast({
            title: "Wallet Error",
            description: `Error adding network to wallet provider: ${addError.message}`,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          console.error("Error adding network to wallet provider:", addError);
          setIsLuksoNetwork(false);
        }
      }
      // handle other "switch" errors
      toast({
        title: "Wallet Error",
        description: `Error switching network: ${switchError.message}}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Error adding network to wallet provider:", switchError);
      setIsLuksoNetwork(false);
    }
  };

  return (
    <Box>
      <DappnodeButton onClick={switchNetwork}>Switch network</DappnodeButton>
    </Box>
  );
}
