import {
  InboxOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Descriptions,
  List,
  PageHeader,
  Progress,
  Row,
  Typography,
  Upload,
} from "antd";
import Dragger from "antd/lib/upload/Dragger";
import React from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";

export default function MobileNetPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState<string>();
  const [predictions, setPredictions] = React.useState<
    { className: string; probability: number }[]
  >([]);
  const [model, setModel] = React.useState<mobilenet.MobileNet>();
  const imageRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    mobilenet.load().then((model) => {
      setModel(model);
    });
  }, []);

  React.useEffect(() => {
    if (model) {
      if (imageRef) {
        model.classify(imageRef.current!).then((results) => {
          console.log(results);
          setPredictions(results);
        });
      }
    }
  }, [imageSrc]);

  const uploadButton = (
    <div>
      {isLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const displayImage = React.useCallback(async (e: any) => {
    let reader = new FileReader();
    reader.onload = async (e) => {
      setImageSrc(e.target!.result as string);
    };
    reader.readAsDataURL(e.file.originFileObj);
  }, []);

  return (
    <Card style={{ marginTop: 20 }}>
      {model === undefined && <Progress percent={30} />}

      <PageHeader
        ghost={false}
        backIcon={false}
        title="Mobile Net image classification"
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="Model Name">mobile net</Descriptions.Item>
          <Descriptions.Item label="Publisher">TensorFlow</Descriptions.Item>
        </Descriptions>
      </PageHeader>
      <Row>
        {imageSrc && (
          <img
            ref={imageRef}
            src={imageSrc}
            alt="avatar"
            style={{ width: "100%", objectFit: "contain" }}
            height="300px"
          />
        )}
      </Row>
      <Row style={{ padding: 20 }}>
        <Col span={4}>
          <Upload
            disabled={model === undefined}
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            accept="image/*"
            onChange={displayImage}
          >
            {uploadButton}
          </Upload>
        </Col>
        <Col span={20}>
          <List
            header={<div>Image Predictions</div>}
            bordered
            dataSource={predictions}
            renderItem={(item) => (
              <List.Item>
                <Typography.Text mark>{item.className}</Typography.Text>{" "}
                {(item.probability * 100).toFixed(2)} %
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </Card>
  );
}
