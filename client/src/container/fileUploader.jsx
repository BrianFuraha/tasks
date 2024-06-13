import React, { useState, useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { TEAlert, TETooltip } from "tw-elements-react";
import { app } from "../firebase";

export default function FileUploader({ setImages, images }) {
  const fileInputRef = useRef(null);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [filePer, setFilePer] = useState(0);

  const handleFileChange = (event) => {
    const filesArray = Array.from(event.target.files);

    filesArray.forEach((file) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFilePer(Math.round(progress));
        },
        (error) => {
          setFileUploadError(true);
          console.error("Upload error: ", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const newImage = {
              url: downloadURL,
              name: file.name,
              preview: ["jpg", "jpeg", "png", "gif"].includes(
                file.name.split(".").pop().toLowerCase()
              ),
              size:
                file.size > 1024
                  ? file.size > 1048576
                    ? Math.round(file.size / 1048576) + "mb"
                    : Math.round(file.size / 1024) + "kb"
                  : file.size + "b",
            };
            setImages((prevImages) => [...prevImages, newImage]);
          });
        }
      );
    });
  };


  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="icons flex text-gray-500 m-2">
        <label id="select-image">
          <svg
            className="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            onClick={() => fileInputRef.current.click()}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
          <input
            hidden
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </label>
      </div>
      {fileUploadError ? (
        <span className=" text-red-700">
          Image Upload Error: Size too large (10mb max) or wrong file format
        </span>
      ) : filePer > 0 && filePer < 100 ? (
        <span className=" text-gray-800">{`Uploading ${filePer}%`}</span>
      ) : filePer == 100 ? (
        <span className=" text-green-700">image successfully uploaded</span>
      ) : (
        ""
      )}
      <div id="preview" className="my-4 flex">
        {images.map((image, index) => (
          <div key={index} className="relative w-32 h-32 object-cover rounded">
            {image.preview ? (
              <>
                <img
                  src={image.url}
                  className="w-32 h-32 object-cover rounded"
                  alt={image.name}
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="w-6 h-6 absolute text-center flex items-center top-0 right-0 m-2 text-white text-lg bg-red-500 hover:text-red-700 hover:bg-gray-100 rounded-full p-1"
                >
                  <span className="mx-auto">×</span>
                </button>
                <div className="text-xs text-center p-2">{image.size}</div>
              </>
            ) : (
              <></>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
