import React, { useCallback, useState } from "react";
import { Text, VStack, useToast, useColorModeValue } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { DepositData } from "./types";

export function FileUpload({
  deposits,
  setDeposits,
}: {
  deposits: Array<DepositData>;
  setDeposits: React.Dispatch<React.SetStateAction<DepositData[]>>;
}) {
  const [fileName, setFileName] = useState<string>("");
  const toast = useToast();
  function validateDepositData(data: any): void {
    if (typeof data !== "object")
      throw new Error("Invalid deposit data, it must be an object.");

    if (typeof data.amount !== "number")
      throw new Error("Invalid deposit data, amount must be a number.");

    if (typeof data.deposit_cli_version !== "string")
      throw new Error(
        "Invalid deposit data, deposit_cli_version must be a string."
      );
    if (typeof data.deposit_data_root !== "string")
      throw new Error(
        "Invalid deposit data, deposit_data_root must be a string."
      );
    if (typeof data.deposit_message_root !== "string")
      throw new Error(
        "Invalid deposit data, deposit_message_root must be a string."
      );
    if (typeof data.fork_version !== "string")
      throw new Error("Invalid deposit data, fork_version must be a string.");
    if (data.network_name !== "lukso")
      throw new Error("Invalid deposit data, network_name must be lukso.");
    if (typeof data.pubkey !== "string")
      throw new Error("Invalid deposit data, pubkey must be a string.");
    if (typeof data.signature !== "string")
      throw new Error("Invalid deposit data, signature must be a string.");
    if (typeof data.withdrawal_credentials !== "string")
      throw new Error(
        "Invalid deposit data, withdrawal_credentials must be a string."
      );
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const uploadedFile = acceptedFiles[0];

      if (uploadedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            if (!Array.isArray(data))
              throw new Error("Invalid file format, it must be a JSON array.");
            if (data.length !== 4)
              throw new Error(
                "Invalid file format, it must contain 4 deposits."
              );

            // validate deposit data
            data.forEach((deposit) => validateDepositData(deposit));

            setDeposits(data);
            setFileName(uploadedFile.name);
            toast({
              title: "File Uploaded",
              description: `${uploadedFile.name} uploaded successfully.`,
              status: "success",
              duration: 5000,
              isClosable: true,
            });
          } catch (e) {
            toast({
              title: "Error",
              description: `Invalid file, ${e.message}`,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        };
        reader.readAsText(uploadedFile);
      }
    },
    [setDeposits, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <VStack
      {...getRootProps()}
      p={5}
      borderWidth="2px"
      borderRadius="md"
      borderColor={useColorModeValue("gray.300", "gray.600")}
      borderStyle="dashed"
      bg={useColorModeValue("gray.100", "gray.700")}
      textAlign="center" // Center text alignment for all children
      spacing={4}
      w="100%"
      h="100%" // Set height to 100%
      alignItems="center" // Center align items horizontally in the stack
      justifyContent="center" // Center align items vertically in the stack
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <Text>Drop the file here...</Text>
      ) : (
        <Text>
          Drag 'n' drop the deposit-data.json file here, or click to select it
        </Text>
      )}
      {deposits && deposits.length > 0 && (
        <Text fontSize="sm">File: {fileName}</Text>
      )}
    </VStack>
  );
}
