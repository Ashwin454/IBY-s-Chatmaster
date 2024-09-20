import Image from "next/image";
import MyImage from '../../public/images/logo.png';
const LearnImg = () =>{
    return(
        <>
            <Image src={MyImage} width={100}/>
        </>
    )
}
export default LearnImg;