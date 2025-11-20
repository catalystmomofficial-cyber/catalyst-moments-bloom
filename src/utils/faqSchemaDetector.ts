interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Detects FAQ patterns in HTML content and extracts question-answer pairs
 */
export const detectFAQSchema = (content: string): FAQItem[] => {
  const faqItems: FAQItem[] = [];
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;

  // Pattern 1: Headings followed by paragraphs (common FAQ structure)
  const headings = tempDiv.querySelectorAll('h2, h3, h4');
  headings.forEach((heading) => {
    const headingText = heading.textContent?.trim() || '';
    
    // Check if heading looks like a question
    const isQuestion = 
      headingText.includes('?') ||
      headingText.toLowerCase().startsWith('what ') ||
      headingText.toLowerCase().startsWith('how ') ||
      headingText.toLowerCase().startsWith('why ') ||
      headingText.toLowerCase().startsWith('when ') ||
      headingText.toLowerCase().startsWith('where ') ||
      headingText.toLowerCase().startsWith('who ') ||
      headingText.toLowerCase().startsWith('can ') ||
      headingText.toLowerCase().startsWith('should ') ||
      headingText.toLowerCase().startsWith('is ') ||
      headingText.toLowerCase().startsWith('are ') ||
      headingText.toLowerCase().startsWith('do ') ||
      headingText.toLowerCase().startsWith('does ');

    if (isQuestion) {
      // Get the next element(s) as the answer
      let answer = '';
      let nextElement = heading.nextElementSibling;
      
      // Collect paragraphs until we hit another heading
      while (nextElement && !['H2', 'H3', 'H4'].includes(nextElement.tagName)) {
        if (nextElement.tagName === 'P' || nextElement.tagName === 'UL' || nextElement.tagName === 'OL') {
          answer += nextElement.textContent?.trim() + ' ';
        }
        nextElement = nextElement.nextElementSibling;
      }

      if (answer.trim()) {
        faqItems.push({
          question: headingText,
          answer: answer.trim().substring(0, 500), // Limit answer length
        });
      }
    }
  });

  // Pattern 2: Strong/Bold text followed by regular text (Q: A: format)
  const strongElements = tempDiv.querySelectorAll('strong, b');
  strongElements.forEach((strong) => {
    const strongText = strong.textContent?.trim() || '';
    
    if (
      strongText.toLowerCase().startsWith('q:') ||
      strongText.toLowerCase().startsWith('question:') ||
      strongText.includes('?')
    ) {
      const question = strongText.replace(/^(q:|question:)/i, '').trim();
      
      // Try to get the answer from the same paragraph or next element
      const parent = strong.parentElement;
      let answer = '';
      
      if (parent) {
        // Get text after the strong element in the same paragraph
        const afterText = parent.textContent?.substring(
          parent.textContent.indexOf(strongText) + strongText.length
        ).trim();
        
        if (afterText) {
          answer = afterText.replace(/^(a:|answer:)/i, '').trim();
        }
      }

      if (question && answer && answer.length > 10) {
        faqItems.push({
          question,
          answer: answer.substring(0, 500),
        });
      }
    }
  });

  // Remove duplicates
  const uniqueFAQs = faqItems.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.question === item.question)
  );

  return uniqueFAQs.slice(0, 10); // Limit to 10 FAQ items
};

/**
 * Generates FAQ schema.org structured data
 */
export const generateFAQSchema = (faqItems: FAQItem[]) => {
  if (faqItems.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };
};
