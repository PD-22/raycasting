const WOLFCOLOR = JSON.stringify([152, 0, 136, 255]);

function wolfenFilter(texture) {
  return texture.map(row => row.map(color =>
    JSON.stringify(color) == WOLFCOLORGB ? -1 : color
  ));
}

function loadTxtr_src(src) {
  return new Promise(res => {
    let image = document.createElement('img');
    image.src = src;
    image.onload = () => res(matrixFromImage(image))
  })
}

function loadTxtrs_sel() {
  let input = document.createElement('input');
  document.body.appendChild(input);
  input.setAttribute('type', 'file');
  input.setAttribute('multiple', 'true');
  let promise = new Promise(resolve => {
    input.addEventListener("change", e => {
      resolve(finishLoad(input.files))
    });
  });
  input.click();
  input.remove();
  return promise;
}

function loadTxtr_sel() {
  return new Promise(resolve => {
    loadTxtrs_sel().then(t => resolve(t[0]));
  })
}

function pickTexTile(x, y, w, h) {
  return new Promise(resolve => {
    loadTxtr_sel().then(t => {
      let result = t.slice(h * y, h * (y + 1))
        .map(e => e.slice(w * x, w * (x + 1)))
      resolve(result);
    })
  })
}

function finishLoad(files) {
  files = Array.from(files)
  let promises = [];
  files.forEach(file => {
    promises.push(new Promise(res => {
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        let image = document.createElement('img');
        image.src = reader.result;
        image.onload = () => res(matrixFromImage(image))
      });
      reader.readAsDataURL(file);
    }))
  })
  return Promise.all(promises);
}

function matrixFromImage(image) {
  let width = image.width;
  let height = image.height;
  let canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  let cx = canvas.getContext("2d");
  cx.drawImage(image, 0, 0);
  let pixels = [];
  let { data } = cx.getImageData(0, 0, width, height);

  for (let i = 0; i < data.length; i += 4) {
    let rgba = Array.from(data.slice(i, i + 4));
    pixels.push(rgba);
  }

  let matrix = new Array(height);
  for (let y = 0; y < height; y++) {
    matrix[y] = new Array(width);
    for (let x = 0; x < width; x++) {
      matrix[y][x] = pixels[x + width * y];
    }
  }
  return matrix;
}

function wolfenFilter(txtr) {
  let filt = JSON.stringify([152, 0, 136]);
  return txtr.map(r => r.map(c => {
    if (JSON.stringify(c.slice(0, 3)) == filt) return -1;
    return c
  }))
}