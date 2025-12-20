import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  FaSearch,
  FaUsers,
  FaCalendarAlt,
  FaCreditCard,
  FaStar,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router";

/* FETCH */
const fetchAllClubs = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/clubs`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

/* DATA */
const categories = [
  { name: "Photography", icon: "📸", clubs: 24 },
  { name: "Technology", icon: "💻", clubs: 32 },
  { name: "Sports", icon: "⚽", clubs: 18 },
  { name: "Books", icon: "📚", clubs: 15 },
  { name: "Music", icon: "🎵", clubs: 21 },
  { name: "Cooking", icon: "🍳", clubs: 12 },
  { name: "Art", icon: "🎨", clubs: 19 },
  { name: "Fitness", icon: "💪", clubs: 27 },
];

/* ANIMATIONS  */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

/* COMPONENT */
export const Home = () => {
  const { data: allClubs = [], isLoading } = useQuery({
    queryKey: ["allClubs"],
    queryFn: fetchAllClubs,
  });

  const featuredClubs = allClubs
    .filter((c) => c.status === "approved")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* ================= HERO ================= */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-linear-to-r from-blue-600 to-purple-600 text-white py-20 md:py-32"
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Discover Your Community with{" "}
            <span className="text-yellow-300">ClubSphere</span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-xl md:text-2xl mb-10 text-blue-100"
          >
            Join local clubs, attend exciting events, and connect with people
            who share your passions
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/clubs"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-8 rounded-full"
            >
              Explore Clubs
            </Link>
            <Link
              to="/register"
              className="border-2 border-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-blue-600"
            >
              Start Your Club
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ================= FEATURED CLUBS ================= */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-16 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={itemVariants}
            className="text-4xl font-bold text-center mb-12"
          >
            Latest <span className="text-blue-600">Clubs</span>
          </motion.h2>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : featuredClubs.length ? (
            <Swiper
              key={featuredClubs.length}
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000 }}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
            >
              {featuredClubs.map((club) => (
                <SwiperSlide key={club._id}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                  >
                    <img
                      src={club.bannerImage}
                      alt={club.clubName}
                      className="h-48 w-full object-cover"
                    />
                    <div className="p-5">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-bold truncate">{club.clubName}</h3>
                        <span className="flex items-center text-yellow-500">
                          <FaStar className="mr-1" /> 4.8
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {club.description}
                      </p>
                      <Link
                        to={`/clubs/${club._id}`}
                        className="text-blue-600 font-semibold flex items-center"
                      >
                        View Details <FaArrowRight className="ml-2" />
                      </Link>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="text-center text-gray-500">No clubs available yet</p>
          )}
        </div>
      </motion.section>

      {/* ================= HOW IT WORKS ================= */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16"
      >
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
          {[
            ["Discover Clubs", FaSearch],
            ["Join & Connect", FaUsers],
            ["Attend Events", FaCalendarAlt],
            ["Easy Payments", FaCreditCard],
          ].map(([title, Icon], i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="bg-white p-6 rounded-xl shadow text-center"
            >
              <Icon className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold">{title}</h3>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ================= CATEGORIES ================= */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 bg-gray-50"
      >
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-xl shadow text-center"
            >
              <div className="text-4xl mb-2">{cat.icon}</div>
              <h3 className="font-bold">{cat.name}</h3>
              <p className="text-sm text-gray-500">{cat.clubs} Clubs</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ================= CTA ================= */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-20 bg-linear-to-r from-blue-600 to-purple-600 text-white text-center"
      >
        <h2 className="text-4xl font-bold mb-6">
          Start Your Club Journey Today
        </h2>
        <Link
          to="/register"
          className="bg-white text-blue-600 font-bold px-8 py-4 rounded-full"
        >
          Sign Up Free
        </Link>
      </motion.section>
    </div>
  );
};
