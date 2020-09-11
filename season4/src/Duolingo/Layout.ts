import { SharedValues } from "../components/AnimatedHelpers";

export type Offset = SharedValues<{
  order: number;
  width: number;
  height: number;
  x: number;
  y: number;
}>;

export const calculateLayout = (offsets: Offset[], containerWidth: number) => {
  "worklet";
  console.log({ before: offsets.map((o) => o.order.value) });
  offsets.sort((a, b) => (a.order.value > b.order.value ? 1 : -1));
  console.log({ after: offsets.map((o) => o.order.value) });
  const height = offsets[0].height.value;
  let vIndex = 0;
  let lastBreak = 0;
  offsets.forEach((offset, index) => {
    const total = offsets
      .slice(lastBreak, index)
      .reduce((acc, o) => acc + o.width.value, 0);
    if (total + offset.width.value > containerWidth) {
      offset.x.value = 0;
      vIndex++;
      lastBreak = index;
    } else {
      offset.x.value = total;
    }
    offset.y.value = vIndex * height;
  });
};
