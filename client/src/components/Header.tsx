import { CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <CheckSquare className="w-6 h-6" />
          <span>TaskFlow</span>
        </Link>
      </div>
    </header>
  );
}
