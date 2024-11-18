import { UserCheck, Code, MessageSquare, Award } from "lucide-react";

const steps = [
  {
    name: "Create Your Account",
    description:
      "Sign up to get instant access to AI-powered technical interviews. Set up your profile and track your progress over time.",
    icon: UserCheck,
  },
  {
    name: "Choose Your Challenge",
    description:
      "Select from a variety of coding problems ranging from data structures to algorithms. Pick your preferred difficulty level and programming language.",
    icon: Code,
  },
  {
    name: "Practice With AI",
    description:
      "Engage with our AI interviewer that provides real-time feedback on your code and communication. Explain your thought process as you solve problems.",
    icon: MessageSquare,
  },
  {
    name: "Track & Improve",
    description:
      "Review your performance metrics, identify areas for improvement, and track your progress as you master technical interviewing skills.",
    icon: Award,
  },
];

export function HowItWorks() {
  return (
    <div className="pb-24 sm:pb-32">
      <div className="max-w-2xl mx-auto lg:text-center">
        <p className="font-semibold leading-7 text-primary-green text-4xl pb-5">
          How It Works
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-2xl">
          Master Technical Interviews in 4 Steps
        </h2>
        <p className="mt-6 text-lg leading-snug text-muted-foreground">
          Follow this proven process to improve both your coding skills and
          communication ability. Practice with Viewee and get ready for your
          next technical interview.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-2xl sm:mt-16 lg:mt-24 lg:max-w-4xl">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2 lg:gap-y-16">
          {steps.map((step) => (
            <div key={step.name} className="relative pl-16">
              <div className="text-2xl font-semibold leading-7">
                <div className="absolute left-0 top-0 flex items-center justify-center rounded-lg bg-primary size-10">
                  <step.icon className="w-6 h-6 text-white dark:text-primary-green" />
                </div>
                {step.name}
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-snug">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
