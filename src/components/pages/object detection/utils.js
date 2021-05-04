import * as tf from "@tensorflow/tfjs";

export const YOLO_ANCHORS = tf.tensor2d([
  [0.57273, 0.677385],
  [1.87446, 2.06253],
  [3.33843, 5.47434],
  [7.88282, 3.52778],
  [9.77052, 9.16828],
]);

export function yolo_head(feats, anchors, num_classes) {
  console.log(feats);
  const num_anchors = anchors.shape[0];

  const anchors_tensor = tf.reshape(anchors, [1, 1, num_anchors, 2]);

  let conv_dims = feats.shape.slice(1, 3);

  // For later use
  const conv_dims_0 = conv_dims[0];
  const conv_dims_1 = conv_dims[1];

  let conv_height_index = tf.range(0, conv_dims[0]);
  let conv_width_index = tf.range(0, conv_dims[1]);
  conv_height_index = tf.tile(conv_height_index, [conv_dims[1]]);

  conv_width_index = tf.tile(tf.expandDims(conv_width_index, 0), [
    conv_dims[0],
    1,
  ]);
  conv_width_index = tf.transpose(conv_width_index).flatten();

  let conv_index = tf.transpose(
    tf.stack([conv_height_index, conv_width_index])
  );
  conv_index = tf.reshape(conv_index, [conv_dims[0], conv_dims[1], 1, 2]);
  conv_index = tf.cast(conv_index, feats.dtype);

  feats = tf.reshape(feats, [
    conv_dims[0],
    conv_dims[1],
    num_anchors,
    num_classes + 5,
  ]);
  conv_dims = tf.cast(
    tf.reshape(tf.tensor1d(conv_dims), [1, 1, 1, 2]),
    feats.dtype
  );

  let box_xy = tf.sigmoid(
    feats.slice([0, 0, 0, 0], [conv_dims_0, conv_dims_1, num_anchors, 2])
  );
  let box_wh = tf.exp(
    feats.slice([0, 0, 0, 2], [conv_dims_0, conv_dims_1, num_anchors, 2])
  );
  const box_confidence = tf.sigmoid(
    feats.slice([0, 0, 0, 4], [conv_dims_0, conv_dims_1, num_anchors, 1])
  );
  const box_class_probs = tf.softmax(
    feats.slice(
      [0, 0, 0, 5],
      [conv_dims_0, conv_dims_1, num_anchors, num_classes]
    )
  );

  box_xy = tf.div(tf.add(box_xy, conv_index), conv_dims);
  box_wh = tf.div(tf.mul(box_wh, anchors_tensor), conv_dims);

  return [box_xy, box_wh, box_confidence, box_class_probs];
}
