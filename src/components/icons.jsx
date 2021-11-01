import { GamestateVariables, } from "../game-logic/gamestate-variables";

import PEKONI_IMG from "../assets/bacon.png"
import RESET_IMG from "../assets/reset.png"
import REVOLVERI_IMG from "../assets/revolveri.png"
import COWBOY_IMG from "../assets/hevonen.png"
import SALUUNA_IMG from "../assets/saluuna.png"
import KYLA_IMG from "../assets/kyla.png"
import KULTAKAIVOS_IMG from "../assets/kultakaivos.png"
import SIKAIMPERIUMI_IMG from "../assets/sikaimperiumi.png"
import SIKALAUMA_IMG from "../assets/sikalauma.jpg"
import SIKAFARMI_IMG from "../assets/sikafarmi.png"

const Icons = {
	[GamestateVariables.PEKONI]: PEKONI_IMG,
	[GamestateVariables.RESET]: RESET_IMG,
	[GamestateVariables.SIKAIMPERIUMI]: SIKAIMPERIUMI_IMG,
	[GamestateVariables.REVOLVERI]: REVOLVERI_IMG,
	[GamestateVariables.COWBOY]: COWBOY_IMG,
	[GamestateVariables.KYLA]: KYLA_IMG,
	[GamestateVariables.SALUUNA]: SALUUNA_IMG,
	[GamestateVariables.SIKALAUMA]: SIKALAUMA_IMG,
	[GamestateVariables.SIKAFARMI]: SIKAFARMI_IMG,
	[GamestateVariables.KULTAKAIVOS]: KULTAKAIVOS_IMG
}

Object.freeze(Icons)

export { Icons, }