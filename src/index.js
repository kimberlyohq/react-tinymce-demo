import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
/* eslint import/no-webpack-loader-syntax: off */
import defaultValue from "!!raw-loader!./test.html";
import { EDITOR_TYPES } from "./constants";
import { uploadInlineImages } from "./ImageUpload/utils";

ReactDOM.render(
  <React.StrictMode>
    <App
      defaultValue={defaultValue}
      type={EDITOR_TYPES.signature}
      options={{
        onLoadImg: () => {},
        onUploadImg: uploadInlineImages,
      }}
    />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
