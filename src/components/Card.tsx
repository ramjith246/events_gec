// components/Card.tsx
export function Card({ children, className, ...props }: { children: React.ReactNode; className?: string }) {
    return (
      <div className={`border border-gray-700 rounded-lg overflow-hidden ${className}`} {...props}>
        {children}
      </div>
    );
  }
  
  export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={`p-4 ${className}`}>{children}</div>;
  }