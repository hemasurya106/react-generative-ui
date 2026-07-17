import React, { useState } from 'react';
import { z } from 'zod';
import { CodeBlockSchema } from './CodeBlock.schema';

export { CodeBlockSchema };

export type CodeBlockProps = z.infer<typeof CodeBlockSchema>;

function tokenizeLine(line: string) {
  const tokenRegex = /(\/\/.*)|(".*?"|'.*?'|`.*?`)|(\b(?:const|let|var|function|return|import|export|from|class|extends|if|else|for|while|do|switch|case|break|continue|new|try|catch|finally|throw|typeof|instanceof|public|private|protected|async|await|interface|type)\b)|(\b\d+\b)|([a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\())|([a-zA-Z_$][a-zA-Z0-9_$]*)|([^\s\w]+)/g;

  let match;
  let lastIndex = 0;
  const elements: Array<{ text: string; color?: string; fontWeight?: string }> = [];

  tokenRegex.lastIndex = 0;

  while ((match = tokenRegex.exec(line)) !== null) {
    const textBefore = line.slice(lastIndex, match.index);
    if (textBefore) {
      elements.push({ text: textBefore });
    }

    const [
      full,
      comment,
      stringLiteral,
      keyword,
      number,
      functionCall,
      identifier,
      operator
    ] = match;

    if (comment) {
      elements.push({ text: comment, color: '#8e908c' });
    } else if (stringLiteral) {
      elements.push({ text: stringLiteral, color: '#718c00' });
    } else if (keyword) {
      elements.push({ text: keyword, color: '#8959a8', fontWeight: '600' });
    } else if (number) {
      elements.push({ text: number, color: '#f5871f' });
    } else if (functionCall) {
      elements.push({ text: functionCall, color: '#4271ae' });
    } else if (identifier) {
      elements.push({ text: identifier, color: '#4d4d4c' });
    } else if (operator) {
      elements.push({ text: operator, color: '#3e999f' });
    }

    lastIndex = tokenRegex.lastIndex;
  }

  const textAfter = line.slice(lastIndex);
  if (textAfter) {
    elements.push({ text: textAfter });
  }

  return elements;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  filename,
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div style={{
      fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
      fontSize: '0.875rem',
      borderRadius: '0.5rem',
      backgroundColor: '#f8f9fa',
      border: '1px solid #e5e7eb',
      margin: '1rem 0',
      overflow: 'hidden',
      maxWidth: '800px',
      position: 'relative',
    }}>
      {/* Header */}
      {(filename || language || true) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.5rem 1rem',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f3f4f6',
          fontSize: '0.75rem',
          color: '#4b5563',
          fontWeight: 500,
        }}>
          <span>{filename ?? (language ? `${language}` : 'code')}</span>
          <button
            onClick={copyToClipboard}
            style={{
              padding: '0.25rem 0.5rem',
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontSize: '0.75rem',
              color: '#374151',
              transition: 'all 0.2s',
            }}
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        </div>
      )}

      {/* Code Area */}
      <pre style={{
        margin: 0,
        padding: '1rem',
        overflowX: 'auto',
        lineHeight: 1.5,
        backgroundColor: '#f8f9fa',
      }}>
        <code>
          {lines.map((line, i) => {
            const tokens = tokenizeLine(line);
            return (
              <div key={i} style={{ display: 'flex', minHeight: '1.25rem' }}>
                <span style={{
                  color: '#9ca3af',
                  width: '2rem',
                  display: 'inline-block',
                  userSelect: 'none',
                  textAlign: 'right',
                  paddingRight: '0.75rem',
                }}>
                  {i + 1}
                </span>
                <span style={{ whiteSpace: 'pre' }}>
                  {tokens.map((token, tIdx) => (
                    <span
                      key={tIdx}
                      style={{
                        color: token.color,
                        fontWeight: token.fontWeight as any,
                      }}
                    >
                      {token.text}
                    </span>
                  ))}
                </span>
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
};
