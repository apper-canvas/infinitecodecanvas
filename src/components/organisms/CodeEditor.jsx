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
const [layoutMode, setLayoutMode] = useState('horizontal'); // 'horizontal' or 'vertical'

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
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setLayoutMode(layoutMode === 'horizontal' ? 'vertical' : 'horizontal')}
            variant="ghost"
            className="flex items-center gap-2"
            title={`Switch to ${layoutMode === 'horizontal' ? 'vertical' : 'horizontal'} layout`}
          >
            <ApperIcon 
              name={layoutMode === 'horizontal' ? 'SplitSquareVertical' : 'SplitSquareHorizontal'} 
              className="w-4 h-4" 
            />
            {layoutMode === 'horizontal' ? 'Vertical' : 'Horizontal'}
          </Button>
          <div className="w-px h-6 bg-slate-600 mx-2"></div>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <ApperIcon name="Save" className="w-4 h-4" />
            Save
          </Button>
        </div>
      </div>

      {/* Split-Screen Layout */}
      <div className={`flex-1 flex ${layoutMode === 'horizontal' ? 'flex-col' : 'flex-row'} overflow-hidden`}>
        {/* Code Editors Section */}
        <div className={`${layoutMode === 'horizontal' ? 'h-1/2' : 'w-1/2'} flex flex-col border-b ${layoutMode === 'horizontal' ? 'border-slate-700' : 'border-r border-slate-700'}`}>
          {/* Editor Tabs */}
          <div className="flex border-b border-slate-700 bg-surface/50">
            <div className="flex items-center px-4 py-2 bg-slate-800 border-r border-slate-700">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Code</span>
            </div>
            <div className="flex">
              <div className="px-4 py-2 bg-slate-900 border-r border-slate-700">
                <span className="text-sm font-medium text-orange-400">HTML</span>
              </div>
              <div className="px-4 py-2 bg-slate-900 border-r border-slate-700">
                <span className="text-sm font-medium text-blue-400">CSS</span>
              </div>
              <div className="px-4 py-2 bg-slate-900">
                <span className="text-sm font-medium text-yellow-400">JS</span>
              </div>
            </div>
          </div>

          {/* Three Side-by-Side Editor Panels */}
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 border-r border-slate-700">
              <CodePanel
                title=""
                code={html}
                onChange={setHtml}
                language="html"
                className="h-full border-0 rounded-none"
              />
            </div>
            <div className="flex-1 border-r border-slate-700">
              <CodePanel
                title=""
                code={css}
                onChange={setCss}
                language="css"
                className="h-full border-0 rounded-none"
              />
            </div>
            <div className="flex-1">
              <CodePanel
                title=""
                code={javascript}
                onChange={setJavascript}
                language="javascript"
                className="h-full border-0 rounded-none"
              />
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className={`${layoutMode === 'horizontal' ? 'h-1/2' : 'w-1/2'} flex flex-col bg-slate-900`}>
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