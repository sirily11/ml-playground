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
  Select,
  Typography,
} from "antd";
import { getStringByIndex, getIndexFromString, padSequence } from "./utils";
import React from "react";
import * as tf from "@tensorflow/tfjs";
import axios from "axios";

const modelSelections = {
  Fabolus: [
    "https://notes.sirileepage.com/files/MSBD5002/fabolus_model/model.json",
    "https://notes.sirileepage.com/files/MSBD5002/fabolus_model/tokenizer_index.json",
    18,
  ],

  Taylor_Swift: [
    "https://notes.sirileepage.com/files/MSBD5002/taylor_model/model.json",
    "https://notes.sirileepage.com/files/MSBD5002/taylor_model/tokenizer_index.json",
    21,
  ],
};

export default function LyricsGenerationPage() {
  const [modelSelection, setModelSelection] = React.useState("Fabolus");
  const [isLoading, setIsLoading] = React.useState(false);
  const [textContent, setTextContent] = React.useState<string>();

  const startGeneration = React.useCallback(
    async (text: string, number: number) => {
      let currentText = text;
      setIsLoading(true);
      setTextContent("");
      try {
        //@ts-ignore
        const selected = modelSelections[modelSelection];
        const maxSeqLen = selected[2];
        const tokenizer = await axios.get(selected[1]);

        const model = await tf.loadLayersModel(selected[0]);
        const seq = padSequence(
          getIndexFromString(currentText, tokenizer.data),
          maxSeqLen
        );

        const initialIndex = text.split(" ").length;

        for (let i = initialIndex; i < maxSeqLen; i++) {
          let tensor = tf.tensor([
            padSequence(
              getIndexFromString(currentText, tokenizer.data),
              maxSeqLen
            ),
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
    [modelSelection]
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
        style={{ paddingLeft: 25, paddingRight: 25 }}
        initialValues={{ number: 10, text: "hello world" }}
        onFinish={async (values) => {
          await startGeneration(values.text, values.number);
        }}
      >
        <Row style={{ marginBottom: 10 }}>
          <label>Select Model: </label>
          <Select
            value={modelSelection}
            onChange={(e) => setModelSelection(e)}
            style={{ marginLeft: 20, width: 200 }}
          >
            {Object.keys(modelSelections).map((key) => (
              <Select.Option value={key} key={key}>
                {key}
              </Select.Option>
            ))}
          </Select>
        </Row>

        <Row>
          <Col span={10}>
            <Row>
              <Form.Item label="Initial Text" name="text">
                <Input style={{ width: 300 }} />
              </Form.Item>
            </Row>
          </Col>
          <Col>
            {isLoading ? (
              <Spin />
            ) : (
              <Typography>
                <Typography.Text strong>{textContent}</Typography.Text>
              </Typography>
            )}{" "}
          </Col>
        </Row>
        <Row justify="end">
          <Button type="primary" loading={isLoading} htmlType="submit">
            Generate Text
          </Button>
        </Row>
      </Form>
    </Card>
  );
}
