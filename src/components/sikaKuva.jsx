import { useState, } from "react";
import SikaImg from "../assets/sika_head.svg"
import SIKA_BACKGROUND from '../assets/glow.svg'

const SikaKuva = ({handleClick}) => {
	const [animated, setAnimated] = useState(0)
	const [plus, setPlus] = useState(0)
	return(
		<div id='sika-img-div'>
			<div id='plus-one-div' class='sika-button'>
				{Array(plus).fill(0).map((_, i) => <div class='plus-one' onAnimationEnd={() => setPlus(Math.floor(plus/2))}>+1</div>)}
			</div>
			<img
				onClick={() =>{setAnimated(1);
				 				setPlus(plus+1);
								handleClick();}}
				onAnimationEnd={() => setAnimated(0)}
				src={SikaImg}
				id='sika-img'
				class='sika-button'
				alt='Sian kuva'
				animated={animated}
			/>
			<img id='sika-background' class='sika-button' src={SIKA_BACKGROUND} alt=''/>
		</div>)}

export {SikaKuva}