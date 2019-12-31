import { Readable, PassThrough } from 'stream';

/**
 * Tee given Readable in `count` Readable streams
 * @param readable - Stream to tee
 * @param count - Number of readable streams, default is 2
 * @return Array with count readable streams
 */
export function tee(readable: Readable, count: number = 2): Readable[] {
  const clones: PassThrough[] = [];
  for (let i = 0; i < count; ++i) {
    clones.push(new PassThrough());
  }
  readable.on('data', chunk => {
    clones.forEach(clone => {
      clone.write(chunk);
    });
  });
  readable.on('end', () => {
    clones.forEach(clone => {
      clone.end();
    });
  });
  return clones;
}


