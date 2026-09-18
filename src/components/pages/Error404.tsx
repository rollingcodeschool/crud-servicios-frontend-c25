import { Link } from 'react-router';
import error from '../../assets/404.png'
const Error404 = () => {
    return (
        <div className='flex flex-col justify-center items-center'>
            <img src={error} alt="Error 404" />
            <p className="text-2xl ">pagina no encontrada 404</p>
            <Link to={'/'} className='text-blue-400 hover:underline'>Vuelve al inicio</Link>
        </div>
    );
};

export default Error404;