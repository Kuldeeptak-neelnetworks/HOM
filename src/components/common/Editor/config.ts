import { QuillOptionsStatic } from "quill";
import { mentionSource } from "./mentions";

export const toolbarOptions = [
  ["bold", "italic", "underline", "strike"],
  [{ size: ["small", false, "large", "huge"] }],
  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ direction: "rtl" }],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
];

export const editorConfig: QuillOptionsStatic = {
  modules: {
    toolbar: toolbarOptions,
    imageResize: {
      parchment: null, // This will be set in the component
      modules: ["Resize", "DisplaySize"],
    },
    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ["@", "#"],
      source: mentionSource,
      renderItem: (item: { value: string }) => {
        return `<div class="border"> <div class="mention-item p-1 hover:bg-gray-200 rounded-md max-h-[100px] overflow-hidden">
      <span class="mention-title text-blue-500 font-medium">${item.value}</span>
    </div></div>`;
      },
    },
  },
  placeholder: "Compose an epic...",
  theme: "snow",
};
