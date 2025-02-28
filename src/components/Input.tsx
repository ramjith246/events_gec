// components/Input.tsx
export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return <input className={`border border-gray-700 p-2 rounded-lg bg-gray-800 text-white ${className}`} {...props} />;
  }