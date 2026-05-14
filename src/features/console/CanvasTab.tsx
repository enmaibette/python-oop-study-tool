import { useEffect, useRef } from 'react';
import { useWorkerStore } from '@/stores/workerStore.ts';
import { useUIStore } from '@/stores/uiStore';


type GfxMsg =
  | { type: 'gfx'; cmd: 'drawLine'; args: [number, number, number, number, string] }
  | { type: 'gfx'; cmd: 'drawImage'; args: [ArrayBuffer, number, number, number | undefined, number | undefined] }
  | { type: 'gfx'; cmd: 'clear'; args: [] };

type GfxRedraw =
  | { type: 'gfx'; cmd: 'drawLine'; args: [number, number, number, number, string] }
  | { type: 'gfx'; cmd: 'drawImage'; args: [ImageBitmap, number, number, number | undefined, number | undefined] };

export function CanvasTab({ clearKey }: { clearKey: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worker = useWorkerStore((state) => state.worker);
  const commandsRef = useRef<GfxRedraw[]>([]);
  const canvasClearKey = useUIStore((state) => state.canvasClearKey);

  useEffect(() => {
    commandsRef.current = [];
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }, [clearKey, canvasClearKey]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const handlers = {
      drawLine: (x1: number, y1: number, x2: number, y2: number, color: string) => {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      },
      drawImage: (image: ImageBitmap, dx: number, dy: number, dWidth?: number, dHeight?: number) => {
        if (dWidth != null && dHeight != null) {
          ctx.drawImage(image, dx, dy, dWidth, dHeight);
        } else {
          ctx.drawImage(image, dx, dy);
        }
      },
    };

    // redraw all commands to redraw the canvas after a resize
    const redraw = () => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      commandsRef.current.forEach((msg) => {
        const fn = handlers[msg.cmd] as (...args: unknown[]) => void;
        fn?.(...msg.args);
      });
    };

    const onMessage = async (e: MessageEvent<GfxMsg>) => {
      if (e.data.type !== 'gfx') return;
      if (e.data.cmd === 'clear') {
        commandsRef.current = [];
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        return;
      }
      if (e.data.cmd === 'drawImage') {
        const [buffer, dx, dy, dWidth, dHeight] = e.data.args;
        const bitmap = await createImageBitmap(new Blob([buffer]));
        const cmd: GfxRedraw = { type: 'gfx', cmd: 'drawImage', args: [bitmap, dx, dy, dWidth, dHeight] };
        commandsRef.current.push(cmd);
        handlers.drawImage(bitmap, dx, dy, dWidth, dHeight);
        return;
      }
      commandsRef.current.push(e.data);
      const fn = handlers[e.data.cmd] as (...args: unknown[]) => void;
      fn?.(...e.data.args);
    };

    worker?.addEventListener('message', onMessage);

    const canvas = canvasRef.current!;
    const parent = canvas.parentElement!;
    const ro = new ResizeObserver(() => {
      const { width, height } = canvas.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      canvas.width = width;
      canvas.height = height;
      redraw();
    });
    ro.observe(parent);

    return () => {
      worker?.removeEventListener('message', onMessage);
      ro.disconnect();
    };
  }, [worker]);

  return <canvas ref={canvasRef} width={300} height={200} className={'bg-white w-full h-full'} />;
}
