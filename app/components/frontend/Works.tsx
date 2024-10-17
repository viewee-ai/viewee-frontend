import { UserCheck, FileText, Monitor, Layout } from 'lucide-react';

const steps = [
  {
    name: 'Log in or Sign up',
    description:
      'Begin by creating an account or logging in to access your personalized dashboard.',
    icon: UserCheck,
  },
  {
    name: 'Create Your Chatbot',
    description:
      'Set up your AI-driven chatbot in just a few clicks. Choose a name, configure settings, and get ready to engage users.',
    icon: Monitor,
  },
  {
    name: 'Design Conversations',
    description:
      'Craft dynamic conversation flows easily with our intuitive editor. Create and manage multiple chat sequences effortlessly.',
    icon: FileText,
  },
  {
    name: 'Launch and Engage',
    description:
      'Once your chatbot is ready, deploy it instantly and start engaging with your audience.',
    icon: Layout,
  },
];

export function HowItWorks() {
  return (
    <div className="pb-24 sm:pb-32">
      <div className="max-w-2xl mx-auto lg:text-center">
        <p className="font-semibold leading-7 text-primary-green">How It Works</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Build your AI Chatbot in 4 Easy Steps
        </h2>
        <p className="mt-6 text-base leading-snug text-muted-foreground">
          Follow these steps to create your chatbot, design conversations, and start engaging with
          users in minutes.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-2xl sm:mt-16 lg:mt-24 lg:max-w-4xl">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2 lg:gap-y-16">
          {steps.map((step) => (
            <div key={step.name} className="relative pl-16">
              <div className="text-base font-semibold leading-7">
                <div className="absolute left-0 top-0 flex items-center justify-center rounded-lg bg-primary size-10">
                  <step.icon className="w-6 h-6 text-white dark:text-primary-green" />
                </div>
                {step.name}
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-snug">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
