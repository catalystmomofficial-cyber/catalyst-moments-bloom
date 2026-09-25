import { describe, expect, it } from 'vitest';
import { validateImageUpload } from './uploadValidation';
import { productQuote } from '../../supabase/functions/_shared/productCatalog';
import { detectFAQSchema } from '../utils/faqSchemaDetector';

describe('payment pricing', () => {
  it('calculates known product amounts on the server', () => {
    expect(productQuote('momodoro-planner', 200, 300).amount).toBe(1000);
  });
  it('rejects forged points and unavailable products', () => {
    for (const points of [-1, 0.5, 1200, NaN, 301]) expect(() => productQuote('momodoro-planner', points, 300)).toThrow();
    expect(() => productQuote('sleep-reset-guide', 0, 0)).toThrow();
    expect(() => productQuote('__proto__', 0, 0)).toThrow();
  });
});
describe('image validation', () => {
  it('rejects executable extensions and active SVG', () => {
    for (const name of ['test.php', 'test.jsp', 'test.html', 'test.svg']) {
      expect(() => validateImageUpload({ name, type: 'image/png', size: 100 })).toThrow();
    }
  });
  it('rejects oversized files and allows matching raster types', () => {
    expect(() => validateImageUpload({ name: 'a.png', type: 'image/png', size: 11 * 1024 * 1024 })).toThrow();
    expect(() => validateImageUpload({ name: 'a.png', type: 'image/png', size: 100 })).not.toThrow();
  });
});
it('extracts FAQ text without script content', () => {
  const result = detectFAQSchema('<h3>How does this work?</h3><p>Safe answer<script>alert(1)</script><img src=x onerror=alert(2)></p>');
  expect(result[0].answer).toBe('Safe answer');
});
