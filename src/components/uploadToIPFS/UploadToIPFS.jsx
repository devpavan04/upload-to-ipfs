import React, { Component } from "react";
import { UnControlled as CodeMirror } from "react-codemirror2";
import Loader from "../loader/Loader";
import jsonImg from "./json-64.png";
import "codemirror/mode/javascript/javascript";
import "codemirror/lib/codemirror.css";
import "./uploadToIPFS.css";
import "codemirror/theme/dracula.css";

const jsonlint = require("jsonlint-mod");
window.jsonlint = jsonlint;
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

export default class UploadToIPFS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonInput: [
        {
          name: "John Doe",
          profession: "Full Stack Developer",
        },
      ],
      buffer: null,
      fileIPFSLink: "",
      jsonIPFSLink: "",
      fileUploadLoading: false,
      jsonUploadLoading: false,
    };
  }

  captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
    };
  };

  uploadFileToIPFS = async (e) => {
    if (this.state.buffer !== null) {
      this.setState({ fileUploadLoading: true });
      e.preventDefault();
      const cid = await ipfs.add(this.state.buffer);
      this.setState({ fileIPFSLink: `https://ipfs.infura.io/ipfs/${cid.path}` });
      this.setState({ fileUploadLoading: false });
    } else {
      alert("Select a file to upload!");
    }
  };

  uploadJSONToIPFS = async (e) => {
    this.setState({ jsonUploadLoading: true });
    e.preventDefault();
    const cid = await ipfs.add(JSON.stringify(this.state.jsonInput));
    this.setState({ jsonIPFSLink: `https://ipfs.infura.io/ipfs/${cid.path}` });
    this.setState({ jsonUploadLoading: false });
  };

  render() {
    return (
      <div className="container">
        <div className="mt-5">
          <h1>
            <span>📁</span>
          </h1>
          <div className="my-3"></div>
          <div className="row">
            <div className="col-4 d-flex flex-column justify-content-center">
              <h4>Upload File</h4>
            </div>
            <div className="col-8 d-flex justify-content-center">
              {this.state.fileUploadLoading ? (
                <Loader />
              ) : (
                <a className="text-info font-weight-bold" href={this.state.fileIPFSLink} target="_blank">
                  {this.state.fileIPFSLink}
                </a>
              )}
            </div>
          </div>
          <hr />
          <div className="mt-1">
            <form onSubmit={this.uploadFileToIPFS}>
              <div className="input-group">
                <label>Select File :</label>
                <input type="file" className="form-control-file" onChange={this.captureFile} />
              </div>
              <div className="input-group my-3">
                <button type="submit" className="btn btn-primary">
                  Upload File
                </button>
              </div>
            </form>
            <div className="col-7 mt-3"></div>
          </div>
        </div>
        <div style={{ marginTop: "5rem" }}>
          <img src={jsonImg} />
          <div className="my-3"></div>
          <div className="row">
            <div className="col-4 d-flex flex-column justify-content-center">
              <h4>Upload JSON Data</h4>
            </div>
            <div className="col-8 d-flex justify-content-center">
              {this.state.jsonUploadLoading ? (
                <Loader />
              ) : (
                <a className="text-info font-weight-bold" href={this.state.jsonIPFSLink} target="_blank">
                  {this.state.jsonIPFSLink}
                </a>
              )}
            </div>
          </div>
          <hr />
          <div className="mt-1">
            <form onSubmit={this.uploadJSONToIPFS}>
              <div className="input-group mb-2">
                <label>Enter Single or Array of JSON Objects :</label>
              </div>
              <CodeMirror
                value={JSON.stringify(this.state.jsonInput)}
                options={{
                  theme: "dracula",
                  height: "auto",
                  viewportMargin: Infinity,
                  mode: {
                    name: "application/json",
                    json: true,
                    statementIndent: 2,
                  },
                  gutters: ["CodeMirror-lint-markers"],
                  styleActiveLine: true,
                  lineNumbers: true,
                  lineWrapping: true,
                  indentWithTabs: true,
                  tabSize: 2,
                }}
                autoCursor={false}
                onChange={(editor, data, value) => {
                  this.setState({ jsonInput: JSON.parse(value) });
                }}
              />
              <div className="input-group my-3">
                <button type="submit" className="btn btn-primary">
                  Upload JSON
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
