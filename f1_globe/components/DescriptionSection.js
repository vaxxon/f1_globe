// components/DescriptionSection.js
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function DescriptionSection({ mdPath }) {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch(mdPath)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch markdown');
        return res.text();
      })
      .then((text) => setContent(text))
      .catch((err) => {
        console.error(err);
        setContent('Description failed to load.');
      });
  }, [mdPath]);

  return (
    <div className="prose prose-sm mt-4">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
