import { useState, } from "react";
import SikaImg from "../assets/sika_head.svg"
import SIKA_BACKGROND from '../assets/glow.svg'

const SikaKuva = ({handleClick}) => {
	const [animated, setAnimated] = useState(0)
	return(
		<div id='sika-img-div'>
		<img
		 onClick={() =>{setAnimated(1);
						   handleClick();}}
		 onAnimationEnd={() => setAnimated(0)}
		 src={SikaImg}
		 id='sika-img'
		 alt='Sian kuva'
		 animated={animated}
		/>
		<img id='sika-background' src={SIKA_BACKGROND}/>
		</div>)}

export {SikaKuva}