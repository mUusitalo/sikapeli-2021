import { calculatePrice, } from  "../game-logic/purchase-logic.js"
import { GamestateVariables, } from "../game-logic/gamestate-variables";
import { Icons, } from './icons.jsx'
import { Gamestate, } from '../game-logic/gamestate'

const StoreItem = ({gamestate, generator, onClick}) =>(
	<button onClick={() => onClick(generator)} disabled={!gamestate.canBuy(generator)} class='store-item'>
		<div class="item-info-with-icon">
			<img class="icon" src={Icons[generator]} alt={GamestateVariables[generator]}/>
			<div class="item-info">
				<div class="item-name">{generator}</div>
				<div class="item-price">{calculatePrice(generator, gamestate[generator]+1).toExponential(2)}</div>
			</div>
		</div>
	<div class="item-amount">{gamestate[generator]}</div>
	</button>
)

export {StoreItem}