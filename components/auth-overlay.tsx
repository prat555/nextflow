"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Apple, Mail, Shield, X } from "lucide-react"
import { useAuth, useClerk } from "@clerk/nextjs"

const SIGN_UP_IMAGE_URL =
  "https://krea.ai/api/img?f=webp&i=https%3A%2F%2Fs.krea.ai%2Fmoved%2Fimages%2Fd178f504-e8f8-4352-ac90-0b8d7b9bed77.png&s=1024"

const SIGN_IN_IMAGE_URL =
  "https://krea.ai/api/img?f=webp&i=https%3A%2F%2Fs.krea.ai%2Fmoved%2Fimages%2Fc1643cd9-4dbf-4649-abc2-0047a5d94e2e.png&s=1024"

type AuthMode = "signin" | "signup"

function isAuthMode(value: string | null): value is AuthMode {
  return value === "signin" || value === "signup"
}

export function AuthOverlay() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isLoaded, isSignedIn } = useAuth()
  const { client, setActive } = useClerk()
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [needsVerification, setNeedsVerification] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const authMode = searchParams.get("auth")
  const isOpen = isAuthMode(authMode)

  const updateAuthMode = (mode: AuthMode | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (mode) {
      params.set("auth", mode)
    } else {
      params.delete("auth")
    }

    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const signIn = client?.signIn
  const signUp = client?.signUp

  useEffect(() => {
    if (!isOpen) return

    const { overflow } = document.body.style
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = overflow
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    setEmail("")
    setVerificationCode("")
    setNeedsVerification(false)
    setAuthError(null)
    setIsSubmitting(false)
  }, [authMode, isOpen])

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return
    updateAuthMode(null)
    router.replace("/dashboard")
  }, [isLoaded, isSignedIn])

  const getErrorMessage = (error: unknown) => {
    if (typeof error === "object" && error !== null && "errors" in error) {
      const errors = (error as { errors?: Array<{ longMessage?: string; message?: string }> }).errors
      if (errors && errors.length > 0) {
        return errors[0].longMessage || errors[0].message || "Authentication failed"
      }
    }

    if (error instanceof Error) return error.message
    return "Authentication failed"
  }

  const handleOAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    if (!authMode) return
    setIsSubmitting(true)
    setAuthError(null)

    try {
      const origin = window.location.origin

      if (authMode === "signup") {
        if (!signUp) return
        // For signup, use redirect instead of popup - this matches Clerk's standard flow
        await signUp.authenticateWithRedirect({
          strategy,
          redirectUrl: `${origin}/sso-callback`,
          redirectUrlComplete: `${origin}/dashboard`,
        })
      } else {
        if (!signIn) return
        // For signin, open popup
        const popup = window.open(
          "",
          "clerk_oauth_popup",
          "width=520,height=680,menubar=no,toolbar=no,status=no,scrollbars=yes,resizable=yes"
        )

        if (!popup) {
          throw new Error("Popup blocked. Please allow popups and try again.")
        }

        await signIn.authenticateWithPopup({
          strategy,
          popup,
          redirectUrl: `${origin}/`,
          redirectUrlComplete: `${origin}/dashboard`,
        })
        
        // After popup closes, check signin status
        await new Promise(resolve => setTimeout(resolve, 500))
        
        if (signIn.status === "complete" && signIn.createdSessionId) {
          await setActive({ session: signIn.createdSessionId })
          updateAuthMode(null)
          router.push("/dashboard")
        }
      }
    } catch (error) {
      setAuthError(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEmailContinue = async () => {
    if (!authMode) return

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setAuthError("Please enter your email")
      return
    }

    setIsSubmitting(true)
    setAuthError(null)

    try {
      if (authMode === "signup") {
        if (!signUp) return
        await signUp.create({ emailAddress: trimmedEmail })
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
      } else {
        if (!signIn) return
        await signIn.create({ identifier: trimmedEmail })
        const emailFactor = (signIn.supportedFirstFactors ?? []).find(
          (factor) => factor.strategy === "email_code" && "emailAddressId" in factor
        )

        if (!emailFactor || !("emailAddressId" in emailFactor)) {
          throw new Error("Email code sign-in is not available for this account")
        }

        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: emailFactor.emailAddressId,
        })
      }

      setNeedsVerification(true)
    } catch (error) {
      setAuthError(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!authMode) return
    if (!verificationCode.trim()) {
      setAuthError("Please enter the verification code")
      return
    }

    setIsSubmitting(true)
    setAuthError(null)

    try {
      if (authMode === "signup") {
        if (!signUp) return
        const attempt = await signUp.attemptEmailAddressVerification({ code: verificationCode.trim() })

        if (attempt.status !== "complete") {
          throw new Error("Verification is not complete yet")
        }

        if (!attempt.createdSessionId) {
          throw new Error("No active session created")
        }

        await setActive({ session: attempt.createdSessionId })
      } else {
        if (!signIn) return
        const attempt = await signIn.attemptFirstFactor({
          strategy: "email_code",
          code: verificationCode.trim(),
        })

        if (attempt.status !== "complete") {
          throw new Error("Verification is not complete yet")
        }

        if (!attempt.createdSessionId) {
          throw new Error("No active session created")
        }

        await setActive({ session: attempt.createdSessionId })
      }

      updateAuthMode(null)
      router.push("/dashboard")
    } catch (error) {
      setAuthError(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return null
  }

  const authImageUrl = authMode === "signup" ? SIGN_UP_IMAGE_URL : SIGN_IN_IMAGE_URL

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/65 backdrop-blur-[1px] p-3 md:p-6"
      onClick={() => updateAuthMode(null)}
    >
      <div className="mx-auto flex min-h-full max-w-4xl items-center justify-center">
        <div
          className="relative grid w-full max-w-4xl overflow-hidden rounded-[20px] border border-white/10 bg-[#13151a] shadow-2xl md:grid-cols-[1fr_1.1fr]"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            onClick={() => updateAuthMode(null)}
            className="absolute right-3 top-3 z-10 rounded-full bg-black/20 p-2 text-white transition-colors hover:bg-black/35 cursor-pointer"
            aria-label="Close auth modal"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="max-h-[68vh] overflow-y-auto bg-[#13151a] p-4 sm:p-5 md:max-h-none md:p-5">
            <h2
              className={`mx-auto mb-7 text-center font-semibold leading-[1.1] text-white sm:mb-8 ${
                authMode === "signup"
                  ? "max-w-none text-2xl sm:text-[30px]"
                  : "max-w-[260px] text-3xl sm:text-4xl"
              }`}
            >
              {authMode === "signup" ? (
                <>
                  Sign up to generate
                  <br />
                  for free
                </>
              ) : (
                "Welcome Back"
              )}
            </h2>

            <div className="space-y-3">
              <button
                onClick={() => handleOAuth("oauth_google")}
                disabled={isSubmitting}
                className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border-2 border-[#2f7cff] bg-[#f2f2f2] px-4 text-sm font-semibold text-[#202124] transition-colors hover:bg-white cursor-pointer disabled:cursor-not-allowed"
              >
                <span className="text-lg leading-none text-[#4285F4]">G</span>
                <span>Continue with Google</span>
              </button>

              <button
                onClick={() => handleOAuth("oauth_apple")}
                disabled={isSubmitting}
                className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl bg-[#f2f2f2] px-4 text-sm font-semibold text-[#161616] transition-colors hover:bg-white cursor-pointer disabled:cursor-not-allowed"
              >
                <Apple className="h-5 w-5 fill-current" />
                <span>Continue with Apple</span>
              </button>

              <button
                onClick={() => setAuthError("Single Sign-On is not configured yet")}
                disabled={isSubmitting}
                className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl bg-[#f2f2f2] px-4 text-sm font-semibold text-[#161616] transition-colors hover:bg-white cursor-pointer disabled:cursor-not-allowed"
              >
                <Shield className="h-5 w-5" />
                <span>Single Sign-On (SSO)</span>
              </button>
            </div>

            <p className="my-4 text-center text-xs tracking-wide text-[#6d7380]">OR</p>

            <div className="space-y-4">
              <label className="flex h-11 w-full items-center gap-3 rounded-xl border border-[#2a2f3b] bg-transparent px-4 text-[#7f8798]">
                <Mail className="h-5 w-5" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full bg-transparent text-base text-white placeholder:text-[#6f7686] outline-none"
                />
              </label>

              {needsVerification && (
                <label className="flex h-11 w-full items-center gap-3 rounded-xl border border-[#2a2f3b] bg-transparent px-4 text-[#7f8798]">
                  <Mail className="h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Enter verification code"
                    value={verificationCode}
                    onChange={(event) => setVerificationCode(event.target.value)}
                    className="w-full bg-transparent text-base text-white placeholder:text-[#6f7686] outline-none"
                  />
                </label>
              )}

              <button
                onClick={needsVerification ? handleVerifyCode : handleEmailContinue}
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl bg-[#021d4a] text-sm font-semibold text-[#0a6cff] transition-colors hover:bg-[#032760] cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Please wait..." : needsVerification ? "Verify code" : "Continue"}
              </button>

              {authError && <p className="text-xs text-red-400">{authError}</p>}
            </div>

            {authMode === "signup" && <div id="clerk-captcha" className="mt-3" />}

            <p className="mx-auto mt-4 max-w-sm text-center text-xs text-[#7a8192]">
              By continuing, you agree to Krea&apos;s
              <a href="#" className="ml-1 text-[#2e7bff] hover:underline">
                Terms of Use
              </a>
              <span className="mx-1">&amp;</span>
              <a href="#" className="text-[#2e7bff] hover:underline">
                Privacy Policy
              </a>
              .
            </p>

            <p className="mt-4 text-center text-xs text-[#a0a7b7]">
              {authMode === "signup" ? "Already have an account?" : "New to Krea?"}
              <button
                onClick={() => updateAuthMode(authMode === "signup" ? "signin" : "signup")}
                className="ml-1 text-[#2e7bff] hover:underline cursor-pointer"
              >
                {authMode === "signup" ? "Log in" : "Sign up"}
              </button>
            </p>
          </div>

          <div className="hidden min-h-[300px] bg-[#171922] md:block">
            <img
              src={authImageUrl}
              alt="Desert mountain artwork"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
