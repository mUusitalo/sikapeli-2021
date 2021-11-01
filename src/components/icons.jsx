import { GamestateVariables, } from "../game-logic/gamestate-variables";

// import PEKONI_IMG from "../assets/.png"
import RESET_IMG from "../assets/hevonen.png"
import SIKALA_IMG from "../assets/sikala.png"
import REVOLVERI_IMG from "../assets/revolveri.png"
import COWBOYHATTU_IMG from "../assets/hevonen.png"
import BOOTSIT_IMG from "../assets/hevonen.png"
import SALUUNA_IMG from "../assets/saluuna.png"
import RAUTATIE_IMG from "../assets/hevonen.png"
import RAUTATIEASEMA_IMG from "../assets/rautatieasema.png"
import KULTAKAIVOS_IMG from "../assets/kultakaivos.png"

const Icons = {
	[GamestateVariables.PEKONI]: RESET_IMG,
	[GamestateVariables.RESET]: RESET_IMG,  // TODO: get some pic
	[GamestateVariables.SIKALA]: SIKALA_IMG,
	[GamestateVariables.REVOLVERI]: REVOLVERI_IMG,
	[GamestateVariables.COWBOYHATTU]: RESET_IMG,
	[GamestateVariables.BOOTSIT]: RESET_IMG,
	[GamestateVariables.SALUUNA]: SALUUNA_IMG,
	[GamestateVariables.RAUTATIE]: RAUTATIE_IMG,
	[GamestateVariables.RAUTATIEASEMA]: RESET_IMG,
	[GamestateVariables.KULTAKAIVOS]: KULTAKAIVOS_IMG
}

Object.freeze(Icons)

export { Icons, }