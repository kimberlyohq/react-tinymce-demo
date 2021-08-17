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

const LoadingImage = (id) => {
  return `<p><img id=${id} src='https://assets.easilydo.com/onmail/photo-loading.png' width=100 height=100 /></p>`;
};

export const insertImages = (editor, files) => {
  [...files].forEach(async (file) => {
    const src = URL.createObjectURL(file);
    const id = uuid();
    try {
      const placeholder = `${LoadingImage(id)}`;
      editor.execCommand("mceInsertContent", false, {
        content: placeholder,
      });

      const res = await image_upload_handler(file);
      const size = await getUploadImageSize(src);

      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });

      const cid = res.id;
      if (cid && size) {
        editor.dom.setAttribs(id, {
          src: src,
          file: file.name,
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

export const loadInlineImage = (editor) => {
  const inlineImagesNodes = editor.dom.select("img").filter((node) => {
    const src = node.getAttribute("src");
    return src.startsWith("cid:");
  });

  if (inlineImagesNodes.length === 0) {
    return;
  }
  inlineImagesNodes.forEach(async (node) => {
    const src = node.getAttribute("src");
    const cid = src.slice(4);
    await fetchInlineImage(node, cid);
  });
};

const fetchInlineImage = async (node, cid) => {
  try {
    const res = await fetch(`${FETCH_INLINE_IMAGE_URL}/${cid}`);
    const fileBlob = await res.blob();
    const src = URL.createObjectURL(fileBlob);
    node.setAttribute("src", src);
    node.setAttribute("data-mce-src", src);
  } catch (err) {
    console.log(err);
  }
};
