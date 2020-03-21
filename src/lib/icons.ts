import { library } from "@fortawesome/fontawesome-svg-core";

// Icons available in two styles, regular and solid
// solid tends to have all free icons, while some regular ones are PRO only
import {
    faCoins,
    faCreditCard,
    faAt,
    faColumns,
    faCog,
    faArrowUp,
    faArrowDown,
    faSignOutAlt,
    faSignInAlt,
    faSave,
    faQuestionCircle,
    faHeart,
    faAngleRight,
    faSpinner,
    faPlus,
    faTrash,
    faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

import {
    faSmile,
} from "@fortawesome/free-regular-svg-icons";

import {
    faGoogle,
    faGithub,
} from "@fortawesome/free-brands-svg-icons";

/**
 * All icons that will be used in this app need to be preloaded here
 */

export default () => {
  const faGoogleFix: any = faGoogle;
  const faGithubFix: any = faGithub;
  library.add(
    faCoins,
    faCreditCard,
    faAt,
    faColumns,
    faCog,
    faArrowDown,
    faArrowUp,
    faSignOutAlt,
    faSignInAlt,
    faSave,
    faQuestionCircle,
    faSmile,
    faHeart,
    faAngleRight,
    faGoogleFix,
    faGithubFix,
    faSpinner,
    faPlus,
    faTrash,
    faExclamationTriangle,
  );
};
