import React, { useState, useRef } from 'react';

export default function FileUploader() {
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files).map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      preview: ['jpg', 'jpeg', 'png', 'gif'].includes(file.name.split('.').pop().toLowerCase()),
      size:
        file.size > 1024
          ? file.size > 1048576
            ? Math.round(file.size / 1048576) + 'mb'
            : Math.round(file.size / 1024) + 'kb'
          : file.size + 'b',
    }));
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div>
        {/* icons */}
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

        {/* Preview image here */}
        <div id="preview" className="my-4 flex">
          {images.map((image, index) => (
            <div key={index} className="relative w-32 h-32 object-cover rounded">
              {image.preview ? (
                <>
                  <img src={image.url} className="w-32 h-32 object-cover rounded" alt={image.name} />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="w-6 h-6 absolute text-center flex items-center top-0 right-0 m-2 text-white text-lg bg-red-500 hover:text-red-700 hover:bg-gray-100 rounded-full p-1"
                  >
                    <span className="mx-auto">×</span>
                  </button>
                  <div className="text-xs text-center p-2">{image.size}</div>
                </>
              ) : (
                <>
                  <svg
                    className="fill-current w-32 h-32 ml-auto pt-1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15 2v5h5v15h-16v-20h11zm1-2h-14v24h20v-18l-6-6z" />
                  </svg>
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="w-6 h-6 absolute text-center flex items-center top-0 right-0 m-2 text-white text-lg bg-red-500 hover:text-red-700 hover:bg-gray-100 rounded-full p-1"
                  >
                    <span className="mx-auto">×</span>
                  </button>
                  <div className="text-xs text-center p-2">{image.size}</div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
  );
}
