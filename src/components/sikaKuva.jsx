import { useState, } from "react";
import SikaImg from "../assets/sika_head.png"

const SikaKuva = ({handleClick}) => {
	const [animated, setAnimated] = useState(0)
	return(<
			img
			onClick={() =>{setAnimated(1);
						   handleClick();}}
			onAnimationEnd={() => setAnimated(0)}
			src={SikaImg}
			id='sika-img'
			alt='Sian kuva'
			animated={animated}
			/>)}

export {SikaKuva}