import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

const faqData = [
  {
    question: "What makes AI Interview Wizard different from other coding practice platforms?",
    answer: "AI Interview Wizard uniquely combines technical practice with communication skills development. Unlike traditional platforms that focus solely on coding, our AI interviewer provides real-time feedback on both your code quality and how well you explain your thought process.",
  },
  {
    question: "How does the AI interviewer evaluate my performance?",
    answer: "Our AI evaluates multiple aspects of your interview performance: code correctness, time complexity, space efficiency, coding style, and most importantly, how clearly you communicate your problem-solving approach. You receive detailed feedback after each session to help you improve.",
  },
  {
    question: "What types of coding problems are available?",
    answer: "We offer a comprehensive range of problems covering data structures, algorithms, system design, and more. Problems are categorized by difficulty level and frequently updated to match current interview patterns from top tech companies.",
  },
  {
    question: "Can I practice in my preferred programming language?",
    answer: "Yes! AI Interview Wizard supports all major programming languages including Python, Java, JavaScript, C++, and more. You can switch between languages and practice the same problem in different languages to broaden your skills.",
  },
  {
    question: "How do I track my progress?",
    answer: "Our platform provides detailed analytics on your performance trends, including metrics on problem-solving speed, communication clarity, and code quality. You can review past sessions, track improvement over time, and identify areas needing more practice.",
  },
  {
    question: "Is my practice data private and secure?",
    answer: "Absolutely! All your code, communication recordings, and practice sessions are completely private and securely stored. We use enterprise-grade encryption to ensure your interview preparation remains confidential.",
  },
];

export function FAQ() {
  return (
    <div className="pb-24 sm:pb-32">
      <div className="max-w-2xl mx-auto lg:text-center">
        <p className="font-semibold leading-7 text-primary-green">Common Questions</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <p className="mt-6 text-base leading-snug text-muted-foreground">
          Have questions about how AI Interview Wizard can help you prepare for technical interviews? Find answers to common questions below, or reach out to our team for more information.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
        <Accordion.Root type="single" collapsible>
          {faqData.map((faq, index) => (
            <Accordion.Item key={index} value={`item-${index}`} className="border-b py-4">
              <Accordion.Header>
                <Accordion.Trigger className="w-full flex justify-between items-center text-left font-semibold text-lg">
                  {faq.question}
                  <ChevronDown className="ml-2 w-5 h-5 transition-transform duration-300" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="mt-4 text-sm text-muted-foreground">
                {faq.answer}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </div>
  );
}