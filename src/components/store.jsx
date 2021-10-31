import { StoreItem, } from './storeItem.jsx'
import { GamestateVariables, } from "../game-logic/gamestate-variables";

const Store = (({gamestate, handleClick}) => {
    return(
    Object.values(GamestateVariables)
          .filter(variable => variable !== GamestateVariables.PEKONI)
          .map((variable) => <StoreItem gamestate={gamestate} generator={variable} onClick={() => handleClick(variable)}/>)
    )
})

export { Store, }