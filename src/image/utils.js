import { v4 as uuid } from "uuid";
import {
  UPLOAD_URL,
  FETCH_INLINE_IMAGE_URL,
  PHOTO_LOADING_SRC,
} from "./constants";

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
    return { width, height };
  }
}

const getImageBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);

    reader.onerror = (e) => reject(e);

    reader.readAsDataURL(file);
  });
};

const mockTimeout = async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });
};

export const uploadInlineImages = async (editor, files) => {
  const images = [...files].map((file) => {
    const id = uuid();
    // insert placeholder image
    editor.selection.setNode(
      editor.dom.create("img", {
        src: PHOTO_LOADING_SRC,
        id,
        width: 100,
        height: 100,
      })
    );
    return { file, id };
  });

  await mockTimeout();

  images.forEach(({ file, id }) => {
    const src = URL.createObjectURL(file);
    Promise.all([image_upload_handler(file), getUploadImageSize(src)])
      .then(([res, size]) => {
        // replace the placeholder image with the actual image
        editor.dom.setAttribs(id, {
          ...size,
          src,
          cid: res.id,
          file: file.name,
        });
      })
      .catch((err) => {
        // remove placeholder image if upload failed
        editor.dom.remove(id);
      });
  });
};

export const loadInlineImage = async (node) => {
  try {
    const cid = node.getAttribute("data-cid");
    const res = await fetch(`${FETCH_INLINE_IMAGE_URL}/${cid}`);
    await mockTimeout();
    const fileBlob = await res.blob();
    const src = URL.createObjectURL(fileBlob);
    node.setAttribute("src", src);
    node.setAttribute("data-mce-src", src);
    node.setAttribute("cid", cid);
    node.removeAttribute("data-cid");
  } catch (err) {
    console.log(err);
  }
};

export const loadExternalImage = (node) => {
  const dataSrc = node.getAttribute("data-src");
  node.removeAttribute("data-src");
  node.setAttribute("src", dataSrc);
  node.setAttribute("data-mce-src", dataSrc);
};

export const uploadBase64Images = async (editor, files) => {
  const images = await Promise.all(
    [...files].map((file) => {
      const src = URL.createObjectURL(file);
      return Promise.all([getUploadImageSize(src), getImageBase64(file)]);
    })
  );

  images.forEach(([size, src]) => {
    editor.selection.setNode(
      editor.dom.create("img", {
        src,
        ...size,
      })
    );
  });
};
