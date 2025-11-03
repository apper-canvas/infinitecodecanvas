import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import PenGrid from "@/components/organisms/PenGrid";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { usePenSearch } from "@/hooks/usePens";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { results, loading, error, search } = usePenSearch();
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (query) {
      search(query);
      setHasSearched(true);
    }
  }, [query, search]);

  const handleSearch = (newQuery) => {
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full flex items-center justify-center">
              <ApperIcon name="Search" className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-secondary-400 to-primary-400 bg-clip-text text-transparent">
              Search Pens
            </h1>
          </div>
          
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar 
              onSearch={handleSearch} 
              placeholder="Search by title or author..."
            />
          </div>

          {query && (
            <p className="text-slate-400 text-lg">
              {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
            </p>
          )}
        </motion.div>

        {loading ? (
          <Loading type="cards" />
        ) : error ? (
          <Error message={error} onRetry={() => search(query)} />
        ) : !hasSearched ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <ApperIcon name="Search" className="w-12 h-12 text-slate-500" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-300 mb-4">Start Searching</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Enter a search term above to find pens by title or author name
            </p>
          </div>
        ) : results.length === 0 ? (
          <Empty 
            title={`No results for "${query}"`}
            description="Try adjusting your search terms or create your own pen"
            actionText="Create New Pen"
            actionLink="/editor"
          />
        ) : (
          <PenGrid pens={results} />
        )}
      </div>
    </div>
  );
};

export default SearchPage;