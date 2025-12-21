import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import { MapPin, Tag, ArrowRight, Sparkles, LayoutGrid } from "lucide-react";

export const AllClubs = () => {
  const { user } = use(AuthContext);

  const {
    data: clubs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allClubs"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/clubs`);
      if (!res.ok) {
        throw new Error("Failed to fetch clubs");
      }
      return res.json();
    },
  });

  // --- UpComingEvents er moto same Skeleton Loader ---
  if (isLoading) {
    return (
      <div className="p-8 bg-[#fcfcfd] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-[400px] bg-gray-100 rounded-[2.5rem] animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-red-500">
        <p>Failed to load clubs. Please try again later.</p>
      </div>
    );
  }

  if (clubs.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-gray-500 italic">
        <Sparkles className="mb-2 text-gray-300" size={40} />
        <p>No clubs available at the moment.</p>
      </div>
    );
  }

  return (
    // Parent container with same background and padding
    <div className="p-8 bg-[#fcfcfd]">
      <div>
        {/* Optional Header matching the aesthetic */}
        <div className="mb-10 ml-4">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">
            All <span className="text-blue-600">Clubs</span>
          </h2>
          <p className="text-gray-500 mt-2 font-light">
            Explore and join the best communities.
          </p>
        </div>

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
                    alt="club banner"
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
              </div>

              {/* Content Section */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
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
                </div>
              </div>

              {/* Action Button - Same as Events */}
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
      </div>
    </div>
  );
};
