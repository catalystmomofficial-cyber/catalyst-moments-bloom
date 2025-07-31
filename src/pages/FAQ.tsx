import PageLayout from '@/components/layout/PageLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ = () => {
  const faqs = [
    {
      question: "Is Catalyst Mom safe during pregnancy?",
      answer: "Yes! All our programs are designed by certified prenatal fitness specialists and reviewed by healthcare professionals. Always consult your doctor before starting any new fitness program."
    },
    {
      question: "Can I use Catalyst Mom if I'm trying to conceive?",
      answer: "Absolutely! We have specialized content for the TTC journey, including fertility-supporting workouts, nutrition guidance, and stress management techniques."
    },
    {
      question: "What if I'm postpartum?",
      answer: "Our postpartum programs are designed to support your recovery journey with safe, progressive exercises and wellness practices suitable for new moms."
    },
    {
      question: "Do I need special equipment?",
      answer: "Most workouts can be done with minimal equipment. We'll specify what you need for each workout, and many can be done with just your body weight."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel anytime through your account settings or by contacting our support team at info.mom@catalystchamber.com."
    }
  ];

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Frequently Asked Questions</h1>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </PageLayout>
  );
};

export default FAQ;