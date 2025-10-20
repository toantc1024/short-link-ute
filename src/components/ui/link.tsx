import React from "react";

const Link = ({
  to,
  title,
  className,
  children,
}: {
  to: string;
  title?: string;
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={className}
      onClick={() => {
        window.location.href = to;
      }}
      title={title}
    >
      {children}
    </div>
  );
};

export default Link;
