import { Core, frag } from "./ShaderLib";

export const pageCurl = frag`
uniform shader image;
uniform float pointer;
uniform float origin;
uniform vec2 resolution;

const float r = 225.0;
const float scaleFactor = 1.2;

${Core}

bool inRect(float2 p, float4 rct) {
  return p.x > rct.x && p.x < rct.z && p.y > rct.y && p.y < rct.w;
}

vec4 main(float2 xy) {
  float4 region = vec4(0, 0, resolution.x, resolution.y);
  Context ctx = Context(image.eval(xy), xy);
  float dx = origin - pointer; 
  float x = resolution.x - dx;
  float d = xy.x - x;

  float2 a = vec2(x, 0);
  float2 b = vec2(x, resolution.y);
  Paint paint = createStroke(vec4(0., 0., 1., 1.), 20.);
  
  if (d > r) {
    ctx.color = TRANSPARENT;
  } else if (d > 0) {
    float theta = asin(d / r);
    float d1 = theta * r;
    float d2 = (PI - theta) * r;
    vec2 p1 = vec2(x + d1, xy.y);
    vec2 p2 = vec2(x + d2, xy.y);
    if (inRect(p2, region)) {
      ctx.color = image.eval(p2);
    } else {
      ctx.color = image.eval(p1);
    }
  } else {
    vec2 p = vec2(x + abs(d) + PI * r, xy.y);
    if (inRect(p, region)) {
      ctx.color = image.eval(p);
    } else {
      ctx.color = image.eval(xy);
    }
  }

  drawLine(ctx, a, b, paint);
  return ctx.color;
}
`;
