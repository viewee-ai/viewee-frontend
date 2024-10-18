import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

const faqData = [
  {
    question: "What sets Converse AI apart from other chatbot platforms?",
    answer: "Converse AI is designed to be intuitive and powerful. Our platform offers easy setup, advanced NLP capabilities, and seamless integrations, enabling you to create highly effective chatbots in minutes.",
  },
  {
    question: "How secure is Converse AI for my data and user interactions?",
    answer: "Security is a top priority at Converse AI. With multi-layered authentication, secure APIs, and encrypted data storage, your data and your users’ interactions are always protected.",
  },
  {
    question: "Can I customize the behavior and design of my chatbot?",
    answer: "Absolutely! Converse AI provides extensive customization options, allowing you to tailor both the behavior and appearance of your chatbot to fit your brand and specific use cases.",
  },
  {
    question: "How does Converse AI handle integrations with other platforms?",
    answer: "Converse AI integrates seamlessly with various platforms including CRM systems, customer support tools, and payment gateways, making it easy to extend the functionality of your chatbot.",
  },
  {
    question: "Is Converse AI scalable?",
    answer: "Yes! Converse AI is built to scale with your needs. Whether you’re starting with a single chatbot or managing multiple bots across different channels, our platform ensures reliable performance as you grow.",
  },
];

export function FAQ() {
  return (
    <div className="pb-24 sm:pb-32">
      <div className="max-w-2xl mx-auto lg:text-center">
        <p className="font-semibold leading-7 text-primary-green">Got Questions?</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <p className="mt-6 text-base leading-snug text-muted-foreground">
          Have questions? We’ve got answers. Explore our FAQ section to learn more about Converse AI and how you can build and deploy chatbots quickly and effectively.
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
