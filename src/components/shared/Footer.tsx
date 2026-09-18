import { Link } from "react-router";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 text-zinc-400 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2 mb-2 text-zinc-500">
            <i className="bi bi-code-slash text-xl"></i>
            <span className="font-semibold text-sm tracking-widest uppercase">Code</span>
          </div>
          
          <p className="text-sm">
            &copy; {currentYear} <span className="text-zinc-200">Todos los derechos reservados</span>
          </p>
          
          <div className="flex gap-4 mt-2 text-xs text-zinc-500 uppercase tracking-tighter">
            <Link to={'/privacidad'} className="hover:text-blue-500 cursor-pointer transition-colors">Privacidad</Link>
            <span>•</span>
            <Link to={'/terminos'} className="hover:text-blue-500 cursor-pointer transition-colors">Términos</Link>
            <span>•</span>
            <Link to={'/contacto'} className="hover:text-blue-500 cursor-pointer transition-colors">Contacto</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;