import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store } from "./store";
import { Provider } from "react-redux";
import { ThemeProvider } from "@material-tailwind/react";
import { Toaster } from "react-hot-toast";
import { PhysioProvider } from "./context/PhysioContext.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <PhysioProvider>
          <App />
          <Toaster
            position="top-center"
            reverseOrder={false}
            className="z-50"
          />
        </PhysioProvider>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
