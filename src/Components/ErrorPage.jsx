import React from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-[#0f111a] flex items-center justify-center px-6 overflow-hidden relative">
      {/* Background Aesthetic Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/20 rounded-full blur-[120px]" />

      <div className="text-center z-10">
        {/* Floating 404 Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-[12rem] md:text-[16rem] font-bold text-transparent bg-clip-text bg-linear-to-b from-white to-white/10 leading-none select-none"
        >
          404
        </motion.h1>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="-mt-8 md:-mt-12"
        >
          <h2 className="text-2xl md:text-4xl font-light text-white mb-4">
            Lost in the <span className="italic font-serif">void</span>?
          </h2>
          <p className="text-gray-400 max-w-md mx-auto mb-10 font-light leading-relaxed">
            The page you're looking for has vanished into thin air. Don't worry,
            it happens to the best of us.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white transition-all duration-300"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Go Back
          </button>

          <a
            href="/"
            className="group flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            <Home size={18} />
            Back to Home
          </a>
        </motion.div>
      </div>

      {/* Decorative Animated Line */}
      <motion.div
        animate={{
          scaleX: [0, 1, 0],
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-10 left-0 w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent"
      />
    </div>
  );
};

export default ErrorPage;
