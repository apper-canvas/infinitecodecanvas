import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import PenStats from "@/components/molecules/PenStats";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { usePen } from "@/hooks/usePen";
import { formatDistanceToNow } from "date-fns";

const PenDetailPage = () => {
  const { id } = useParams();
  const { pen, loading, error, loadPen } = usePen(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Error message={error} onRetry={() => loadPen(id)} />
      </div>
    );
  }

  if (!pen) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Error message="Pen not found" />
      </div>
    );
  }

  const handleFork = () => {
    const forkedPenData = {
      title: `Fork of ${pen.title}`,
      html: pen.html,
      css: pen.css,
      javascript: pen.javascript
    };
    
    // Store in localStorage for the editor to pick up
    localStorage.setItem("pendingFork", JSON.stringify(forkedPenData));
    window.open("/editor", "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        className="border-b border-slate-700 bg-surface/30 backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                <ApperIcon name="ArrowLeft" className="w-5 h-5" />
              </Link>
              
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-200 mb-2">
                  {pen.title}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Avatar 
                      src={pen.author?.avatar} 
                      alt={pen.author?.name}
                      size="default"
                    />
                    <span className="text-slate-300">{pen.author?.name}</span>
                  </div>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-500 text-sm">
                    {formatDistanceToNow(new Date(pen.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <PenStats 
                views={pen.views}
                likes={pen.likes}
                onLike={() => {}}
              />
              
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={handleFork}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="GitFork" className="w-4 h-4" />
                  Fork
                </Button>
                
                <Link to={`/editor/${pen.Id}`}>
                  <Button className="flex items-center gap-2">
                    <ApperIcon name="Edit" className="w-4 h-4" />
                    Edit
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Preview */}
          <div className="order-2 lg:order-1">
            <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
                <h2 className="text-sm font-medium text-slate-300 uppercase tracking-wide">
                  Result
                </h2>
                <div className="flex space-x-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <iframe
                title="Pen Preview"
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <style>${pen.css}</style>
                    </head>
                    <body>
                      ${pen.html}
                      <script>${pen.javascript}</script>
                    </body>
                  </html>
                `}
                className="w-full h-[500px] bg-white"
                frameBorder="0"
                sandbox="allow-scripts"
              />
            </div>
          </div>

          {/* Code */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* HTML */}
            {pen.html && (
              <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-slate-800 border-b border-slate-700">
                  <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide">
                    HTML
                  </h3>
                </div>
                <pre className="p-4 text-sm font-mono text-slate-300 overflow-x-auto max-h-40">
                  <code>{pen.html}</code>
                </pre>
              </div>
            )}

            {/* CSS */}
            {pen.css && (
              <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-slate-800 border-b border-slate-700">
                  <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide">
                    CSS
                  </h3>
                </div>
                <pre className="p-4 text-sm font-mono text-slate-300 overflow-x-auto max-h-40">
                  <code>{pen.css}</code>
                </pre>
              </div>
            )}

            {/* JavaScript */}
            {pen.javascript && (
              <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-slate-800 border-b border-slate-700">
                  <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide">
                    JavaScript
                  </h3>
                </div>
                <pre className="p-4 text-sm font-mono text-slate-300 overflow-x-auto max-h-40">
                  <code>{pen.javascript}</code>
                </pre>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PenDetailPage;