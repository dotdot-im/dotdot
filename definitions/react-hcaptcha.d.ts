// Type definitions for React hCaptcha 0.1.1
// Project: https://github.com/hCaptcha/react-hcaptcha
// Definitions by: Alejandro U. Alvarez <https://github.com/aurbano>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.8

declare module  'react-hcaptcha'

// import * as React from 'react';
// export default hCaptcha;


// export { hCaptcha };

// declare class hCaptcha extends React.Component<hCaptchaProps> {
// 	/**
// 	 * Resets the hCaptcha widget
// 	 */
// 	reset(): void;
// 	/**
// 	 * Programatically invoke the hCaptcha check. Used if the invisible hCaptcha is on a div instead of a button
// 	 */
// 	execute(): void;

// 	/**
// 	 * Gets the response for the hCaptcha widget.
// 	 * @return the response of the hCaptcha widget.
// 	 */
//   getValue(): string | null;

// 	/**
// 	 * Gets the widgetId of hCaptcha widget
// 	 * @return widgetId | null
// 	 */
// 	getWidgetId(): number | null;
// }

// type Theme = "light" | "dark";
// type Type = "image" | "audio";
// type Size = "compact" | "normal" | "invisible";
// type Badge = "bottomright" | "bottomleft" | "inline";

// export interface hCaptchaProps {
// 	/**
// 	 *  The API client key
// 	 */
// 	sitekey: string;
// 	/**
// 	 *  The function to be called when the user successfully completes the normal or compat captcha.
// 	 * 	It will also be called with null, when captcha expires
// 	 *  @param token string or null
// 	 */
//     onVerify?: (token: string|null) => void;

//     /**
//      *  if you are using the barebone component you need to provide access  to the google ghCaptcha object.
//      */
//     ghCaptcha?: object;

// 	/**
// 	 *  Optional light or dark theme of the widget
// 	 *  @default "light"
// 	 */
// 	theme?: Theme;
// 	/**
// 	 * Optional image or audio The type of initial captcha
// 	 * @default "image"
// 	 */
// 	type?: Type;
// 	/**
// 	 *  Optional the tabindex of the element
// 	 *  @default 0
// 	 */
// 	tabindex?: number;
// 	/**
// 	 *  Optional callback, called when a challenge expires and has to be redone by the user.
// 	 */
// 	onExpired?: () => void;
// 	/**
// 	 *  Optional callback, called when hCaptcha encounters an error (usually network connectivity)
// 	 *  and cannot continue until connectivity is restored. If you specify a function here, you are
// 	 *  responsible for informing the user that they should retry.
// 	 */
// 	onErrored?: () => void;
// 	/**
// 	 *  Optional set the stoken parameter, which allows the captcha to be used from different domains,
// 	 *  @see hCaptcha secure-token
// 	 */
// 	stoken?: string;
// 	/**
// 	 *  Optional. Forces the widget to render in a specific language. Auto-detects the user's language if unspecified.
// 	 */
// 	hl?: string;
// 	/**
// 	 *  Optional compact, normal or invisible. This allows you to change the size or do an invisible captcha
// 	 */
// 	size?: Size;
// 	/**
// 	 * Optional. The badge location for hCaptcha with size of "invisible".
// 	 *
// 	 * @default "bottomright"
// 	 */
// 	badge?: Badge;
// }
