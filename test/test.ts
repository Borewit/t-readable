import { tee } from '../lib';
import { assert } from 'chai';
import { StreamGenerator } from './stream-generator';
import { Readable } from 'stream';
const got = require('got');

async function countBytes(readable: Readable): Promise<number> {
  let bytesRead = 0;

  return new Promise<number>((resolve, reject) => {
    readable.on('data', chunk => {
      bytesRead += chunk.length;
    });
    readable.on('end', () => {
      resolve(bytesRead);
    });
    readable.on('error', error => {
      reject(error);
    });
  });
}

describe('t-readable', () => {

  it('should be able create 2 identical streams', async () => {

    const dataLength = 1024 * 1024;

    const streamGenerator = new StreamGenerator(dataLength);
    const outputs = tee(streamGenerator, 2);
    const counts = await Promise.all<number>(outputs.map(readable => countBytes(readable)));
    assert.deepEqual(counts, [dataLength, dataLength], 'counts');
  });

  it('example', async () => {

    const url = 'https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg';

    const stream = got.stream(url);
    const teedStreams = tee(stream);
    const counts = await Promise.all<number>(teedStreams.map(readable => countBytes(readable)));
    console.log('Counts: ' + counts.join(', '));
  })
});
