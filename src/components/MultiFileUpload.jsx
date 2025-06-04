import { useEffect, useState } from "react";
import { FiFile } from "react-icons/fi";
import { LuTrash2 } from "react-icons/lu";
import { getPresignedUrl, uploadFileToS3 } from "../api/physioConnect";

const FileIconWithExt = ({ fileName }) => {
  const ext = fileName.split(".").pop()?.toUpperCase() || "FILE";
  return (
    <div className="relative w-12 h-12 bg-[#d4f5d4] rounded-md flex items-center justify-center text-green">
      <FiFile className="w-9 h-9" />
      <span className="absolute bottom-3 right-2 text-[9px] font-bold text-white bg-green px-1.5 rounded-sm">
        {ext}
      </span>
    </div>
  );
};

const getFileNameFromUrl = (url) => url.split("/").pop()?.split("?")[0] || "Unknown";

const MultiFileUpload = ({
  file = [],
  setFile,
  onFilesChange,
  disabled,
  maxFiles = 2,
  maxSize = 5 * 1024 * 1024,
  error,
  touched,
}) => {
  const [localFiles, setLocalFiles] = useState([]);

  useEffect(() => {
    if (Array.isArray(file)) setLocalFiles(file);
  }, [file]);

  useEffect(() => {
    if (onFilesChange) onFilesChange(localFiles);
  }, [localFiles, onFilesChange]);

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter((f) => {
      if (f.size > maxSize) {
        alert(`"${f.name}" exceeds max size of ${Math.round(maxSize / 1024)} KB`);
        return false;
      }
      return true;
    });

    const uploadedUrls = [];

    for (const file of validFiles) {
      try {
        const { uploadUrl, fileUrl } = await getPresignedUrl(file, "your-folder-name");
        await uploadFileToS3(file, uploadUrl);
        uploadedUrls.push(fileUrl);
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }

    const updated = [...localFiles, ...uploadedUrls].slice(0, maxFiles);
    setLocalFiles(updated);
    if (setFile) setFile(updated);

    e.target.value = "";
  };

  const handleRemove = (index) => {
    const updated = localFiles.filter((_, i) => i !== index);
    setLocalFiles(updated);
    if (setFile) setFile(updated);
  };

  return (
    <div className="flex flex-col gap-3">
      {localFiles.length < maxFiles && (
        <input
          type="file"
          accept="image/*,application/pdf"
          disabled={disabled}
          multiple
          onChange={handleFileChange}
          className="text-green bg-[#f0f7f1] rounded-md file:bg-[#daf7d9] file:text-green file:border-none file:px-4 file:py-2 file:rounded-md file:cursor-pointer"
        />
      )}

      {localFiles.map((url, index) => (
        <div key={index} className="flex items-center justify-between p-3 border rounded-md">
          <div className="flex items-center gap-3">
            <a href={url} target="_blank" rel="noopener noreferrer">
              <FileIconWithExt fileName={getFileNameFromUrl(url)} />
            </a>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-green hover:underline"
            >
              {getFileNameFromUrl(url)}
            </a>
          </div>
          <button type="button" onClick={() => handleRemove(index)} disabled={disabled}>
            <LuTrash2 className="w-5 h-5 text-gray-600 hover:text-red-500" />
          </button>
        </div>
      ))}

      <p className="text-sm text-gray-600 mb-2">
        {localFiles.length} / {maxFiles} files uploaded
      </p>

      {touched && error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default MultiFileUpload;
