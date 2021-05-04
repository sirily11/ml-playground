import {
  AutoComplete,
  Button,
  Card,
  Col,
  Descriptions,
  PageHeader,
  Row,
  Skeleton,
  Typography,
  Table,
} from "antd";
import React from "react";
import * as tf from "@tensorflow/tfjs";
import { drawRect } from "../../utils/objectDetectionUtils";
import Webcam from "react-webcam";
import { YOLO_ANCHORS, yolo_head } from "./utils";

const { Title, Paragraph, Text, Link } = Typography;

export default function FaceMaskDetectionPage() {
  const [width, setWidth] = React.useState(window.innerWidth);
  const [isLoading, setIsLoading] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [detections, setDetections] = React.useState<any>([]);
  const [detectionInt, setDetectionInt] = React.useState<any>();
  const webcamRef = React.useRef<Webcam>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const widthFactor = 0.64;

  React.useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });

    return () => {
      window.removeEventListener("resize", () => {});
      window.clearInterval(detectionInt);
    };
  }, []);

  const onRunExampleClick = React.useCallback(async () => {
    if (show) {
      setShow(false);
      return;
    }
    setIsLoading(true);
    const net = await tf.loadGraphModel(
      "https://notes.sirileepage.com/files/MSBD5016/models/face_mask_model/model.json"
    );
    setIsLoading(false);
    setShow(true);
    if (detectionInt === undefined) {
      setTimeout(() => {
        const intval = setInterval(() => {
          detect(net);
        }, 10);
        setDetectionInt(intval);
      }, 200);
    }
  }, [show]);

  const detect = async (net: tf.GraphModel) => {
    if (webcamRef && canvasRef) {
      if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef!.current!.video!.readyState === 4
      ) {
        // Get Video Properties
        const video = webcamRef.current.video;
        const videoWidth = webcamRef!.current!.video!.videoWidth;
        const videoHeight = webcamRef!.current!.video!.videoHeight;

        // Set video width
        webcamRef!.current!.video!.width = videoWidth;
        webcamRef!.current!.video!.height = videoHeight;

        // Set canvas height and width
        canvasRef!.current!.width = videoWidth;
        canvasRef!.current!.height = videoHeight;

        // video pixel array
        const videoObj = (await tf.browser.fromPixelsAsync(video!))
          .resizeBilinear([640, 640])
          .expandDims()
          .cast("float32")
          .reshape([1, 3, 640, 640]);

        const obj = (await net.executeAsync(videoObj)) as any[];
        console.log(obj[3].dataSync());
        // setDetections(obj);
        // Draw mesh
        const ctx = canvasRef!.current!.getContext("2d");

        // drawRect(obj, ctx!, 0);
      }
    }
  };

  return (
    <Card style={{ marginTop: 20, maxHeight: "80vh" }}>
      <PageHeader
        ghost={false}
        backIcon={false}
        title="Face Mask Detection with YOLOv5"
        extra={[
          <Button
            key="1"
            type="primary"
            onClick={onRunExampleClick}
            disabled={isLoading}
            loading={isLoading}
          >
            {show ? "Close example" : "Run example"}
          </Button>,
        ]}
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="Model Name">yolov5</Descriptions.Item>
          <Descriptions.Item label="Publisher">sirily11</Descriptions.Item>
          <Descriptions.Item label="Creation Time">
            05/04/2021
          </Descriptions.Item>
          <Descriptions.Item label="Model Size">12.56 MB</Descriptions.Item>
        </Descriptions>
      </PageHeader>
      <Row>
        <Skeleton active={true} paragraph={true} loading={isLoading} />
        <Col span={18}>
          {show && (
            <div
              style={{
                position: "relative",
                height: (width * widthFactor * 3) / 4,
                display: "flex",
              }}
            >
              <Webcam
                ref={webcamRef}
                muted={true}
                width={width * widthFactor * 0.8}
                style={{
                  position: "absolute",
                  zIndex: 8,
                }}
              />

              <canvas
                ref={canvasRef}
                width={width * widthFactor * 0.8}
                height={(width * widthFactor * 3) / 4}
                style={{
                  position: "absolute",
                  zIndex: 9,
                  // backgroundColor: "red",
                }}
              />
            </div>
          )}
        </Col>

        <Col span={6}>
          {/* {show && (
            <Table
              pagination={false}
              columns={[
                {
                  title: "Class Name",
                  dataIndex: "name",
                  key: "name",
                  render: (text: string) => <a>{text}</a>,
                },
                {
                  title: "Scores",
                  dataIndex: "score",
                  key: "scores",
                  render: (text: string) => <a>{text}</a>,
                },
              ]}
              dataSource={detections.map((d) => {
                return {
                  name: d.class,
                  score: d.score.toFixed(3),
                };
              })}
            />
          )} */}
        </Col>
      </Row>
    </Card>
  );
}
