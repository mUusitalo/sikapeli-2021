import { v1 as uuidv1 } from 'uuid';
import { useState, onMouseMove, } from "react";
import SikaImg from "../assets/sika_head.svg"
import SIKA_BACKGROUND from '../assets/glow.svg'

const SikaKuva = ({handleClick, baconPerClick}) => {
	const [animated, setAnimated] = useState(0)
	const [plus, setPlus] = useState([])

	return(
		<div id='sika-img-div'>
			<img
				onClick={(e) => {
					setAnimated(1);
					if(plus.length > 20) {
						setPlus(plus.slice(9))
					} else {
						setPlus(plus.concat([[e.clientX, e.clientY, uuidv1().slice(0, 8)]]));
					}
					handleClick()
				}}
				onAnimationEnd={() => setAnimated(0)}
				src={SikaImg}
				id='sika-img'
				class='sika-button'
				alt='Sian kuva'
				animated={animated}
			/>
			{plus.map((e, i) => <div className='plus-one sika-button unselectable'
													unselectable="on"
													key={e[2]}
													style={{
														"position": "fixed",
														"left": e[0],
														"top": e[1]
													}}
												>
													+{baconPerClick.toFixed(2)}
												</div>)}

			<img id='sika-background' className='sika-button' src={SIKA_BACKGROUND} alt=''/>
		</div>)}


export {SikaKuva}