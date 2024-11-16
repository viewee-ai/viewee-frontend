import {
  Code,
  MessageSquare,
  Brain,
  Target,
  LineChart,
  Shield,
} from "lucide-react";

const features = [
  {
    name: "Real-time Code Analysis",
    description:
      "Get instant feedback on your code quality, complexity, and performance with our advanced AI analysis system.",
    icon: Code,
  },
  {
    name: "Communication Skills Feedback",
    description:
      "Practice explaining your thought process with Viewee that evaluates your technical communication clarity.",
    icon: MessageSquare,
  },
  {
    name: "Adaptive AI Interviewer",
    description:
      "Experience interviews that adapt to your skill level and provide personalized challenges to help you improve.",
    icon: Brain,
  },
  {
    name: "Interview Performance Tracking",
    description:
      "Track your progress over time with detailed metrics on problem-solving speed, communication clarity, and code quality.",
    icon: LineChart,
  },
  {
    name: "Technical Interview Preparation",
    description:
      "Access a wide range of real-world coding problems commonly asked in top tech company interviews.",
    icon: Target,
  },
  {
    name: "Private and Secure Practice",
    description:
      "Practice with confidence knowing your code and interview sessions are completely private and secure.",
    icon: Shield,
  },
];

export function Features() {
  return (
    <div className="py-24 sm:py-32">
      <div className="max-w-2xl mx-auto lg:text-center">
        <p className="font-semibold leading-7 text-primary-green text-4xl pb-5">
          Master Technical Interviews
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-2xl">
          Practice Like It's The Real Thing
        </h1>
        <p className="mt-4 text-lg leading-snug text-muted-foreground">
          Don't just solve coding problems—learn to communicate your solutions
          effectively. Viewee provides a realistic interview environment where
          you can practice both your technical and communication skills.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-2xl sm:mt-16 lg:mt-24 lg:max-w-4xl">
        <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
          {features.map((feature) => (
            <div key={feature.name} className="relative pl-16">
              <div className="text-2xl font-semibold leading-7">
                <div className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-primary">
                  <feature.icon className="w-6 h-6 text-white dark:text-primary-green" />
                </div>
                {feature.name}
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-snug">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
