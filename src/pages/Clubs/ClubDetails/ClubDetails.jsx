// import { useParams } from "react-router";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useContext, useState, useEffect } from "react";
// import { AuthContext } from "../../../context/AuthContext/AuthContext";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";

// import { toast } from "react-hot-toast";
// import {
//   ChartBarStacked,
//   MapPin,
//   MapPinCheck,
//   Users,
//   Calendar,
//   Tag,
//   Mail,
//   User,
//   Loader2,
//   CheckCircle,
//   DollarSign,
// } from "lucide-react";
// import { ClubCheckoutForm } from "../../../Components/ClubCheckoutForm";

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

// // Club Details Component
// export const ClubDetails = () => {
//   const { id } = useParams();
//   const { user } = useContext(AuthContext);
//   const queryClient = useQueryClient();

//   const [joined, setJoined] = useState(false);
//   const [membershipId, setMembershipId] = useState(null);

//   // Fetch club details
//   const {
//     data: club = {},
//     isLoading,
//     error,
//     refetch,
//   } = useQuery({
//     queryKey: ["clubDetails", id],
//     queryFn: async () => {
//       const token = user ? await user.getIdToken() : null;
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/clubs/${id}`, {
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });
//       if (!res.ok) throw new Error("Failed to fetch club");
//       return res.json();
//     },
//   });

//   // Check if user is already a member
//   useEffect(() => {
//     const checkMembership = async () => {
//       if (user && club?._id) {
//         try {
//           const token = await user.getIdToken();
//           const res = await fetch(
//             `${import.meta.env.VITE_API_URL}/check-membership?clubId=${
//               club._id
//             }`,
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           );
//           if (res.ok) {
//             const data = await res.json();
//             if (data.isMember) {
//               setJoined(true);
//               setMembershipId(data.membershipId);
//             }
//           }
//         } catch (err) {
//           console.error("Check membership error:", err);
//         }
//       }
//     };
//     if (club?._id) checkMembership();
//   }, [club?._id, user]);

//   // Free membership mutation
//   const joinFreeMutation = useMutation({
//     mutationFn: async () => {
//       if (!user) throw new Error("Please login first");
//       const token = await user.getIdToken();
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/memberships`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ userEmail: user.email, clubId: club._id }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to join club");
//       return data;
//     },
//     onSuccess: (data) => {
//       setJoined(true);
//       setMembershipId(data.membershipId);
//       toast.success("You have joined this club!");
//       queryClient.invalidateQueries(["clubDetails", id]);
//     },
//     onError: (err) => toast.error(err.message),
//   });

//   // Paid membership creation mutation
//   const createPaidMembership = useMutation({
//     mutationFn: async () => {
//       if (!user) throw new Error("Please login first");
//       const token = await user.getIdToken();
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/memberships`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ userEmail: user.email, clubId: club._id }),
//       });
//       const data = await res.json();
//       if (!res.ok)
//         throw new Error(data.message || "Failed to create membership");
//       return data;
//     },
//     onSuccess: (data) => {
//       setMembershipId(data.membershipId);
//       toast.success("Membership created! Proceed to payment.");
//     },
//     onError: (err) => toast.error(err.message),
//   });

//   const handlePaymentSuccess = () => {
//     setJoined(true);
//     queryClient.invalidateQueries(["clubDetails", id]);
//   };

//   if (isLoading)
//     return (
//       <div className="flex justify-center items-center min-h-[400px]">
//         <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
//       </div>
//     );

//   if (error || !club._id)
//     return (
//       <div className="max-w-4xl mx-auto p-6">
//         <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
//           <p className="text-red-600 text-lg font-semibold">
//             Failed to load club details
//           </p>
//           <p className="text-gray-600 mt-2">
//             {error?.message || "Club not found"}
//           </p>
//         </div>
//       </div>
//     );

//   return (
//     <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8">
//       {/* Banner */}
//       {club.bannerImage && (
//         <div className="relative rounded-2xl overflow-hidden shadow-xl">
//           <img
//             src={club.bannerImage}
//             alt="club banner"
//             className="w-full h-64 md:h-80 object-cover"
//           />
//           <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-6">
//             <h1 className="text-3xl md:text-4xl font-bold text-white">
//               {club.clubName}
//             </h1>
//           </div>
//         </div>
//       )}

//       {/* Club Info */}
//       <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
//         {!club.bannerImage && (
//           <h1 className="text-3xl font-bold text-gray-800">{club.clubName}</h1>
//         )}

//         <p className="text-gray-700 leading-relaxed">{club.description}</p>

//         {/* Club Stats */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-blue-100 rounded-lg">
//               <ChartBarStacked className="w-5 h-5 text-blue-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Category</p>
//               <p className="font-medium">{club.category}</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-green-100 rounded-lg">
//               <MapPin className="w-5 h-5 text-green-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Location</p>
//               <p className="font-medium">{club.location}</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-purple-100 rounded-lg">
//               <Users className="w-5 h-5 text-purple-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Members</p>
//               <p className="font-medium">{club.membersCount || 0}</p>
//             </div>
//           </div>
//         </div>

//         {/* Membership Fee */}
//         <div
//           className={`p-4 rounded-xl flex items-center justify-between ${
//             club.membershipFee > 0
//               ? "bg-yellow-50 border border-yellow-200"
//               : "bg-green-50 border border-green-200"
//           }`}
//         >
//           <div className="flex items-center gap-3">
//             <div
//               className={`p-2 rounded-lg ${
//                 club.membershipFee > 0 ? "bg-yellow-100" : "bg-green-100"
//               }`}
//             >
//               <DollarSign
//                 className={`w-5 h-5 ${
//                   club.membershipFee > 0 ? "text-yellow-600" : "text-green-600"
//                 }`}
//               />
//             </div>
//             <div>
//               <p className="font-semibold">
//                 {club.membershipFee > 0 ? "Paid Membership" : "Free Membership"}
//               </p>
//               <p className="text-gray-600">
//                 {club.membershipFee > 0
//                   ? `$${club.membershipFee} one-time fee`
//                   : "Join for free, no payment required"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Manager Info */}
//         <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
//           <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
//             <User className="w-5 h-5" />
//             Club Manager
//           </h3>
//           <div className="space-y-2">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-white rounded-lg">
//                 <User className="w-4 h-4 text-gray-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Name</p>
//                 <p className="font-medium">{club.managerName || "Unknown"}</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-white rounded-lg">
//                 <Mail className="w-4 h-4 text-gray-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Email</p>
//                 <p className="font-medium">{club.managerEmail || "N/A"}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Join / Payment Section */}
//         <div className="pt-6 border-t">
//           {!user ? (
//             <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
//               <p className="text-yellow-700 font-medium text-center">
//                 Please login to join this club
//               </p>
//             </div>
//           ) : joined ? (
//             <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
//               <CheckCircle className="w-6 h-6 text-green-600" />
//               <div>
//                 <p className="font-semibold text-green-700">
//                   You are a member of this club!
//                 </p>
//                 <p className="text-green-600 text-sm">
//                   Membership ID: {membershipId}
//                 </p>
//               </div>
//             </div>
//           ) : club.membershipFee <= 0 ? (
//             <button
//               onClick={() => joinFreeMutation.mutate()}
//               disabled={joinFreeMutation.isLoading}
//               className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {joinFreeMutation.isLoading ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   Joining...
//                 </>
//               ) : (
//                 "Join Club for Free"
//               )}
//             </button>
//           ) : !membershipId ? (
//             <button
//               onClick={() => createPaidMembership.mutate()}
//               disabled={createPaidMembership.isLoading}
//               className="w-full py-3 bg-yellow-500 text-white rounded-xl font-bold text-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {createPaidMembership.isLoading ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   Creating Membership...
//                 </>
//               ) : (
//                 "Join Club"
//               )}
//             </button>
//           ) : (
//             <Elements stripe={stripePromise}>
//               <ClubCheckoutForm
//                 club={club}
//                 user={user}
//                 membershipId={membershipId}
//                 onPaymentSuccess={handlePaymentSuccess}
//               />
//             </Elements>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { ClubCheckoutForm } from "../../../components/ClubCheckoutForm";
import { toast } from "react-hot-toast";
import {
  ChartBarStacked,
  MapPin,
  Users,
  Calendar,
  Tag,
  Mail,
  User,
  Loader2,
  CheckCircle,
  DollarSign,
  AlertCircle,
  Clock,
} from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

export const ClubDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [membershipId, setMembershipId] = useState(null);
  const [membershipStatus, setMembershipStatus] = useState(null);

  // Fetch club details with membership status
  const {
    data: club = {},
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["clubDetails", id],
    queryFn: async () => {
      const token = user ? await user.getIdToken() : null;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/clubs/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to fetch club");
      return res.json();
    },
  });

  // Check membership status on load
  useEffect(() => {
    const checkMembership = async () => {
      if (user && club?._id) {
        try {
          const token = await user.getIdToken();
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/check-membership?clubId=${
              club._id
            }`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (res.ok) {
            const data = await res.json();
            setMembershipStatus(data.status);
            if (data.membershipId) {
              setMembershipId(data.membershipId);
            }
          }
        } catch (err) {
          console.error("Check membership error:", err);
        }
      }
    };
    if (club?._id) checkMembership();
  }, [club?._id, user]);

  // Handle join club (both free and paid)
  const joinClubMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Please login first");

      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/memberships`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userEmail: user.email,
          clubId: club._id,
        }),
      });

      const data = await res.json();

      // If already a member
      if (data.message?.includes("already a member")) {
        return { ...data, isAlreadyMember: true };
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to join club");
      }

      return data;
    },
    onSuccess: (data) => {
      console.log("Join response:", data);

      if (data.isAlreadyMember) {
        toast.error("You are already a member of this club!");
        return;
      }

      if (data.existing && data.status === "pendingPayment") {
        // Already have pending payment
        setMembershipId(data.membershipId);
        setMembershipStatus("pendingPayment");
        toast.success("Continue with your pending payment");
      } else if (data.status === "active") {
        // Free club joined successfully
        setMembershipStatus("active");
        setMembershipId(data.membershipId);
        toast.success("Successfully joined the club!");
        refetch();
      } else if (data.status === "pendingPayment") {
        // Paid club - need payment
        setMembershipId(data.membershipId);
        setMembershipStatus("pendingPayment");
        toast.success("Membership created! Please complete payment.");
      }
    },
    onError: (err) => {
      console.error("Join error:", err);
      toast.error(err.message);
    },
  });

  const handlePaymentSuccess = () => {
    setMembershipStatus("active");
    toast.success("Payment successful! You are now a member.");
    refetch();
    queryClient.invalidateQueries(["clubDetails", id]);
  };

  // Membership status messages
  const getMembershipMessage = () => {
    switch (membershipStatus) {
      case "active":
        return {
          message: "You are a member of this club!",
          color: "green",
          icon: <CheckCircle className="w-6 h-6 text-green-600" />,
        };
      case "pendingPayment":
        return {
          message: "Payment Pending - Complete payment to join",
          color: "yellow",
          icon: <Clock className="w-6 h-6 text-yellow-600" />,
        };
      default:
        return null;
    }
  };

  const membershipInfo = getMembershipMessage();

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );

  if (error || !club._id)
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 text-lg font-semibold">
            Failed to load club details
          </p>
          <p className="text-gray-600 mt-2">
            {error?.message || "Club not found"}
          </p>
        </div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8">
      {/* Club Banner */}
      {club.bannerImage && (
        <div className="relative rounded-2xl overflow-hidden shadow-xl">
          <img
            src={club.bannerImage}
            alt="club banner"
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {club.clubName}
            </h1>
          </div>
        </div>
      )}

      {/* Club Info */}
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {!club.bannerImage && (
          <h1 className="text-3xl font-bold text-gray-800">{club.clubName}</h1>
        )}

        <p className="text-gray-700 leading-relaxed">{club.description}</p>

        {/* Club Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ChartBarStacked className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium">{club.category}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{club.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Members</p>
              <p className="font-medium">{club.membersCount || 0}</p>
            </div>
          </div>
        </div>

        {/* Membership Status */}
        {membershipInfo && (
          <div
            className={`p-4 rounded-xl border ${
              membershipInfo.color === "green"
                ? "bg-green-50 border-green-200"
                : "bg-yellow-50 border-yellow-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {membershipInfo.icon}
              <div>
                <p
                  className={`font-semibold ${
                    membershipInfo.color === "green"
                      ? "text-green-700"
                      : "text-yellow-700"
                  }`}
                >
                  {membershipInfo.message}
                </p>
                {membershipId && (
                  <p className="text-sm text-gray-600 mt-1">
                    Membership ID: {membershipId}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Membership Fee */}
        <div
          className={`p-4 rounded-xl flex items-center justify-between ${
            club.membershipFee > 0
              ? "bg-yellow-50 border border-yellow-200"
              : "bg-green-50 border border-green-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                club.membershipFee > 0 ? "bg-yellow-100" : "bg-green-100"
              }`}
            >
              <DollarSign
                className={`w-5 h-5 ${
                  club.membershipFee > 0 ? "text-yellow-600" : "text-green-600"
                }`}
              />
            </div>
            <div>
              <p className="font-semibold">
                {club.membershipFee > 0 ? "Paid Membership" : "Free Membership"}
              </p>
              <p className="text-gray-600">
                {club.membershipFee > 0
                  ? `$${club.membershipFee} one-time fee`
                  : "Join for free, no payment required"}
              </p>
            </div>
          </div>
        </div>

        {/* Manager Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <User className="w-5 h-5" />
            Club Manager
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{club.managerName || "Unknown"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg">
                <Mail className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{club.managerEmail || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Join / Payment Section */}
        <div className="pt-6 border-t">
          {!user ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-yellow-700 font-medium text-center">
                Please login to join this club
              </p>
            </div>
          ) : membershipStatus === "active" ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
              <p className="font-semibold text-green-700">
                ✅ You are already a member of this club!
              </p>
            </div>
          ) : membershipStatus === "pendingPayment" &&
            club.membershipFee > 0 ? (
            <Elements stripe={stripePromise}>
              <ClubCheckoutForm
                club={club}
                user={user}
                membershipId={membershipId}
                onPaymentSuccess={handlePaymentSuccess}
              />
            </Elements>
          ) : (
            <button
              onClick={() => joinClubMutation.mutate()}
              disabled={
                joinClubMutation.isLoading ||
                membershipStatus === "pendingPayment"
              }
              className={`w-full py-3 rounded-xl font-bold text-lg ${
                club.membershipFee > 0
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {joinClubMutation.isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {club.membershipFee > 0
                    ? "Creating Membership..."
                    : "Joining..."}
                </>
              ) : membershipStatus === "pendingPayment" ? (
                <>
                  <AlertCircle className="w-5 h-5" />
                  Payment Pending
                </>
              ) : club.membershipFee > 0 ? (
                `Join Club - $${club.membershipFee}`
              ) : (
                "Join Club for Free"
              )}
            </button>
          )}

          {/* Error message for already member */}
          {membershipStatus === "active" && (
            <p className="text-center text-gray-500 mt-3 text-sm">
              You cannot join the same club multiple times
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
