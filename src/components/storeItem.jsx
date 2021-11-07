import { calculatePrice, } from  "../game-logic/purchase-logic.js"
import { GamestateVariables, } from "../game-logic/gamestate-variables";
import { Icons, } from './icons.jsx'
import { Gamestate, } from '../game-logic/gamestate'
import { generatorSpecs, } from '../game-logic/generators'

const StoreItem = ({gamestate, generator, onClick}) =>(
	<button onClick={() => onClick(generator)} disabled={!gamestate.canBuy(generator)} class='store-item'>
		<div class="item-info-with-icon">
			<img class="icon" src={Icons[generator]} alt={GamestateVariables[generator]}/>
			<div class="item-info">
				<div class="item-name">{generator}</div>
				<div class="item-price">
					{gamestate.formatNumber(calculatePrice(generator, gamestate[generator]+1), 2)}
					<img class="price-icon" src={Icons[GamestateVariables.PEKONI]}/>
				</div>
				<div class="item-price">
					{(generator != GamestateVariables.RESET) ? generatorSpecs[generator].rate : 0}
					<img class="price-icon" src={Icons[GamestateVariables.PEKONI]}/> / S
				</div>
			</div>
		</div>
	<div class="item-amount">{gamestate[generator]}</div>
	</button>
)

export {StoreItem}