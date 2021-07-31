<script lang="ts">
import {
  Component, Inject, Prop, Vue,
} from 'vue-property-decorator';

const percentWidthToPix = (percent: number, ctx: CanvasRenderingContext2D) => Math.floor((ctx.canvas.width / 100) * percent);
const percentHeightToPix = (percent: number, ctx: CanvasRenderingContext2D) => Math.floor((ctx.canvas.height / 100) * percent);

@Component
export default class VillageTile extends Vue {
  @Inject('provider') private provider: { context?: CanvasRenderingContext2D };

  @Prop() x: number;

  @Prop() y: number;

  @Prop() startX: number;

  @Prop() startY: number;

  @Prop() width: number;

  @Prop() height: number;

  @Prop() color: string;

  private oldBox: { x: number, y: number, w: number, h: number } = {
    x: null,
    y: null,
    w: null,
    h: null,
  };

  get calculatedBox() {
    const ctx = this.provider.context;
    const x = this.startX - (this.x * this.width * 0.5) + (this.y * this.height * 0.5);
    const y = this.startY + (this.x * this.width * 0.5) + (this.y * this.height * 0.5);

    const calculated = {
      x: percentWidthToPix(x, ctx),
      y: percentHeightToPix(y, ctx),
      w: percentWidthToPix(this.width, ctx),
      h: percentHeightToPix(this.height, ctx),
    };

    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    this.oldBox = calculated;

    return calculated;
  }

  // eslint-disable-next-line vue/require-render-return
  render() {
    if (!this.provider.context) return;

    const ctx = this.provider.context;
    const { oldBox } = this;
    const newBox = this.calculatedBox;

    ctx.beginPath();
    ctx.clearRect(oldBox.x, oldBox.y, oldBox.w, oldBox.h);
    ctx.clearRect(newBox.x, newBox.y - 42, newBox.w, 100);

    ctx.rect(newBox.x, newBox.y, newBox.w, newBox.h);
    ctx.fillStyle = this.color;
    ctx.fill();

    this.drawFloor();

    // ctx.fillStyle = '#000';
    // ctx.font = '28px sans-serif';
    // ctx.textAlign = 'center';
    // ctx.fillText(
    //   Math.floor(this.value),
    //   newBox.x + newBox.w / 2,
    //   newBox.y - 14,
    // );
  }

  drawFloor() {
    const box = this.calculatedBox;
    const ctx = this.provider.context;
    const img = new Image();
    img.src = require('@/assets/map/backgrounds/ground_01.png');
    img.onload = () => {
      ctx.drawImage(img, box.x, box.y, box.w, box.h);
    };
  }
}
</script>
