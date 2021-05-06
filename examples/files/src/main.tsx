import React from "react";
import ReactDOM from "react-dom";
import files from "virtual:generate-files";
import "./index.css";
import App from "./App";

console.log("files", files);

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
