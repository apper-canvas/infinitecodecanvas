import { useState } from "react";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ onSearch, placeholder = "Search pens..." }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-md">
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" 
        />
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          className="pl-10 pr-4"
        />
      </div>
    </form>
  );
};

export default SearchBar;