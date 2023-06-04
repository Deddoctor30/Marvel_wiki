import Skeleton from "../components/skeleton/Skeleton";
import Spinner from "../components/spinner/Spinner";
import Error from "../components/onError/Error";

const setContent = (process, Component, data) => {
   switch(process) {
       case 'waiting':
           return <Skeleton/>;
           break;
       case 'loading':
           return <Spinner/>;
           break;
       case 'confirmed':
           return <Component data={data}/>
           break;
       case 'error':
           return <Error/>
           break;
       default:
           throw new Error('Error');
   }
}

export default setContent;