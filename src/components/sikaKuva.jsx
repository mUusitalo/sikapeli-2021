import { useState, } from "react";

const SikaKuva = ({handleClick}) => {
	const [animated, setAnimated] = useState(0)
	return(<
			img
			onClick={() =>{setAnimated(1);
						   handleClick();}}
			onAnimationEnd={() => setAnimated(0)}
			src='https://i.pinimg.com/originals/7e/a1/e0/7ea1e0331f5e53f14aa0aae202838c42.png'
			id='sika-img'
			alt='Sian kuva'
			animated={animated}
			/>)}

export {SikaKuva}