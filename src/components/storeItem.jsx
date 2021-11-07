import { calculatePrice, } from  "../game-logic/purchase-logic.js"
import { GamestateVariables, } from "../game-logic/gamestate-variables";
import { Icons, } from './icons.jsx'
//import { Gamestate, } from '../game-logic/gamestate'
import { generatorSpecs, } from '../game-logic/generators'

const StoreItem = ({gamestate, generator: gamestateVariable, onClick}) => {


	return (<button onClick={() => onClick(gamestateVariable)} disabled={!gamestate.canBuy(gamestateVariable)} class='store-item'>
		<div class="item-info-with-icon">
			<img class="icon" src={Icons[gamestateVariable]} alt={GamestateVariables[gamestateVariable]}/>
			<div class="item-info">
				<div class="item-name">{gamestateVariable}</div>
				<div class="item-price">
					{gamestate.formatNumber(calculatePrice(gamestateVariable, gamestate[gamestateVariable]+1), 2)}
					<BaconIcon/>
				</div>
				<div class="item-price">
					<GenerationRate{...{gamestate, gamestateVariable}}/>
				</div>
			</div>
		</div>
	<div class="item-amount">{gamestate[gamestateVariable]}</div>
	</button>)
}

const GenerationRate = ({gamestate, gamestateVariable}) => {
	switch(gamestateVariable) {
		case GamestateVariables.RESET:
			return null

		case GamestateVariables.KERROIN:
			return (
				<>
					+1%(<BaconIcon/>/s)/click
				</>
			)

		default:
			const generationRate = generatorSpecs[gamestateVariable].rate
			return (
				<>
					{generationRate}<BaconIcon/>/s
				</>
			)
	}
}

const BaconIcon = () => <img class="price-icon" alt="bacon" src={Icons[GamestateVariables.PEKONI]}/>

export {StoreItem}