const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`w-[94%] lg:w-[84%] mx-auto ${className}`}>{children}</div>
  );
};

export default Container;
