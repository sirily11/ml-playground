import { UploadOutlined } from "@ant-design/icons";
import {
  Affix,
  Button,
  Card,
  Col,
  Descriptions,
  PageHeader,
  Row,
  Upload,
} from "antd";
import { UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import React from "react";
import * as tf from "@tensorflow/tfjs";

export default function StyleTransferPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [originalImageSrc, setOriginalImageSrc] = React.useState<string>();
  const [styleImageSrc, setStyleImageSrc] = React.useState<string>();
  const [transformImageSrc, setTransformImageSrc] = React.useState<string>();

  const originalImage = React.useRef<HTMLImageElement>(null);
  const styleImage = React.useRef<HTMLImageElement>(null);

  const uploadStyle = React.useCallback((e: UploadChangeParam<UploadFile>) => {
    let reader = new FileReader();
    reader.onload = async (e) => {
      setStyleImageSrc(e.target!.result as string);
    };
    reader.readAsDataURL(e.file.originFileObj);
  }, []);

  const uploadOriginal = React.useCallback(
    (e: UploadChangeParam<UploadFile>) => {
      let reader = new FileReader();
      reader.onload = async (e) => {
        setOriginalImageSrc(e.target!.result as string);
      };
      reader.readAsDataURL(e.file.originFileObj);
    },
    []
  );

  const startTransform = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const model = await tf.loadGraphModel(
        "https://notes.sirileepage.com/files/MSBD5016/models/style_model/model.json"
      );
      if (!styleImage.current || !originalImage.current) {
        console.error("Ref not mounted");
        return;
      }
      const style = (await tf.browser.fromPixelsAsync(styleImage.current!))
        .resizeBilinear([224, 224])
        .expandDims()
        .cast("float32");

      const original = (
        await tf.browser.fromPixelsAsync(originalImage.current!)
      )
        .resizeBilinear([224, 224])
        .expandDims()
        .cast("float32");

      const result = (await model.executeAsync([
        original,
        style,
      ])) as tf.Tensor4D;
      const styledImage = tf.tensor((await result.array())[0]) as tf.Tensor3D;

      const shape = styledImage.shape;
      const canvas = document.createElement("canvas");
      canvas.width = shape[0];
      canvas.height = shape[1];

      await tf.browser.toPixels(styledImage, canvas);
      const dataURL = canvas.toDataURL();
      setTransformImageSrc(dataURL);
    } catch (err) {
      console.error(err);
      alert(err);
    } finally {
      setIsLoading(false);
    }
  }, [styleImage, originalImage]);

  return (
    <Card style={{ marginTop: 20 }}>
      <PageHeader ghost={false} backIcon={false} title="Style Transfer">
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="Model Name">
            arbitrary-image-stylization-v1-256
          </Descriptions.Item>
          <Descriptions.Item label="Publisher">Google</Descriptions.Item>
          <Descriptions.Item label="Updated at">05/01/2021</Descriptions.Item>
        </Descriptions>
      </PageHeader>
      <Row gutter={10}>
        <Col>
          <Upload
            onChange={uploadOriginal}
            accept="image/*"
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Upload original image</Button>
          </Upload>
        </Col>
        <Col>
          <Upload
            onChange={uploadStyle}
            accept="image/*"
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Upload style image</Button>
          </Upload>
        </Col>
      </Row>
      <Row
        align="bottom"
        gutter={10}
        style={{
          marginTop: 10,
        }}
      >
        {originalImageSrc && (
          <Col span={8}>
            <img
              ref={originalImage!}
              src={originalImageSrc}
              style={{ objectFit: "contain", maxHeight: 400 }}
              width="100%"
            />
            <p>Original Image</p>
          </Col>
        )}
        {styleImageSrc && (
          <Col span={8}>
            <img
              ref={styleImage!}
              src={styleImageSrc}
              style={{ objectFit: "contain", maxHeight: 400 }}
              width="100%"
            />
            <p>Style Image</p>
          </Col>
        )}
        {transformImageSrc && (
          <Col span={8}>
            <img
              src={transformImageSrc}
              style={{ objectFit: "contain", maxHeight: 400 }}
              width="100%"
            />
            <p>Generated Image</p>
          </Col>
        )}
      </Row>
      <Affix style={{ position: "absolute", right: 10, bottom: 10 }}>
        <Button
          type="primary"
          onClick={startTransform}
          loading={isLoading}
          disabled={
            styleImageSrc === undefined || originalImageSrc === undefined
          }
        >
          Transfrom the image
        </Button>
      </Affix>
    </Card>
  );
}
