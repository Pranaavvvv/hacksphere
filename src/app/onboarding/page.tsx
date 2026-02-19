"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"
import { PortfolioNavbar } from "@/components/PortfolioNavbar"
import { Footer } from "@/components/Footer"

type UserRole = "student" | "organizer"

interface StudentProfile {
  fullName: string
  collegeName: string
  collegeEmail: string
  phoneNumber: string
  yearOfStudy: string
  course: string
  skills: string[]
  github: string
  linkedin: string
  portfolio: string
}

interface OrganizerProfile {
  fullName: string
  organizationName: string
  organizationType: string
  email: string
  phoneNumber: string
  designation: string
  experience: string
  website: string
  linkedin: string
}

const StudentOnboardingForm = ({
  profile,
  setProfile,
  currentStep,
}: {
  profile: StudentProfile
  setProfile: (profile: StudentProfile) => void
  currentStep: number
}) => {
  const skillOptions = [
    "React", "Node.js", "Python", "JavaScript", "TypeScript", "Java", "C++",
    "Machine Learning", "AI", "Blockchain", "Web3", "Mobile Development",
    "UI/UX Design", "DevOps", "Cloud Computing"
  ]

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground mb-4">Personal Information</h3>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number <span className="text-destructive">*</span>
              </label>
              <input
                type="tel"
                value={profile.phoneNumber}
                onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
        )
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground mb-4">College Information</h3>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                College Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={profile.collegeName}
                onChange={(e) => setProfile({ ...profile, collegeName: e.target.value })}
                placeholder="Your College Name"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                College Email <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                value={profile.collegeEmail}
                onChange={(e) => setProfile({ ...profile, collegeEmail: e.target.value })}
                placeholder="you@college.edu"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Year of Study <span className="text-destructive">*</span>
                </label>
                <select
                  value={profile.yearOfStudy}
                  onChange={(e) => setProfile({ ...profile, yearOfStudy: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Post Graduate">Post Graduate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Course <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={profile.course}
                  onChange={(e) => setProfile({ ...profile, course: e.target.value })}
                  placeholder="B.Tech, B.Sc, etc."
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground mb-4">Skills & Expertise</h3>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Select Your Skills <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {skillOptions.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => {
                      const newSkills = profile.skills.includes(skill)
                        ? profile.skills.filter((s) => s !== skill)
                        : [...profile.skills, skill]
                      setProfile({ ...profile, skills: newSkills })
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      profile.skills.includes(skill)
                        ? "bg-primary text-white"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              {profile.skills.length === 0 && (
                <p className="text-xs text-muted-foreground mt-2">Select at least one skill</p>
              )}
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground mb-4">Professional Links</h3>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                GitHub Profile
              </label>
              <input
                type="url"
                value={profile.github}
                onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                placeholder="https://github.com/username"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                LinkedIn Profile
              </label>
              <input
                type="url"
                value={profile.linkedin}
                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Portfolio Website
              </label>
              <input
                type="url"
                value={profile.portfolio}
                onChange={(e) => setProfile({ ...profile, portfolio: e.target.value })}
                placeholder="https://yourportfolio.com"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return <div>{renderStep()}</div>
}

const OrganizerOnboardingForm = ({
  profile,
  setProfile,
  currentStep,
}: {
  profile: OrganizerProfile
  setProfile: (profile: OrganizerProfile) => void
  currentStep: number
}) => {
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground mb-4">Personal Information</h3>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="you@organization.com"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number <span className="text-destructive">*</span>
              </label>
              <input
                type="tel"
                value={profile.phoneNumber}
                onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
        )
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground mb-4">Organization Information</h3>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Organization Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={profile.organizationName}
                onChange={(e) => setProfile({ ...profile, organizationName: e.target.value })}
                placeholder="Your Organization Name"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Organization Type <span className="text-destructive">*</span>
              </label>
              <select
                value={profile.organizationType}
                onChange={(e) => setProfile({ ...profile, organizationType: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select Type</option>
                <option value="College/University">College/University</option>
                <option value="Tech Company">Tech Company</option>
                <option value="Non-Profit">Non-Profit</option>
                <option value="Government">Government</option>
                <option value="Startup">Startup</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Your Designation <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={profile.designation}
                onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                placeholder="Event Manager, Coordinator, etc."
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground mb-4">Experience & Background</h3>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Years of Experience <span className="text-destructive">*</span>
              </label>
              <select
                value={profile.experience}
                onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select Experience</option>
                <option value="0-1 years">0-1 years</option>
                <option value="2-5 years">2-5 years</option>
                <option value="6-10 years">6-10 years</option>
                <option value="10+ years">10+ years</option>
              </select>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground mb-4">Organization Links</h3>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Organization Website
              </label>
              <input
                type="url"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                placeholder="https://yourorganization.com"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                LinkedIn Profile
              </label>
              <input
                type="url"
                value={profile.linkedin}
                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return <div>{renderStep()}</div>
}

function OnboardingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") as UserRole | null
  
  const [currentStep, setCurrentStep] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState("")

  const [studentProfile, setStudentProfile] = useState<StudentProfile>({
    fullName: "",
    collegeName: "",
    collegeEmail: "",
    phoneNumber: "",
    yearOfStudy: "",
    course: "",
    skills: [],
    github: "",
    linkedin: "",
    portfolio: "",
  })

  const [organizerProfile, setOrganizerProfile] = useState<OrganizerProfile>({
    fullName: "",
    organizationName: "",
    organizationType: "",
    email: "",
    phoneNumber: "",
    designation: "",
    experience: "",
    website: "",
    linkedin: "",
  })

  useEffect(() => {
    if (!role || !["student", "organizer"].includes(role)) {
      router.push("/auth")
    }
  }, [role, router])

  if (!role) return null

  const validateStep = (): boolean => {
    setError("")
    
    if (role === "student") {
      switch (currentStep) {
        case 0:
          if (!studentProfile.fullName || !studentProfile.phoneNumber) {
            setError("Please fill in all required fields")
            return false
          }
          break
        case 1:
          if (!studentProfile.collegeName || !studentProfile.collegeEmail || !studentProfile.yearOfStudy || !studentProfile.course) {
            setError("Please fill in all required fields")
            return false
          }
          break
        case 2:
          if (studentProfile.skills.length === 0) {
            setError("Please select at least one skill")
            return false
          }
          break
      }
    } else {
      switch (currentStep) {
        case 0:
          if (!organizerProfile.fullName || !organizerProfile.email || !organizerProfile.phoneNumber) {
            setError("Please fill in all required fields")
            return false
          }
          break
        case 1:
          if (!organizerProfile.organizationName || !organizerProfile.organizationType || !organizerProfile.designation) {
            setError("Please fill in all required fields")
            return false
          }
          break
        case 2:
          if (!organizerProfile.experience) {
            setError("Please select your experience level")
            return false
          }
          break
      }
    }
    return true
  }

  const handleNext = () => {
    if (!validateStep()) return
    
    if (currentStep === 3) {
      // Save profile to localStorage
      const profileData = role === "student" ? studentProfile : organizerProfile
      localStorage.setItem(`hacksphere_${role}_profile`, JSON.stringify(profileData))
      
      // Sync user data for AuthContext
      const userData = localStorage.getItem("hacksphere_user")
      if (userData) {
        try {
          const parsed = JSON.parse(userData)
          const updatedUser = {
            name: parsed.name || (role === "student" ? studentProfile.fullName : organizerProfile.fullName),
            email: parsed.email || (role === "student" ? studentProfile.collegeEmail : organizerProfile.email),
          }
          localStorage.setItem("hacksphere_user", JSON.stringify({ ...parsed, ...updatedUser }))
          localStorage.setItem("hs-user", JSON.stringify(updatedUser))
          localStorage.setItem("hacksphere_role", role)
          localStorage.setItem("hacksphere_auth_token", "temp_token_" + Date.now())
          
          // Trigger auth state update
          window.dispatchEvent(new Event("auth-state-changed"))
        } catch (e) {
          console.error("Error syncing user data:", e)
        }
      }
      
      setCompleted(true)
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(Math.max(0, currentStep - 1))
    setError("")
  }

  if (completed) {
    return (
      <>
        <PortfolioNavbar />
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Profile Complete!</h1>
            <p className="text-muted-foreground mb-8">
              Your profile has been created successfully. {role === "student" ? "Welcome to HackSphere!" : "You can now start organizing hackathons."}
            </p>
            <button
              onClick={() => {
                if (role === "student") {
                  router.push("/home")
                } else {
                  router.push("/auth")
                }
              }}
              className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
              {role === "student" ? "Go to Home" : "Sign In"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const totalSteps = 4
  const stepTitles = role === "student" 
    ? ["Personal Info", "College Info", "Skills", "Links"]
    : ["Personal Info", "Organization", "Experience", "Links"]

  return (
    <>
      <PortfolioNavbar />
      <main className="min-h-screen bg-background px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-4">
              {Array.from({ length: totalSteps }).map((_, step) => (
                <div
                  key={step}
                  className={`flex-1 h-2 rounded-full mx-1 transition-all ${
                    step <= currentStep ? "bg-primary" : "bg-secondary"
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              {stepTitles.map((title, index) => (
                <span
                  key={index}
                  className={index === currentStep ? "font-semibold text-primary" : ""}
                >
                  {title}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Step {currentStep + 1} of {totalSteps}
            </p>
          </div>

          {/* Content */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 md:p-12 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {role === "student" ? "Complete Your Student Profile" : "Complete Your Organizer Profile"}
              </h2>
              <p className="text-muted-foreground">
                {role === "student" 
                  ? "Tell us about yourself to get started with hackathons"
                  : "Set up your organizer profile to start managing hackathons"}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg">
                {error}
              </div>
            )}

            {role === "student" ? (
              <StudentOnboardingForm
                profile={studentProfile}
                setProfile={setStudentProfile}
                currentStep={currentStep}
              />
            ) : (
              <OrganizerOnboardingForm
                profile={organizerProfile}
                setProfile={setOrganizerProfile}
                currentStep={currentStep}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-border">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center justify-center gap-2 flex-1 py-3 px-4 border border-border rounded-lg font-medium text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={handleNext}
                className="flex items-center justify-center gap-2 flex-1 py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all"
              >
                {currentStep === totalSteps - 1 ? "Complete Profile" : "Next"}
                {currentStep < totalSteps - 1 && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  )
}
