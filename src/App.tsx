import { Empty, Layout } from "antd";
import Sider from "antd/lib/layout/Sider";
import React from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import Navbar from "./components/components/Navbar";
import {
  ImageGenerationSidebar,
  LinearRegressionSider,
  ObjectDetectionSidebar,
} from "./components/components/NavSider";
import "antd/dist/antd.css";
import { Content } from "antd/lib/layout/layout";
import NoDataPage from "./components/pages/NoDataPage";
import SSDDetectionModelPage from "./components/pages/object detection/SSDDetectionModelPage";
import MobileNetPage from "./components/pages/object detection/MobileNetPage";
import StyleTransferPage from "./components/pages/image_generation/StyleTransfer";
import FaceMaskDetectionPage from "./components/pages/object detection/FaceMaskDetectionPage";

function App() {
  return (
    <Router>
      <Layout
        style={{ maxHeight: "100%", minHeight: "100vh", overflow: "hidden" }}
      >
        <Navbar />
        <Layout>
          <Switch>
            <Route path="/linear">
              <LinearRegressionSider />
            </Route>
            <Route path="/object_detection">
              <ObjectDetectionSidebar />
            </Route>
            <Route path="/image_generation">
              <ImageGenerationSidebar />
            </Route>
            <Route path="/" exact>
              <NoDataPage description={"Pick an example"} />
            </Route>
          </Switch>
          <Content style={{ marginLeft: 250, height: "100%" }}>
            <Switch>
              <Route path="/image_generation" exact>
                <NoDataPage description="Pick a example from left" />
              </Route>
              <Route path="/image_generation/style" exact>
                <StyleTransferPage />
              </Route>
              <Route path="/object_detection" exact>
                <NoDataPage description="Pick a example from left" />
              </Route>
              <Route path="/object_detection/ssd" exact>
                <SSDDetectionModelPage />
              </Route>
              <Route path="/object_detection/mobile_net" exact>
                <MobileNetPage />
              </Route>
              <Route path="/object_detection/facemask" exact>
                <FaceMaskDetectionPage />
              </Route>
              <Route path="/linear">
                <div>linear</div>
              </Route>
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
