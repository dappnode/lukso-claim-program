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
      colorScheme="teal" // This will set the color for states like hover or active
      backgroundColor="#FFCAED" // Custom background color
      color="teal.700" // Text color for contrast; adjust as needed
      size="lg" // Larger size
      px="6" // Horizontal padding; adjust as needed for width
      py="4" // Vertical padding; adjust as needed for height
      fontSize="lg" // Larger font size
      borderRadius="md" // Border radius for rounded corners; adjust as desired
      boxShadow="md" // Optional: adds a shadow for depth
      _hover={{ bg: "#FF9EDE" }} // Optional: change for hover state; adjust color as desired
      onClick={onClick}
      isDisabled={isDisabled}
    >
      {children}
    </Button>
  );
}
