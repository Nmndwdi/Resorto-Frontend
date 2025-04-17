import Toaster from '../common/toaster';

async function httpErrorHandle(response)
{
    // console.log(response.status);
    switch(response.status)
    {
        case 200:
            onSuccess();
            break;
        case 400:
            const data400=await response.json();
            Toaster(data400['msg'],"info");
            break;
        case 500:
            const data500=await response.json();
            Toaster(data500['error'],"error");
            break;
        default:
            Toaster("something weird happenened , please restart!","info");
            break;
    }
}

export default httpErrorHandle;