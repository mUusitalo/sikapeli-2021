import {calculatePrice, } from  "../game-logic/purchase-logic.js"

const PurchaseButton = ({gamestate, generator, onClick, canBuy}) =>(
	<button onClick={onClick} disabled={!canBuy}>
		{generator} {calculatePrice(generator, gamestate[generator]+1)}
	</button>
)

export {PurchaseButton}