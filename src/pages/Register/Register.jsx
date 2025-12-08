import { use } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext/AuthContext";

export const Register = () => {
  const { createUser, updateUserProfile, signInWithGoogle, signOutUser } =
    use(AuthContext);
  console.log(createUser);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/login";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // EMAIL / PASSWORD REGISTRATION
  const onSubmit = async (data) => {
    const { name, email, password, photoURL } = data;

    try {
      // Create Firebase User
      const result = await createUser(email, password);

      // Update profile
      await updateUserProfile(name, photoURL);

      const firebaseUser = result.user;
      const uid = firebaseUser.uid;

      // Data save to MongoDB
      await fetch("http://localhost:3000/api/auth/save-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid,
          name,
          email,
          photoURL,
          role: "member",
        }),
      });

      // Success toast
      toast.success("Registration Successful!");

      signOutUser();

      // Redirect
      navigate(from, { replace: true });
    } catch (err) {
      console.log(err);
      const msg = err.message
        .replace("Firebase:", "")
        .replace("auth/", "")
        .replace(/-/g, " ");

      toast.error(msg.charAt(0).toUpperCase() + msg.slice(1));
    }
  };

  // GOOGLE SIGNUP
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      await fetch("http://localhost:3000/api/auth/save-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        }),
      });

      toast.success("Logged in with Google!");
      navigate("/", { replace: true });
    } catch (err) {
      const msg = err.message
        .replace("Firebase:", "")
        .replace("auth/", "")
        .replace(/-/g, " ");

      toast.error(msg.charAt(0).toUpperCase() + msg.slice(1));
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-semibold mb-5 text-center">Register</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* NAME */}
        <div>
          <label>Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-red-600 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <label>Email</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* PHOTO URL */}
        <div>
          <label>Photo URL</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            {...register("photoURL", { required: "Photo URL is required" })}
          />
          {errors.photoURL && (
            <p className="text-red-600 text-sm">{errors.photoURL.message}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <label>Password</label>
          <input
            type="password"
            className="w-full border p-2 rounded"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters required",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z]).+$/,
                message:
                  "Must include at least one uppercase & one lowercase letter",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-600 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* REGISTER BUTTON */}
        <div className="mt-4 text-center">
          <button
            type="submit"
            className="md:w-1/2 w-full btn btn-soft btn-primary"
          >
            Register
          </button>
        </div>
      </form>

      {/* GOOGLE LOGIN */}
      <div className="mt-4 text-center">
        <button
          onClick={handleGoogleLogin}
          className="md:w-1/2 w-full btn bg-white text-black border-[#e5e5e5] cursor-pointer"
        >
          <svg
            aria-label="Google logo"
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <g>
              <path d="m0 0H512V512H0" fill="#fff"></path>
              <path
                fill="#34a853"
                d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
              ></path>
              <path
                fill="#4285f4"
                d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
              ></path>
              <path
                fill="#fbbc02"
                d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
              ></path>
              <path
                fill="#ea4335"
                d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
              ></path>
            </g>
          </svg>
          Login with Google
        </button>
      </div>
    </div>
  );
};
