import React from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const StyledDiv = styled.div`
  animation: ${fadeIn} 0.2s ease-in-out;
`;

export const FadeIn = ({ children }) => {
  return <StyledDiv>{children}</StyledDiv>;
};

FadeIn.displayName = "FadeIn";
