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

const SingleFileUpload = ({
  file,
  setFile,
  disabled,
  error,
  touched,
  maxSize = 5 * 1024 * 1024,
}) => {
  const [localFile, setLocalFile] = useState(null);

  useEffect(() => {
    setLocalFile(file || null);
  }, [file]);

  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.size > maxSize) {
      alert(`File "${selected.name}" exceeds max size of ${Math.round(maxSize / 1024)} KB`);
      return;
    }

    try {
      const { uploadUrl, fileUrl } = await getPresignedUrl(selected, "your-folder-name");
      await uploadFileToS3(selected, uploadUrl);
      setFile(fileUrl);
      setLocalFile(fileUrl);
    } catch (err) {
      console.error("Upload failed:", err);
    }

    e.target.value = "";
  };

  const handleRemove = () => {
    setFile(null);
    setLocalFile(null);
  };

  return (
    <div className="flex flex-col gap-2">
      {!localFile && (
        <input
          type="file"
          accept="image/*,application/pdf"
          disabled={disabled}
          onChange={handleFileChange}
          className="bg-[#f0f7f1] rounded-md file:bg-[#daf7d9] file:text-green file:border-none file:px-4 file:py-2 file:rounded-md file:cursor-pointer"
        />
      )}

      {localFile && (
        <div className="flex items-center justify-between p-3 border rounded-md">
          <div className="flex items-center gap-3">
            <a href={localFile} target="_blank" rel="noopener noreferrer">
              <FileIconWithExt fileName={getFileNameFromUrl(localFile)} />
            </a>
            <a
              href={localFile}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-green hover:underline"
            >
              {getFileNameFromUrl(localFile)}
            </a>
          </div>
          <button type="button" onClick={handleRemove} disabled={disabled}>
            <LuTrash2 className="w-5 h-5 text-gray-600 hover:text-red-500" />
          </button>
        </div>
      )}

      {touched && error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default SingleFileUpload;
