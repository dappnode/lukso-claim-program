import React from "react";
import { Button } from "@chakra-ui/react";

export function DappnodeButton({
  onClick,
  children,
  isDisabled = false,
}: {
  onClick: () => void;
  children: React.ReactNode;
  isDisabled?: boolean;
}) {
  return (
    <Button
      backgroundColor="#FFCAED"
      color="#000"
      size="lg"
      px="6"
      py="4"
      fontSize="lg"
      borderRadius="md"
      boxShadow="md"
      _hover={{ bg: "#FF9EDE" }}
      onClick={onClick}
      isDisabled={isDisabled}
    >
      {children}
    </Button>
  );
}
