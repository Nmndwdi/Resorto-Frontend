import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Toaster(message,type)
{
    const position="bottom-left";
    const autoClose=5000;
    const hideProgressBar=false;
    const closeOnClick=true;
    const pauseOnHover=true;
    const draggable=true;
    const progress=undefined;
    const theme="light";

    switch(type)
    {
        case "success":
            toast.success(message, {
                position: position,
                autoClose: autoClose,
                hideProgressBar: hideProgressBar,
                closeOnClick: closeOnClick,
                pauseOnHover: pauseOnHover,
                draggable: draggable,
                progress: progress,
                theme: theme,
                });
            break;
        case "info":
            toast.info(message, {
                position: position,
                autoClose: autoClose,
                hideProgressBar: hideProgressBar,
                closeOnClick: closeOnClick,
                pauseOnHover: pauseOnHover,
                draggable: draggable,
                progress: progress,
                theme: theme,
                });
            break;

        case "error":
            toast.error(message, {
                position: position,
                autoClose: autoClose,
                hideProgressBar: hideProgressBar,
                closeOnClick: closeOnClick,
                pauseOnHover: pauseOnHover,
                draggable: draggable,
                progress: progress,
                theme: theme,
                });
            break;

        case "warn":
            toast.warn(message, {
                position: position,
                autoClose: autoClose,
                hideProgressBar: hideProgressBar,
                closeOnClick: closeOnClick,
                pauseOnHover: pauseOnHover,
                draggable: draggable,
                progress: progress,
                theme: theme,
                });
            break;

        default:
            toast(message, {
                position: position,
                autoClose: autoClose,
                hideProgressBar: hideProgressBar,
                closeOnClick: closeOnClick,
                pauseOnHover: pauseOnHover,
                draggable: draggable,
                progress: progress,
                theme: theme,
                });
            break;
    }
}

export default Toaster