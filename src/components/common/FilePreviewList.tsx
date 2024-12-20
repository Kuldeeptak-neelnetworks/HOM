import React from "react";
import PDF from "../../asset/images/pdf.png";
import XLSX from "../../asset/images/xlsx.png";
import WORD from "../../asset/images/word.png";
import VIDEO from "../../asset/images/video.png";
import Logo from "../../asset/images/companydummylog.png";

interface FilePreviewListProps {
  files: string[];
}

// const fileIcons: Record<string, string> = {
//   pdf: PDFPic,
//   word: WORDPic,
//   xlsx: XLSXPic,
//   video: VIDEO,
//   image: "", // Provide a default image placeholder if necessary
// };

const PDFPic = PDF.src;
const XLSXPic = XLSX.src;
const VIDEOPic = VIDEO.src;
const WORDPic = WORD.src;
const companyLogo = Logo.src;

const getFileType = (fileExtension: string) => {
  switch (fileExtension) {
    case "pdf":
      return "pdf";
    case "jpg":
    case "jpeg":
    case "png":
      return "image";
    case "xlsx":
      return "xlsx";
    case "mp4":
      return "video";
    case "docx":
      return "word";
    default:
      return "unknown";
  }
};

const FilePreviewList: React.FC<FilePreviewListProps> = ({ files }) => {
  return (
    <div className="flex gap-4">
      {files &&
        files.map((file: string, index: number) => {
          const fileExtension = file.split(".").pop()?.toLowerCase() || "";
          const fileType = getFileType(fileExtension);

          let content;

          switch (fileType) {
            case "pdf":
              content = (
                <div className="flex flex-col items-center justify-center h-[100px] w-[100px] bg-gray-200 rounded-md relative">
                  <a href={file} target="_blank" rel="noopener noreferrer">
                    <img
                      //   src={fileIcons[fileType]}
                      src={PDFPic}
                      alt="PDF"
                      className="h-[100px] w-[100px] object-cover rounded"
                    />
                  </a>
                  {/* <iframe
                    src={file}
                    width="100"
                    height="119"
                    className="border rounded"
                  ></iframe>
                  <a
                    href={file}
                    download
                    className="block text-center mt-1 text-sm transition text-transparent absolute hover:text-black hover:font-bold hover:bg-gray-100 hover:h-full opacity-[0.8] items-center justify-center"
                    target="_blank"
                  >
                    Download PDF
                  </a> */}
                </div>
              );
              break;
            case "image":
              content = (
                <></>
                // <img
                //   key={index}
                //   src={file}
                //   alt="Image"
                //   className="h-[100px] w-[100px] object-cover rounded"
                // />
              );
              break;
            case "word":
              content = (
                <div className="flex items-center justify-center h-[100px] w-[100px] bg-gray-200 rounded-md">
                  <a href={file} target="_blank" rel="noopener noreferrer">
                    <img
                      src={WORDPic}
                      alt={fileType}
                      className="h-[100px] w-[100px] object-cover rounded-md"
                    />
                  </a>
                </div>
              );
              break;
            case "xlsx":
              content = (
                <div className="flex items-center justify-center h-[100px] w-[100px] bg-gray-200 rounded-md">
                  <a href={file} target="_blank" rel="noopener noreferrer">
                    <img
                      src={XLSXPic}
                      alt={fileType}
                      className="h-[100px] w-[100px] object-cover rounded-md"
                    />
                  </a>
                </div>
              );
              break;
            case "video":
              content = (
                <video
                  key={index}
                  src={file}
                  width={200}
                  className="h-[100px]"
                  controls
                />
              );
              break;
            default:
              content = (
                <div className="flex items-center justify-center h-[100px] w-[100px] bg-gray-200 rounded-md">
                  <span className="text-gray-600 text-lg">Unknown</span>
                </div>
              );
              break;
          }

          return (
            <div key={index} className="relative">
              {content}
            </div>
          );
        })}
    </div>
  );
};

export default FilePreviewList;
