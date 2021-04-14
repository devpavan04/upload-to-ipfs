import React, { Component } from "react";
import UploadToIPFS from "./components/uploadToIPFS/UploadToIPFS";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <UploadToIPFS />
      </div>
    );
  }
}
