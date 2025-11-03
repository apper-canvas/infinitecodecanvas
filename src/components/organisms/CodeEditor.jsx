import { useState, useEffect } from "react";
import CodePanel from "@/components/molecules/CodePanel";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const CodeEditor = ({ pen, onSave, onTitleChange }) => {
  const [html, setHtml] = useState(pen?.html || "");
  const [css, setCss] = useState(pen?.css || "");
  const [javascript, setJavascript] = useState(pen?.javascript || "");
  const [title, setTitle] = useState(pen?.title || "Untitled Pen");

  // Auto-save functionality
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (html || css || javascript) {
        const penData = {
          title,
          html,
          css,
          javascript
        };
        if (onSave) {
          onSave(penData);
        }
      }
    }, 2000);

    return () => clearTimeout(saveTimer);
  }, [html, css, javascript, title, onSave]);

  const handleSave = () => {
    const penData = {
      title,
      html,
      css,
      javascript
    };
    if (onSave) {
      onSave(penData);
      toast.success("Pen saved successfully!");
    }
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (onTitleChange) {
      onTitleChange(newTitle);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="text-xl font-semibold bg-transparent text-slate-200 border-none outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1"
            placeholder="Enter pen title..."
          />
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <ApperIcon name="Save" className="w-4 h-4" />
          Save
        </Button>
      </div>

      {/* Editor Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 p-4 overflow-hidden">
        <CodePanel
          title="HTML"
          code={html}
          onChange={setHtml}
          language="html"
          className="min-h-0"
        />
        <CodePanel
          title="CSS"
          code={css}
          onChange={setCss}
          language="css"
          className="min-h-0"
        />
        <CodePanel
          title="JavaScript"
          code={javascript}
          onChange={setJavascript}
          language="javascript"
          className="min-h-0"
        />
        <div className="flex flex-col bg-slate-900 border border-slate-700 rounded-lg overflow-hidden min-h-0">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
            <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide">Result</h3>
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>
          <iframe
            title="Code Preview"
            srcDoc={`
              <!DOCTYPE html>
              <html>
                <head>
                  <style>${css}</style>
                </head>
                <body>
                  ${html}
                  <script>${javascript}</script>
                </body>
              </html>
            `}
            className="flex-1 w-full bg-white"
            frameBorder="0"
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;