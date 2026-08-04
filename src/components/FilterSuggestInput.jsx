import React, { useEffect, useRef, useState } from "react";

const FilterSuggestInput = ({
  label,
  value = "",
  onChange,
  options = [],
  fetchSuggestions,
  placeholder = "Type to search...",
  error,
  minChars = 0,
  maxSuggestions = 8,
  disabled = false,
  endAdornment = null,
  inputClassName = "",
  syncOnType = false,
  matchOnType = false,
}) => {
  const [inputText, setInputText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!value) {
      setInputText("");
      return;
    }

    const matchedOption = options.find((option) => option.value === value);
    if (matchedOption) {
      setInputText(matchedOption.label);
    }
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filterLocalOptions = (query) => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return options.filter((option) => option.value).slice(0, maxSuggestions);
    }

    return options
      .filter(
        (option) =>
          option.value &&
          option.label.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, maxSuggestions);
  };

  const loadSuggestions = async (query) => {
    if (disabled) return;

    if (fetchSuggestions) {
      if (query.trim().length < minChars) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setLoading(true);
      try {
        const results = await fetchSuggestions(query.trim());
        setSuggestions(results.slice(0, maxSuggestions));
        setShowSuggestions(results.length > 0);
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setLoading(false);
      }
      return;
    }

    const filtered = filterLocalOptions(query);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const commitTypedValue = (query) => {
    const trimmed = query.trim();

    if (!trimmed) {
      onChange("", "");
      return;
    }

    if (matchOnType) {
      const matchedOption = options.find(
        (option) =>
          option.label.toLowerCase() === trimmed.toLowerCase() ||
          String(option.value).toLowerCase() === trimmed.toLowerCase()
      );
      onChange(matchedOption?.value || "", trimmed);
      return;
    }

    if (syncOnType) {
      onChange(trimmed, trimmed);
    }
  };

  const handleInputChange = (event) => {
    const query = event.target.value;
    setInputText(query);

    if (!query.trim()) {
      onChange("", "");
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (syncOnType || matchOnType) {
        commitTypedValue(query);
      }

      if (fetchSuggestions && query.trim().length < minChars) {
        const filtered = filterLocalOptions(query);
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
        return;
      }

      loadSuggestions(query);
    }, syncOnType ? 500 : 300);
  };

  const handleFocus = () => {
    if (disabled) return;

    if (fetchSuggestions && inputText.trim().length >= minChars) {
      loadSuggestions(inputText);
      return;
    }

    const filtered = filterLocalOptions(inputText);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const handleSelect = (option) => {
    setInputText(option.label);
    onChange(option.value, option.label);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      {label ? (
        <label className="text-gray-400 text-sm mb-2 block">{label}</label>
      ) : null}

      <div className="relative">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className={`w-full bg-[#081A33] border border-[#163760] rounded-full px-5 py-3 text-white outline-none disabled:opacity-60 ${endAdornment ? "pr-12" : ""} ${inputClassName}`}
        />
        {endAdornment ? (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">{endAdornment}</div>
        ) : null}
      </div>

      {showSuggestions ? (
        <ul className="absolute z-50 left-0 right-0 mt-2 max-h-56 overflow-y-auto rounded-2xl border border-[#163760] bg-[#081A33] shadow-xl">
          {loading ? (
            <li className="px-4 py-3 text-sm text-gray-400">Loading suggestions...</li>
          ) : suggestions.length === 0 ? (
            <li className="px-4 py-3 text-sm text-gray-400">No suggestions found</li>
          ) : (
            suggestions.map((option) => (
              <li key={`${option.value}-${option.label}`}>
                <button
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="w-full px-4 py-3 text-left text-sm text-white hover:bg-[#163760] transition flex items-center gap-3"
                >
                  {option.image ? (
                    <img
                      src={option.image}
                      alt={option.label}
                      className="w-8 h-10 object-cover rounded"
                      loading="lazy"
                    />
                  ) : null}
                  <span>{option.label}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}

      {error ? <p className="text-red-400 text-sm mt-2">{error}</p> : null}
    </div>
  );
};

export default FilterSuggestInput;
