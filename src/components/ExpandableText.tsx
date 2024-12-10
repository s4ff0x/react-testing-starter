import { useState } from "react";

const ExpandableText = ({ text }: { text: string }) => {
  const limit = 255;
  const [isExpanded, setExpanded] = useState(false);

  if (text.length <= limit) return <article>{text}</article>;

  return (
    <div>
      {isExpanded ? (
        <article data-testid={"short"}>{text}</article>
      ) : (
        <article data-testid={"long"}>{text.substring(0, limit)}...</article>
      )}
      <button onClick={() => setExpanded(!isExpanded)}>
        {isExpanded ? "Show Less" : "Show More"}
      </button>
    </div>
  );
};

export default ExpandableText;
