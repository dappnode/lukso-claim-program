import React from "react";
import { Box, Text, Heading } from "@chakra-ui/react";
import { ConnectWallet } from "./ConnectWallet";

export function AccountNotDetected({
  setIsConnected,
}: {
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Box
      p={6}
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      bg="white"
      textAlign="center"
    >
      <Heading as="h3" size="lg" color="teal.500" mb={4}>
        Account Not Detected
      </Heading>
      <Text fontSize="md" color="gray.600" mb={6}>
        Oops! We couldn't detect your account. Please try connecting your wallet
        again.
      </Text>
      <ConnectWallet setIsConnected={setIsConnected} />
    </Box>
  );
}
