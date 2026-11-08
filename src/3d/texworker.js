/* Texture worker: rasterises the expensive procedural textures off the main thread.
   Imports tex.js only — no three.js, no DOM — so this bundle stays small. */
import * as TX from './tex.js';

TX.setRaw(true);

self.onmessage = e => {
  const {scale, jobs} = e.data || {};
  if (typeof scale === 'number') TX.setTexScale(scale);
  for (const job of jobs || []){
    let raster = null;
    try {
      const fn = TX.RASTERISED[job.name];
      if (fn) raster = fn.apply(null, job.args);
    } catch (err){ raster = null; }
    if (!raster){ self.postMessage({key: job.key, raster: null}); continue; }
    // Transfer the pixel buffers so the main thread gets them without a copy.
    const transfer = [raster.col.buffer];
    if (raster.rgh) transfer.push(raster.rgh.buffer);
    if (raster.nrm) transfer.push(raster.nrm.buffer);
    self.postMessage({key: job.key, raster}, transfer);
  }
};
