export const UPLOAD_URL = "http://localhost:8000/attachment/upload";

export function image_upload_handler(blobInfo, success, failure, progress) {
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
      failure("HTTP Error: " + xhr.status, { remove: true });
      return;
    }

    if (xhr.status < 200 || xhr.status >= 300) {
      failure("HTTP Error: " + xhr.status);
      return;
    }

    json = JSON.parse(xhr.responseText);

    if (!json || typeof json.location != "string") {
      failure("Invalid JSON: " + xhr.responseText);
      return;
    }
    // set the src of the image
    // update the cid of the file
    // success(json.location);
  };

  xhr.onerror = function () {
    failure(
      "Image upload failed due to a XHR Transport error. Code: " + xhr.status
    );
  };

  formData = new FormData();
  formData.append("file", blobInfo.blob(), blobInfo.filename());

  xhr.send(formData);
}

export const insertImages = (editor, files) => {
  [...files].forEach((file) => {
    const src = URL.createObjectURL(file);
    console.log(src);
    editor.execCommand("mceInsertContent", false, {
      content: `<img src=${src} />`,
    });
  });
};
