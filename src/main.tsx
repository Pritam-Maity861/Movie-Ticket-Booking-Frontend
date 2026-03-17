import { StyledEngineProvider } from "@mui/material/styles";
import GlobalStyles from "@mui/material/GlobalStyles";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryProvider } from "./providers/queryProvider.tsx";
// import { ClerkProvider } from '@clerk/react'

// const PUBLISHABLE_KEY=import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// if(!PUBLISHABLE_KEY){
//   throw new Error("Clerk publishable key is missing.")
// }

createRoot(document.getElementById("root")!).render(
  // <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
  <StyledEngineProvider enableCssLayer>
    <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
    <BrowserRouter>
      <QueryProvider>
        <App />
      </QueryProvider>
    </BrowserRouter>
  </StyledEngineProvider>
  // </ClerkProvider>
);
