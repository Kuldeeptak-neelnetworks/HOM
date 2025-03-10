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
      return "image";
    case "jpeg":
      return "image";
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
  {
    console.log("files", files);
  }
  return (
    <div
      className={`flex gap-4  ${
        files?.length > 0
          ? "max-w-[80%] border border-t p-1 overflow-x-auto"
          : ""
      } `}
    >
      {files &&
        files.map((file: string, index: number) => {
          // const fileExtension = file.split(".").pop()?.toLowerCase() || "";
          const fileExtension =
            file?.split("/").pop()?.split(".").pop()?.toLowerCase() || "";

          const fileType = getFileType(fileExtension);

          let content;

          switch (fileType) {
            case "pdf":
              content = (
                <div className="flex flex-col items-center justify-center h-[50px] w-[50px] bg-gray-200 relative">
                  <a href={file} target="_blank" rel="noopener noreferrer">
                    <img
                      //   src={fileIcons[fileType]}
                      src={PDFPic}
                      alt="PDF"
                      className="h-[50px] w-[50px] object-cover p-1 "
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
                // <></>
                <div className="flex items-center justify-center h-[50px] w-[50px] bg-gray-200 ">
                  <a href={file} target="_blank" rel="noopener noreferrer">
                    <img
                      key={index}
                      src={file}
                      alt="Image"
                      className="h-[50px] w-[50px] object-cover p-1"
                    />
                  </a>
                </div>
              );
              break;
            case "word":
              content = (
                <div className="flex items-center justify-center h-[50px] w-[50px] bg-gray-200 ">
                  <a href={file} target="_blank" rel="noopener noreferrer">
                    <img
                      src={WORDPic}
                      alt={fileType}
                      className="h-[50px] w-[50px] object-cover p-1"
                    />
                  </a>
                </div>
              );
              break;
            case "xlsx":
              content = (
                <div className="flex items-center justify-center h-[50px] w-[50px] bg-gray-200 ">
                  <a href={file} target="_blank" rel="noopener noreferrer">
                    <img
                      src={XLSXPic}
                      alt={fileType}
                      className="h-[50px] w-[50px] object-cover p-1"
                    />
                  </a>
                </div>
              );
              break;
            case "video":
              content = (
                <div className="flex items-center justify-center h-[50px] w-[135px] bg-gray-200 ">
                  <video
                    key={index}
                    src={file}
                    width={200}
                    className="h-[50px]"
                    controls
                  />
                </div>
              );
              break;
            default:
              content = (
                <div className="flex items-center justify-center h-[50px] w-[50px] bg-gray-200 ">
                  <span className="text-gray-600 text-lg">Unknown</span>
                </div>
              );
              break;
          }

          return (
            <div key={index} className="relative hover:bg-[#607ebd] p-1">
              {content}
            </div>
          );
        })}
    </div>
  );
};

export default FilePreviewList;
