export const UPLOAD_URL = "http://localhost:8000/attachment/upload";

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

      if (!json || typeof json.location != "string") {
        reject("Invalid JSON: " + xhr.responseText);
        return;
      }
      // set the src of the image
      // update the cid of the file
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

export const insertImages = (editor, files) => {
  [...files].forEach(async (file) => {
    const src = URL.createObjectURL(file);
    console.log(src);
    try {
      const json = await image_upload_handler(file);
      const cid = json.id;
    } catch (err) {
      console.log(err);
    }
    editor.execCommand("mceInsertContent", false, {
      content: `<img src=${src} />`,
    });
  });
};
