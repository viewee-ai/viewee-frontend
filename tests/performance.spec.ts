import { test, expect } from '@playwright/test';
import fs from 'fs';
import 'dotenv/config';

test('Interview Session Performance Test', async ({ page }) => {
  const metrics: Record<string, number> = {};

  const audioFilePath = './test_audio.m4a';
  const audioData = fs.readFileSync(audioFilePath);

  const title = 'Two Sum';

  const encodedTitle = encodeURIComponent(title);

  await page.goto(`http://localhost:3000/dashboard/interview?title=${encodedTitle}`);

  // Wait for the session ID to be set in the context
  const sessionId = await page.evaluate(() => {
    return new Promise<string>((resolve) => {
      const checkSessionId = () => {
        const sessionContext = (window as any).SessionContext;
        if (sessionContext && sessionContext.sessionId) {
          resolve(sessionContext.sessionId);
        } else {
          setTimeout(checkSessionId, 100);
        }
      };
      checkSessionId();
    });
  });

  console.log(`Session ID: ${sessionId}`);

  const sttStartTime = Date.now();

  // Simulate sending audio data to STT service over WebSocket
  const transcript = await page.evaluate(async ({ audioDataBase64, sessionId }) => {
    return new Promise<string>((resolve, reject) => {
      fetch('/api/stt_token', {
        credentials: 'include',
      })
        .then(async res => {
          console.log('Response status:', res.status);
          const text = await res.text();
          console.log('Response text:', text);
          try {
            const data = JSON.parse(text);
            return data.token;
          } catch (error) {
            reject(new Error(`Failed to parse JSON: ${error.message}`));
          }
        })
        .then(token => {
          const socket = new WebSocket(
            'wss://api.deepgram.com/v1/listen?model=nova-2-conversationalai&smart_format=true&punctuate=true&interim_results=false',
            ['token', token]
          );

          socket.binaryType = 'arraybuffer';

          socket.onopen = () => {
            // Decode base64 audio data
            const binaryData = Uint8Array.from(atob(audioDataBase64), c => c.charCodeAt(0));
            socket.send(binaryData);
            socket.send(new Uint8Array(0)); // Send zero-byte message to indicate end
          };

          socket.onmessage = event => {
            const data = JSON.parse(event.data);
            if (data.is_final) {
              socket.close();
              resolve(data.channel.alternatives[0].transcript);
            }
          };

          socket.onerror = err => {
            reject(err);
          };
        })
        .catch(reject);
    });
  }, { audioDataBase64: audioData.toString('base64'), sessionId });

  metrics.transcriptionTime = Date.now() - sttStartTime;
  console.log(`Transcription Time: ${metrics.transcriptionTime}ms`);

  // Measure backend processing time
  const backendStartTime = Date.now();

  const userCodeSample = `
def two_sum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
`;

  const feedback = await page.evaluate(
    async ({ transcript, code, sessionId }) => {
      const response = await fetch('http://localhost:8000/api/incremental-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          transcript,
          code,
          status: 'Thinking',
        }),
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Failed to fetch feedback: ${response.status} - ${responseText}`);
      }

      const data = await response.json();
      return data.feedback;
    },
    { transcript, code: userCodeSample, sessionId }
  );

  metrics.backendProcessingTime = Date.now() - backendStartTime;
  console.log(`Backend Processing Time: ${metrics.backendProcessingTime}ms`);

  // Measure TTS conversion time
  const ttsStartTime = Date.now();

  // Receive TTS audio over WebSocket
  const ttsAudioDuration = await page.evaluate(async ({ sessionId }) => {
    return new Promise<number>((resolve, reject) => {
      const ttsSocket = new WebSocket(`ws://localhost:8000/ws/tts?session_id=${sessionId}`);
      ttsSocket.binaryType = 'arraybuffer';

      const audioChunks: ArrayBuffer[] = [];

      ttsSocket.onmessage = event => {
        audioChunks.push(event.data);
      };

      ttsSocket.onclose = () => {
        // Combine audio chunks and decode
        const totalLength = audioChunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
        const combined = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of audioChunks) {
          combined.set(new Uint8Array(chunk), offset);
          offset += chunk.byteLength;
        }

        // Create a Blob and use Audio to play it
        const blob = new Blob([combined.buffer], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.onloadedmetadata = () => {
          resolve(audio.duration * 1000); // Duration in milliseconds
        };
        audio.onerror = reject;
      };

      ttsSocket.onerror = err => {
        reject(err);
      };
    });
  }, { sessionId });

  metrics.ttsConversionTime = Date.now() - ttsStartTime;
  console.log(`TTS Conversion Time: ${metrics.ttsConversionTime}ms`);
  console.log(`Feedback Audio Duration: ${ttsAudioDuration}ms`);

  console.log('Performance Metrics:', metrics);

  expect(metrics.transcriptionTime).toBeLessThan(5000); 
  expect(metrics.backendProcessingTime).toBeLessThan(3000);
  expect(metrics.ttsConversionTime).toBeLessThan(3000);
});