import { UploadOutlined } from "@ant-design/icons";
import {
  Affix,
  Button,
  Card,
  Col,
  Descriptions,
  InputNumber,
  PageHeader,
  Row,
  Upload,
  Form,
  Input,
  Spin,
} from "antd";
import { getStringByIndex, getIndexFromString, padSequence } from "./utils";
import React from "react";
import * as tf from "@tensorflow/tfjs";
import axios from "axios";

export default function LyricsGenerationPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [textContent, setTextContent] = React.useState<string>();

  const startGeneration = React.useCallback(
    async (text: string, number: number) => {
      let currentText = text;
      setIsLoading(true);
      setTextContent("");
      try {
        const tokenizer = await axios.get(
          "https://notes.sirileepage.com/files/MSBD5002/fabolus_model/tokenizer_index.json"
        );

        const model = await tf.loadLayersModel(
          "https://notes.sirileepage.com/files/MSBD5002/fabolus_model/model.json"
        );
        const seq = padSequence(
          getIndexFromString(currentText, tokenizer.data),
          18
        );

        const initialIndex = text.split(" ").length;

        for (let i = initialIndex; i < 18; i++) {
          let tensor = tf.tensor([
            padSequence(getIndexFromString(currentText, tokenizer.data), 18),
          ]);
          const result = model.predict(tensor);
          //@ts-ignore
          const c = result.argMax(-1).dataSync()[0];
          const textResult = getStringByIndex(c, tokenizer.data);
          currentText += " " + textResult;
        }
        setTextContent(currentText);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return (
    <Card style={{ marginTop: 20 }}>
      <PageHeader ghost={false} backIcon={false} title="Text Generation">
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="Model Name">
            LSTM Text Generation
          </Descriptions.Item>
          <Descriptions.Item label="Publisher">sirily11</Descriptions.Item>
          <Descriptions.Item label="Updated at">05/04/2021</Descriptions.Item>
        </Descriptions>
      </PageHeader>
      <Form
        style={{ padding: 25 }}
        initialValues={{ number: 10, text: "hello world" }}
        onFinish={async (values) => {
          await startGeneration(values.text, values.number);
        }}
      >
        <Row>
          <Col span={10}>
            <Row>
              <Form.Item label="Initial Text" name="text">
                <Input />
              </Form.Item>
            </Row>
          </Col>
          <Col>{isLoading ? <Spin /> : <div>{textContent} </div>} </Col>
        </Row>
        <Affix style={{ position: "absolute", right: 10, bottom: 10 }}>
          <Button type="primary" loading={isLoading} htmlType="submit">
            Generate Text
          </Button>
        </Affix>
      </Form>
    </Card>
  );
}
