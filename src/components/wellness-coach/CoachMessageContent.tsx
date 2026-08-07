import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Renders the coach's reply.
 *
 * The coach is told to send her to exact places, so an in-app path has to be
 * tappable — a woman with a baby on her arm is not retyping a URL. Handles
 * markdown links, bare in-app paths, and **bold**; everything else stays plain
 * text so nothing the model writes can inject markup.
 */

const boldSegments = (text: string, keyPrefix: string): React.ReactNode[] =>
  text.split(/(\*\*[^*]+\*\*)/g).map((seg, i) =>
    seg.startsWith('**') && seg.endsWith('**') && seg.length > 4 ? (
      <strong key={`${keyPrefix}-b${i}`}>{seg.slice(2, -2)}</strong>
    ) : (
      <React.Fragment key={`${keyPrefix}-t${i}`}>{seg}</React.Fragment>
    ),
  );

// [label](/path) | [label](https://…) | bare /in-app/path
const PATTERN = /\[([^\]]+)\]\((\/[^\s)]*|https?:\/\/[^\s)]+)\)|(?<![\w[(])(\/[a-z0-9][a-z0-9\-/]*(?:\?[a-z0-9=&_-]+)?)/gi;

const renderLine = (line: string, keyPrefix: string): React.ReactNode[] => {
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  const re = new RegExp(PATTERN);

  while ((m = re.exec(line)) !== null) {
    if (m.index > last) out.push(...boldSegments(line.slice(last, m.index), `${keyPrefix}-${last}`));

    const label = m[1];
    const href = m[2] ?? m[3];
    const key = `${keyPrefix}-l${m.index}`;

    if (href.startsWith('/')) {
      out.push(
        <Link key={key} to={href} className="text-catalyst-copper font-medium underline underline-offset-2">
          {label ?? href}
        </Link>,
      );
    } else {
      out.push(
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-catalyst-copper font-medium underline underline-offset-2"
        >
          {label ?? href}
        </a>,
      );
    }
    last = m.index + m[0].length;
  }

  if (last < line.length) out.push(...boldSegments(line.slice(last), `${keyPrefix}-${last}`));
  return out;
};

const CoachMessageContent = ({ content }: { content: string }) => (
  <div className="whitespace-pre-wrap break-words leading-relaxed">
    {content.split('\n').map((line, i) => (
      <React.Fragment key={`ln-${i}`}>
        {i > 0 && <br />}
        {renderLine(line, `ln-${i}`)}
      </React.Fragment>
    ))}
  </div>
);

export default CoachMessageContent;
