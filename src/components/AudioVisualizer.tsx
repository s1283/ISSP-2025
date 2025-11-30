import React, { useEffect, useRef } from 'react';
import './AudioVisualizer.css';
import { useAudioPlayerContext } from '../context/AudioPlayerContext'; // Import the context hook

interface AudioVisualizerProps {
  // audioElement: HTMLAudioElement | null; // This prop is no longer needed as context provides the audio source
  isPlaying: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Get audioCtx and analyser from the AudioPlayerContext
  const { analyser, audioCtx } = useAudioPlayerContext();

  // The first useEffect that used to create AudioContext and Analyser is now removed
  // as they are provided by the context.
  // The connection of audioElement to analyser is also handled in the AudioPlayerContext.

  useEffect(() => {
    // Check if analyser, canvas, and isPlaying are available
    if (!isPlaying || !analyser || !canvasRef.current || !audioCtx) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      // Ensure context is not suspended when drawing
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(e => console.error("Error resuming AudioContext in visualizer:", e));
      }

      if (!canvasCtx) return;

      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      // Clear canvas
      canvasCtx.fillStyle = 'transparent';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw bars
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height * 0.8;

        // Gradient color
        const hue = (i / bufferLength) * 360;
        canvasCtx.fillStyle = `hsl(${hue}, 70%, 50%)`;

        // Draw bar
        canvasCtx.fillRect(
          x,
          canvas.height - barHeight,
          barWidth - 1,
          barHeight
        );

        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // No need to close audioCtx here as it's managed by the provider
    };
  }, [isPlaying, analyser, audioCtx]); // Depend on analyser and audioCtx from context

  return (
    <div className="audio-visualizer">
      <canvas
        ref={canvasRef}
        width={200}
        height={40}
        className="visualizer-canvas"
      />
    </div>
  );
};

export default AudioVisualizer;