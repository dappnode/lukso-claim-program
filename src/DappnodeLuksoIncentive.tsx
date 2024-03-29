/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { Abi, Abi__factory } from "./types/contracts";
import { address } from "./contract/address";
import { DappnodeButton } from "./DappnodeButton";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Heading,
  VStack,
  HStack,
  Icon,
  Box,
  Text,
  Center,
  useToast,
  Badge,
  AlertIcon,
  Alert,
  Spinner,
  Flex,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { FileUpload } from "./FileUpload";
import { DepositData, ReqStatus } from "./types";

export function DappnodeLuksoIncentive({
  account,
  browserProvider,
}: {
  account: string;
  browserProvider: ethers.BrowserProvider;
}) {
  const [txData, setTxData] = useState<string | null>(null);
  const [reqStatus, setReqStatus] = useState<ReqStatus | null>(null);
  const [deposits, setDeposits] = useState<Array<DepositData>>([]);
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const toast = useToast();

  useEffect(() => {
    const contract: Abi = Abi__factory.connect(address, browserProvider);
    contract.addressToIncentive(account).then((res) => {
      const { isClaimed, endTime } = res;
      if (Number(endTime) === 0) setIsWhitelisted(false);
      else setIsWhitelisted(true);
      if (isClaimed) setIsClaimed(true);
      else setIsClaimed(false);
      if (endTime < Math.floor(Date.now() / 1000)) setIsExpired(true);
      else setIsExpired(false);
    });
  }, [account, browserProvider]);

  async function dappnodeDeposit(): Promise<void> {
    try {
      setReqStatus({
        status: "pending",
        message: `Sending deposit transaction for ${deposits.length} deposits`,
      });

      const signer = await browserProvider.getSigner();
      const dappnodeDepositContract = Abi__factory.connect(address, signer);

      let data = "0x";
      data += deposits[0].withdrawal_credentials;
      deposits.forEach((deposit) => {
        data += deposit.pubkey;
        data += deposit.signature;
        data += deposit.deposit_data_root;
      });

      const provider = signer.provider;
      const gasPrice = await provider.send("eth_gasPrice", []);

      const estimate = await dappnodeDepositContract.claimIncentive.estimateGas(
        data
      );

      const gasLimit = estimate + 50000n; // Add some buffer gas

      const tx = await dappnodeDepositContract.claimIncentive(data, {
        gasLimit,
        gasPrice,
      });

      setReqStatus({
        status: "pending",
        message: "Waiting for transaction to be mined...",
      });
      setTxData(tx.data);
      await tx.wait();
      setReqStatus({ status: "success", message: "Transaction mined!" });
      toast({
        title: "Transaction mined!",
        description: `Tx hash: ${tx.hash}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);

      if (err?.code === -32603) {
        const errorMessage =
          "Transaction was not sent due to low gas price. Please try increasing the gas price.";

        setReqStatus({ status: "error", message: errorMessage });

        toast({
          title: "Error",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        const errorMessage = "An unexpected error occurred. Please try again.";

        setReqStatus({ status: "error", message: errorMessage });

        toast({
          title: "Error",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  }

  return (
    <>
      {reqStatus && reqStatus.status === "pending" && (
        <Flex mt="20px" py="4" justifyContent="center" color="#000">
          <Box display="flex" color={"#848484"}>
            <Spinner size="md" color="#FE005B" />
            <Text ml="2">Sending deposit transaction...</Text>
          </Box>
        </Flex>
      )}
      <Box
        p={16}
        bg={"#fff"}
        shadow="md"
        borderWidth="1px"
        flex="1"
        borderRadius="md"
        w="100%"
        h="100%"
        display="flex"
        flexDirection="column"
      >
        <Center>
          <Heading fontSize="xl" mb={2}>
            Dappnode Lukso Incentive Program
          </Heading>
        </Center>
        <VStack align="flex-start" mb={4} mt={4} flex="1">
          <HStack spacing={2}>
            <Text>Address:</Text>
            <Badge variant="outline" colorScheme="green">
              {account}
            </Badge>
          </HStack>
          <HStack>
            <Icon
              as={isWhitelisted ? CheckIcon : CloseIcon}
              color={isWhitelisted ? "green.500" : "red.500"}
            />
            <Text>Whitelisted: {isWhitelisted ? "Yes" : "No"}</Text>
          </HStack>
          {/* Additional condition for feedback when not whitelisted */}
          {!isWhitelisted && (
            <Text color="red.500">
              This account is not whitelisted. Please make sure to use your
              Dappnode address.
            </Text>
          )}
          {/* Conditionally render Claimed and Expired sections */}
          {isWhitelisted && (
            <>
              <HStack>
                <Icon
                  as={!isClaimed ? CheckIcon : CloseIcon}
                  color={!isClaimed ? "green.500" : "red.500"}
                />
                <Text>Claimed: {isClaimed ? "Yes" : "No"}</Text>
              </HStack>
              <HStack>
                <Icon
                  as={!isExpired ? CheckIcon : CloseIcon}
                  color={!isExpired ? "green.500" : "red.500"}
                />
                <Text>Expired: {isExpired ? "Yes" : "No"}</Text>
              </HStack>
            </>
          )}
        </VStack>

        {isWhitelisted && !isExpired && !isClaimed && (
          <Box mb={4}>
            <FileUpload deposits={deposits} setDeposits={setDeposits} />
          </Box>
        )}

        {deposits.length > 0 && (
          <Alert status="success" mb={4}>
            <AlertIcon />
            Deposits file valid and ready to be sent!
          </Alert>
        )}

        <DappnodeButton
          onClick={dappnodeDeposit}
          isDisabled={
            deposits.length === 0 ||
            !isWhitelisted ||
            isClaimed ||
            isExpired ||
            (reqStatus && reqStatus.status === "pending") ||
            false // Provide a default value of false if isDisabled is undefined
          }
        >
          Dappnode deposit
        </DappnodeButton>
      </Box>
    </>
  );
}
