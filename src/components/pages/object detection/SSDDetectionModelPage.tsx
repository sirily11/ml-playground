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
import Webcam from "react-webcam";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { drawRect } from "../../utils/objectDetectionUtils";

const { Title, Paragraph, Text, Link } = Typography;

export default function SSDDetectionModelPage() {
  const [width, setWidth] = React.useState(window.innerWidth);
  const [isLoading, setIsLoading] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [detections, setDetections] = React.useState<cocossd.DetectedObject[]>(
    []
  );
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
    setIsLoading(true);
    const net = await cocossd.load();
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
  }, []);

  const detect = async (net: cocossd.ObjectDetection) => {
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

        const obj = await net.detect(video!);
        setDetections(obj);
        // Draw mesh
        const ctx = canvasRef!.current!.getContext("2d");

        drawRect(obj, ctx!, 0);
      }
    }
  };

  return (
    <Card style={{ marginTop: 20, maxHeight: "80vh" }}>
      <PageHeader
        ghost={false}
        backIcon={false}
        title="Object Detection With SSD Model"
        extra={[
          <Button
            key="1"
            type="primary"
            onClick={onRunExampleClick}
            disabled={isLoading}
            loading={isLoading}
          >
            Run the example
          </Button>,
        ]}
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="Model Name">
            ssdlite_mobilenet_v2
          </Descriptions.Item>
          <Descriptions.Item label="Publisher">TensorFlow</Descriptions.Item>
          <Descriptions.Item label="Creation Time">
            04/23/2021
          </Descriptions.Item>
          <Descriptions.Item label="Model Size">28.56 MB</Descriptions.Item>
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
          {show && (
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
          )}
        </Col>
      </Row>
    </Card>
  );
}
