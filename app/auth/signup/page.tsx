"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import Link from "next/link";
import { useSignUp, useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ios-spinner";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";


export default function SignUpPage() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
    if (authLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, authLoaded, router]);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp || !email) return;

    try {
      setIsMagicLinkLoading(true);

      await signUp.create({
        emailAddress: email,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setIsCodeSent(true);
      toast.success("Verification code sent to your email!");
    } catch (error) {
      console.error("OTP error:", error);
      toast.error("Failed to send email. Please try again.");
    } finally {
      setIsMagicLinkLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp || !code) return;

    try {
      setIsVerifying(true);
      await signUp.attemptEmailAddressVerification({ code });
      await setActive({ session: signUp.createdSessionId });
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Invalid code. Please check and try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!isLoaded || !signUp) return;

    try {
      setIsGoogleLoading(true);
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
        redirectUrlComplete: "/dashboard",
      });
    } catch (error) {
      console.error("Google sign up error:", error);
      toast.error("Google sign-up failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isCodeSent) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white text-neutral-800 antialiased font-sans px-4 sm:px-6">
        <div className="max-w-md w-full px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 space-y-8 sm:space-y-10 rounded-3xl border border-neutral-100 backdrop-blur-3xl bg-neutral-50 transition-all duration-500 relative">
          <button
            onClick={() => {
              setIsCodeSent(false);
              setEmail("");
              setCode("");
              setShowEmail(false);
            }}
            className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2 text-neutral-600 cursor-pointer hover:rounded-xl hover:bg-neutral-200/50 p-2 hover:text-neutral-900 transition-all duration-200 ease-out transform hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
          </button>

          <div className="flex justify-center pt-4">
            <img
              src="/email.svg"
              alt="Email icon"
              className="w-12 h-12 sm:w-16 opacity-90 drop-shadow-sm"
            />
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
            Check your email
          </h1>

          <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
            We've sent a verification code to{" "}
            <span className="font-semibold text-neutral-800">{email}</span>.
            Enter it below to verify your email.
          </p>

          <form onSubmit={handleVerifyCode} className="space-y-7 pt-2">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={setCode}
                className="border border-neutral-500 text-neutral-800 rounded-lg p-2"
              >
                {Array.from({ length: 6 }, (_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTP>
            </div>

            <button
              type="submit"
              disabled={isVerifying || code.length < 6}
              className="
                    relative inline-flex items-center justify-center gap-2
                    h-12 px-6 rounded-full font-medium text-base whitespace-nowrap
                    text-white bg-black border border-neutral-800
                    shadow-[inset_0_2px_3px_rgba(255,255,255,0.4),inset_0_-2px_3px_rgba(255,255,255,0.2)]
                    transition-all duration-150 ease-out
                    overflow-hidden isolate cursor-pointer group
                    before:absolute before:inset-0 before:rounded-full
                    before:bg-linear-to-b before:from-white/25 before:to-transparent before:opacity-40
                    before:transition-all before:duration-150
                    hover:bg-neutral-900 w-full
                    hover:before:opacity-60
                    hover:shadow-[inset_0_3px_6px_rgba(255,255,255,0.6),inset_0_-3px_6px_rgba(255,255,255,0.6)]
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800
                    active:scale-[0.98]
                    disabled:pointer-events-none disabled:opacity-50
                  "
            >
              {isVerifying ? (
                <>
                  <Spinner color="#ffff" /> Verifying...
                </>
              ) : (
                "Verify code"
              )}
            </button>
          </form>

          <div className="pt-4">
            <p className="text-neutral-500 text-sm text-center">
              Didn't get the email? Check your{" "}
              <span className="font-medium">spam</span> folder.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex bg-white antialiased text-neutral-800">
      {/* Left Image Section */}
      <div className="relative  min-h-screen flex-1 hidden lg:block">
        <Image
         src="/auth1.png"
          alt="Login Illustration"
          fill
          className="object-cover"
          priority
          draggable={false}
        />
      </div>

      {/* Right Form Section */}
      <div className="flex-1 min-h-screen flex items-center justify-center bg-white backdrop-blur-2xl relative px-4 sm:px-6">
        <div className="max-w-md w-full px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 space-y-6 sm:space-y-8">
          {/* Logo - Centered at top */}
                 <div className="flex justify-center items-center">
                            <div className="bg-neutral-100 mb-6 rounded-3xl p-1">
                              <Image
                                src="/logo.png"
                                alt="Logo"
                                width={50}
                                height={50}
                                className="sm:w-20 sm:h-20 h-18 w-18 md:w-18 md:h-18"
                              />
                            </div>
                          </div>

          {/* Form Container */}
          <div className="space-y-4">
            {/* Back Button - Aligned with form width */}
            {showEmail && (
              <button
                onClick={() => setShowEmail(false)}
                className="flex items-center gap-2 text-neutral-600 cursor-pointer hover:rounded-xl hover:bg-neutral-200/50 p-2 hover:text-neutral-900 transition-all duration-200 ease-out transform hover:scale-105 active:scale-95 mb-4"
              >
                <ArrowLeft size={18} strokeWidth={2.5} />
              </button>
            )}

            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold antialiased tracking-tight leading-normal text-neutral-800 ">
                Create your account
              </h1>
            <p className="text-neutral-500 antialiased tracking-normal font-medium leading-normal text-xs sm:text-sm">
  Take a moment to set things up, so the season feels lighter, warmer, and easier to enjoy as it unfolds.
</p>

            </div>

            {/* Google Button */}
            {!showEmail && (
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={isGoogleLoading}
                  className="
                    relative inline-flex items-center justify-center gap-2
                    h-12 px-6 rounded-full font-medium text-base whitespace-nowrap
                    text-black bg-white border border-neutral-200
                    shadow-[inset_0_2px_3px_rgba(255,255,255,0.4),inset_0_-2px_3px_rgba(255,255,255,0.2)]
                    transition-all duration-150 ease-out
                    overflow-hidden isolate cursor-pointer group
                    before:absolute before:inset-0 before:rounded-full
                    before:bg-linear-to-b before:from-white/25 before:to-transparent before:opacity-40
                    before:transition-all before:duration-150
                    hover:bg-neutral-100 w-full
                    hover:before:opacity-60
                    hover:shadow-[inset_0_3px_6px_rgba(255,255,255,0.6),inset_0_-3px_6px_rgba(255,255,255,0.6)]
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200
                    active:scale-[0.98]
                    disabled:pointer-events-none disabled:opacity-50
                  "
                >
                  {isGoogleLoading ? (
                    <>
                      <Spinner />
                      <Image
                        src="/google.svg"
                        alt="Google"
                        width={20}
                        height={20}
                      />
                    </>
                  ) : (
                    <>
                      <Image
                        src="/google.svg"
                        alt="Google"
                        width={20}
                        height={20}
                      />
                      Continue with Google
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Email Button */}
            {!showEmail && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowEmail(true)}
                  className="
                    relative inline-flex items-center justify-center gap-2
                    h-12 px-6 rounded-full font-medium text-base whitespace-nowrap
                    text-white bg-black border border-neutral-800
                    shadow-[inset_0_2px_3px_rgba(255,255,255,0.4),inset_0_-2px_3px_rgba(255,255,255,0.2)]
                    transition-all duration-150 ease-out
                    overflow-hidden isolate cursor-pointer group
                    before:absolute before:inset-0 before:rounded-full
                    before:bg-linear-to-b before:from-white/25 before:to-transparent before:opacity-40
                    before:transition-all before:duration-150
                    hover:bg-neutral-900 w-full
                    hover:before:opacity-60
                    hover:shadow-[inset_0_3px_6px_rgba(255,255,255,0.6),inset_0_-3px_6px_rgba(255,255,255,0.6)]
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800
                    active:scale-[0.98]
                    disabled:pointer-events-none disabled:opacity-50
                  "
                >
                  <Image
                    src="/email.svg"
                    className="mt-1 "
                    alt="Email"
                    width={20}
                    height={20}
                  />
                  Continue with Email
                </button>
              </div>
            )}

            {showEmail && (
              <form onSubmit={handleMagicLink} className="space-y-7 pt-4">
                <div className="space-y-2.5">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium  text-neutral-700"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 w-full px-5 rounded-2xl bg-white border border-neutral-200 text-neutral-800 focus-visible:ring-2 focus-visible:ring-neutral-300 transition-all"
                      required
                    />
                  </div>
                </div>

                <div id="clerk-done"></div>

                <button
                  type="submit"
                  disabled={isMagicLinkLoading || !email}
                  className="
                    relative inline-flex items-center justify-center gap-2
                    h-12 px-6 rounded-full font-medium text-base whitespace-nowrap
                    text-white bg-black border border-neutral-800
                    shadow-[inset_0_2px_3px_rgba(255,255,255,0.4),inset_0_-2px_3px_rgba(255,255,255,0.2)]
                    transition-all duration-150 ease-out
                    overflow-hidden isolate cursor-pointer group
                    before:absolute before:inset-0 before:rounded-full
                    before:bg-linear-to-b before:from-white/25 before:to-transparent before:opacity-40
                    before:transition-all before:duration-150
                    hover:bg-neutral-900 w-full
                    hover:before:opacity-60
                    hover:shadow-[inset_0_3px_6px_rgba(255,255,255,0.6),inset_0_-3px_6px_rgba(255,255,255,0.6)]
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800
                    active:scale-[0.98]
                    disabled:pointer-events-none disabled:opacity-50
                  "
                >
                  {isMagicLinkLoading ? (
                    <>
                      <Spinner color="#ffff" /> Sending code...
                    </>
                  ) : (
                    "Send verification code"
                  )}
                </button>
              </form>
            )}

            <div className={`${showEmail ? "pt-6" : "pt-6"}`}>
              <p className="text-sm text-neutral-600 text-center">
                Already have an account?{" "}
                <Link
                  href="/auth/signin"
                  className="text-neutral-600 antialiased hover:text-black  underline font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
