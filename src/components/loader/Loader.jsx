import React from "react";
import loaderImg from "./loader.gif";

export default function Loader() {
  return (
    <div>
      <img
        src={loaderImg}
        style={{ width: "300px", height: "90px", position: "absolute", top: "-2.6rem", right: "10rem" }}
      />
    </div>
  );
}
