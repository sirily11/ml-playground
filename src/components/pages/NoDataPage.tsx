import { Empty } from "antd";
import React, { Component } from "react";

interface Props {
  description: string;
}

interface State {}

export default class NoDataPage extends Component<Props, State> {
  render() {
    const { description } = this.props;

    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Empty description={description} />
      </div>
    );
  }
}
