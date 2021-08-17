import { v4 as uuid } from "uuid";
export const UPLOAD_URL = "http://localhost:8000/attachment/upload";
export const FETCH_INLINE_IMAGE_URL = "http://localhost:8000/attachment";

export const image_upload_handler = (file) => {
  return new Promise((resolve, reject) => {
    let xhr, formData;

    xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open("POST", UPLOAD_URL);

    xhr.upload.onprogress = function (e) {
      console.log((e.loaded / e.total) * 100);
    };

    xhr.onload = function () {
      let json;

      if (xhr.status === 403) {
        reject("HTTP Error: " + xhr.status, { remove: true });
        return;
      }

      if (xhr.status < 200 || xhr.status >= 300) {
        reject("HTTP Error: " + xhr.status);
        return;
      }

      json = JSON.parse(xhr.responseText);

      if (!json) {
        reject("Invalid JSON: " + xhr.responseText);
        return;
      }

      resolve(json);
    };

    xhr.onerror = function () {
      reject(
        "Image upload failed due to a XHR Transport error. Code: " + xhr.status
      );
    };

    formData = new FormData();
    formData.append("file", file);

    xhr.send(formData);
  });
};

export const getUploadImageSize = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function () {
      resolve(getBestFitSize({ width: this.width, height: this.height }));
    };
    img.onerror = (e) => reject(e);
    img.src = src;
  });
};

const SIZE_BEST_FIT = 472;

function getBestFitSize({ width, height }) {
  const ratio = width / height;

  if (width > SIZE_BEST_FIT || height > SIZE_BEST_FIT) {
    if (ratio > 1) {
      return { width: SIZE_BEST_FIT, height: SIZE_BEST_FIT / ratio };
    } else {
      return { width: ratio * SIZE_BEST_FIT, height: SIZE_BEST_FIT };
    }
  } else {
    return { width: width, height: height };
  }
}

export const insertImages = (editor, files) => {
  [...files].forEach(async (file) => {
    const src = URL.createObjectURL(file);
    const id = uuid();
    try {
      const element = `<p><img id=${id} src='https://assets.easilydo.com/onmail/photo-loading.png' alt=${file.name} width=100 height=100 /></p>`;
      editor.execCommand("mceInsertContent", false, {
        content: element,
      });

      const res = await image_upload_handler(file);
      const size = await getUploadImageSize(src);
      const cid = res.id;
      if (cid && size) {
        editor.dom.setAttribs(id, {
          src: src,
          width: size.width,
          height: size.height,
          cid: cid,
        });
      }
    } catch (err) {
      console.log(err);
    }
  });
};

export const loadInlineImage = async (editor) => {
  // TODO: FIX data-cid
  const nodes = editor.dom.select("img[data-cid]");
  nodes.forEach(async (node) => {
    try {
      const cid = node.getAttribute("data-cid");
      const res = await fetch(`${FETCH_INLINE_IMAGE_URL}/${cid}`);
      const fileBlob = await res.blob();
      const src = URL.createObjectURL(fileBlob);
      nodes[0].setAttribute("src", src);
    } catch (err) {
      console.log(err);
    }
  });
};
