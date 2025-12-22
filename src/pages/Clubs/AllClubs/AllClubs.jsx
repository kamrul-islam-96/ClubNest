import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import {
  MapPin,
  Tag,
  ArrowRight,
  Sparkles,
  LayoutGrid,
  Search,
  Filter,
  X,
  ChevronDown,
  DollarSign,
  Clock,
  Loader,
} from "lucide-react";

export const AllClubs = () => {
  const { user } = use(AuthContext);

  // State for filters and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [membershipFeeFilter, setMembershipFeeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // FIX: Debounce search input
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Get all clubs for categories dropdown
  const { data: allClubsRaw = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["allClubsRaw"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/clubs`);
      if (!res.ok) throw new Error("Failed to fetch clubs");
      return res.json();
    },
  });

  // Extract unique categories
  const uniqueCategories = [
    ...new Set(allClubsRaw.map((club) => club.category).filter(Boolean)),
  ];

  // Main query with filters and sorting
  const {
    data: clubs = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "clubs",
      debouncedSearch, // 🔥 Use debounced search
      selectedCategory,
      selectedSort,
      membershipFeeFilter,
    ],
    queryFn: async () => {
      // Build query parameters
      const params = new URLSearchParams();

      if (debouncedSearch) params.append("search", debouncedSearch);
      if (selectedCategory && selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }

      // FIX: Membership fee filter mapping
      if (membershipFeeFilter !== "all") {
        params.append("membershipFee", membershipFeeFilter);
      }

      // FIX: Sort parameter mapping
      let sortBy = selectedSort;
      let order = "desc";

      switch (selectedSort) {
        case "newest":
          sortBy = "newest";
          order = "desc";
          break;
        case "oldest":
          sortBy = "oldest";
          order = "asc";
          break;
        case "nameAsc":
          sortBy = "nameAsc";
          order = "asc";
          break;
        case "nameDesc":
          sortBy = "nameDesc";
          order = "desc";
          break;
        case "feeLowest":
          sortBy = "feeLowest";
          order = "asc";
          break;
        case "feeHighest":
          sortBy = "feeHighest";
          order = "desc";
          break;
        default:
          sortBy = "newest";
          order = "desc";
      }

      params.append("sortBy", sortBy);
      params.append("order", order);

      console.log("📤 Fetching clubs with params:", params.toString());

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/clubs?${params.toString()}`
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ API Error:", errorText);
        throw new Error(`Failed to fetch clubs: ${res.status}`);
      }

      const data = await res.json();
      console.log("📥 Received clubs:", data.length);
      return data;
    },
    // Optimize performance
    staleTime: 30000, // 30 seconds
    cacheTime: 60000, // 1 minute
  });

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setSelectedCategory("");
    setSelectedSort("newest");
    setMembershipFeeFilter("all");
  };

  // Count active filters
  const activeFiltersCount = [
    debouncedSearch,
    selectedCategory && selectedCategory !== "all",
    selectedSort !== "newest",
    membershipFeeFilter !== "all",
  ].filter(Boolean).length;

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="p-8 bg-[#fcfcfd]">
        {/* Search and Filter Bar Skeleton */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
            <div className="w-48 h-12 bg-gray-200 rounded-xl"></div>
            <div className="w-32 h-12 bg-gray-200 rounded-xl"></div>
          </div>
        </div>

        {/* Clubs Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-[400px] bg-gray-100 rounded-[2.5rem] animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-red-500 p-8">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Failed to load clubs</p>
          <p className="text-sm text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#fcfcfd] min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">
          All <span className="text-blue-600">Clubs</span>
        </h2>
        <p className="text-gray-500 mt-2 font-light">
          Explore and join the best communities.
          <span className="font-medium ml-1">{clubs.length} clubs found</span>
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search clubs by name..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setDebouncedSearch("");
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            )}
            {/* Debounce indicator */}
            {searchTerm !== debouncedSearch && (
              <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                <Loader className="animate-spin text-blue-500" size={16} />
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full md:w-auto px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="nameAsc">Name (A-Z)</option>
              <option value="nameDesc">Name (Z-A)</option>
              <option value="feeLowest">Lowest Fee</option>
              <option value="feeHighest">Highest Fee</option>
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400"
              size={20}
            />
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Filter size={20} />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Clear Filters Button */}
          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-2"
            >
              <X size={20} />
              Clear Filters
            </button>
          )}
        </div>

        {/* Expanded Filters Panel */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-100 animate-slideDown">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {uniqueCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400"
                    size={18}
                  />
                </div>
              </div>

              {/* Membership Fee Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Membership Fee
                </label>
                <div className="flex gap-2">
                  {["all", "free", "paid"].map((option) => (
                    <button
                      key={option}
                      onClick={() => setMembershipFeeFilter(option)}
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                        membershipFeeFilter === option
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {option === "all" ? (
                        <>
                          <span>All</span>
                        </>
                      ) : option === "free" ? (
                        <>
                          <DollarSign size={16} />
                          <span>Free</span>
                        </>
                      ) : (
                        <>
                          <DollarSign size={16} />
                          <span>Paid</span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Filters Display */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Active Filters
                </label>
                <div className="flex flex-wrap gap-2">
                  {debouncedSearch && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Search: "{debouncedSearch}"
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setDebouncedSearch("");
                        }}
                        className="hover:text-blue-900 ml-1"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {selectedCategory && selectedCategory !== "all" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm">
                      Category: {selectedCategory}
                      <button
                        onClick={() => setSelectedCategory("")}
                        className="hover:text-green-900 ml-1"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {membershipFeeFilter !== "all" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {membershipFeeFilter === "free"
                        ? "Free Only"
                        : "Paid Only"}
                      <button
                        onClick={() => setMembershipFeeFilter("all")}
                        className="hover:text-purple-900 ml-1"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {selectedSort !== "newest" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm">
                      {selectedSort === "oldest" && "Oldest First"}
                      {selectedSort === "nameAsc" && "Name A-Z"}
                      {selectedSort === "nameDesc" && "Name Z-A"}
                      {selectedSort === "feeLowest" && "Lowest Fee"}
                      {selectedSort === "feeHighest" && "Highest Fee"}
                      <button
                        onClick={() => setSelectedSort("newest")}
                        className="hover:text-amber-900 ml-1"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clubs Grid */}
      {clubs.length === 0 ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-gray-500 italic bg-white rounded-3xl p-8">
          <Sparkles className="mb-4 text-gray-300" size={48} />
          <p className="text-lg mb-2">No clubs found matching your criteria</p>
          <p className="text-sm text-gray-400 mb-4">
            Try adjusting your filters or search term
          </p>
          <button
            onClick={handleClearFilters}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {clubs.map((club) => (
            <div
              key={club._id}
              className="group relative bg-white border border-gray-100 rounded-[2.5rem] p-7 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_60px_rgba(59,130,246,0.12)] transition-all duration-500 flex flex-col justify-between overflow-hidden"
            >
              {/* Image Section */}
              <div className="relative mb-6 overflow-hidden rounded-[1.8rem]">
                {club.bannerImage ? (
                  <img
                    src={club.bannerImage}
                    alt={club.clubName}
                    className="h-44 w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="h-44 w-full bg-linear-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                    <LayoutGrid className="text-blue-200" size={40} />
                  </div>
                )}

                {/* Membership Fee Tag */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border backdrop-blur-md ${
                      club.membershipFee > 0
                        ? "bg-white/90 text-amber-600 border-amber-100"
                        : "bg-white/90 text-emerald-600 border-emerald-100"
                    }`}
                  >
                    {club.membershipFee > 0 ? `$${club.membershipFee}` : "Free"}
                  </span>
                </div>

                {/* Created Date */}
                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs text-gray-600">
                    <Clock size={12} />
                    {new Date(club.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {club.clubName}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2 font-light">
                  {club.description}
                </p>

                {/* Meta Details */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-gray-600 group/item">
                    <div className="p-2 bg-gray-50 rounded-xl group-hover/item:bg-blue-50 group-hover/item:text-blue-600 transition-all">
                      <Tag size={16} />
                    </div>
                    <span className="text-sm font-medium">{club.category}</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600 group/item">
                    <div className="p-2 bg-gray-50 rounded-xl group-hover/item:bg-rose-50 group-hover/item:text-rose-600 transition-all">
                      <MapPin size={16} />
                    </div>
                    <span className="text-sm font-medium">{club.location}</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600 group/item">
                    <div className="p-2 bg-gray-50 rounded-xl group-hover/item:bg-emerald-50 group-hover/item:text-emerald-600 transition-all">
                      <DollarSign size={16} />
                    </div>
                    <span className="text-sm font-medium">
                      Membership Fee: ${club.membershipFee || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link
                to={`/clubs/${club._id}`}
                className="group/btn relative mt-auto flex items-center justify-center gap-3 w-full py-4 bg-gray-900 text-white rounded-3xl font-bold overflow-hidden transition-all duration-300 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 active:scale-95"
              >
                <span className="z-10">View Club Details</span>
                <ArrowRight
                  size={18}
                  className="z-10 group-hover/btn:translate-x-2 transition-transform duration-300"
                />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
