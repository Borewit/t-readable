import { Readable } from 'stream';

/**
 * Stream generator
 */
export class StreamGenerator extends Readable {

  private dataLeft: number;

  /**
   * @param size Size in bytes, of number of bytes to stream
   */
  constructor(size: number) {
    super();
    this.dataLeft = size;
  }

  private maxChunkSize = 4096;

  _read(size: number): void {
    const chunkSize = Math.min(size, this.maxChunkSize, this.dataLeft);
    if (chunkSize > 0) {
      const chunk = Buffer.alloc(chunkSize);
      this.dataLeft -= chunkSize;
      this.push(chunk);
    } else {
      this.push(null);
    }
  }
}
