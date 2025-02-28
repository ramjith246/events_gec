// components/Button.tsx
export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return <button className={`px-4 py-2 rounded-lg transition-colors ${className}`} {...props} />;
  }