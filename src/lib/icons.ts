import { library } from '@fortawesome/fontawesome-svg-core'

/**
 * Icon Preloading
 * This is done so that only the icons that we need are loaded from FontAwesome
 */

// Icons available in two styles, regular and solid
// solid tends to have all free icons, while some regular ones are PRO only
import { faLock, faLockOpen, faCircle, faDotCircle, faCircleNotch, faCode, faCog, faArrowAltCircleDown, faMeh } from '@fortawesome/free-solid-svg-icons'

import {
  faDotCircle as farDotCircle,
  faMeh as farMeh,
} from "@fortawesome/free-regular-svg-icons";

/**
 * All icons that will be used in this app need to be preloaded here
 */
library.add(faLock, faLockOpen, faCircle, faDotCircle, farDotCircle, faCircleNotch, faCode, faCog, faArrowAltCircleDown, faMeh, farMeh)

