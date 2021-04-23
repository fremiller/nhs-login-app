//
// NHS colour palette
//
// Colours are prefixed with color_ to make them easier to
// search for within the code base.
//
// We also prefix them with nhsuk- to prevent clashing with
// other colours in existing code bases.
//
// We use the word color, not colour, for variables.
//

export const BackgroundColor = '#f0f4f5';

// sass-lint:disable no-color-hex
export const Blue = '#005eb8';
export const White = '#ffffff';
export const Black = '#212b32';
export const Green = '#007f3b';
export const Purple = '#330072';
export const DarkPink = '#7C2855';
export const Red = '#d5281b';
export const Yellow = '#ffeb3b';

//
// Secondary colours
//

export const PaleYellow = '#fff9c4';
export const WarmYellow = '#ffb81C';
export const Orange = '#ED8B00';
export const AquaGreen = '#00A499';
export const Pink = '#AE2573';

//
// Greyscale
//

export const Grey1 = '#4c6272';
export const Grey2 = '#768692';
export const Grey3 = '#aeb7bd';
export const Grey4 = '#d8dde0';
export const Grey5 = '#f0f4f5';

//
// RGB and alpha values
//
// Used to create drop/box shadows e.g. for search suggestions dropdown
//

// $color_nhsuk-grey-1-rgb: rgb(66, 84, 98);
// $alpha-transparency-50: .5;

//
// Functions for tint and shade
//
// Usage: tint(color, percentage)
//        tint($color_nhsuk-black, 10%)
//        shade(color, percentage)
//        shade($color_nhsuk-blue, 50%)
//

// @function tint($color, $percentage) {
//   @return mix(white, $color, $percentage);
// }

// function mix(color1: string, color2: string, percentage: string){
//     const percentage_int = Number.parseInt(percentage.replace("%", ""));
//     const color_c = Colors()
// }

// @function shade($color, $percentage) {
//   @return mix(black, $color, $percentage);
// }

//
// Primary colour variations
//
// 1. used for link :active states
// 2. used for .is-active state on main navigation
// 3. used for :hover states on main navigation
// 4. used for :active states on main navigation
// 5. used for primary button and action link icon :hover states
// 6. used for primary button and action link icon :active states
//

// $color_tint_nhsuk-black-10: tint($color_nhsuk-black, 10%); // [1] //

// $color_shade_nhsuk-blue-20: shade($color_nhsuk-blue, 20%); // [2] //
// $color_shade_nhsuk-blue-35: shade($color_nhsuk-blue, 35%); // [3] //
// $color_shade_nhsuk-blue-50: shade($color_nhsuk-blue, 50%); // [4] //

// $color_shade_nhsuk-green-35: shade($color_nhsuk-green, 35%); // [5] //
// $color_shade_nhsuk-green-50: shade($color_nhsuk-green, 50%); // [6] //

// $color_transparent_nhsuk-white-20: rgba($color_nhsuk-white, .2);
// $color_transparent_nhsuk-blue-50: rgba($color_shade_nhsuk-blue-50, .1);

//
// Colour aliases
//

// Text
export const TextColor = Black;
export const SecondaryTextColor = Grey1;
export const PrintTextColor = Black;

// Links
export const LinkColor = Blue;
export const LinkHoverColor = DarkPink;
// $nhsuk-link-active-color: shade($nhsuk-link-color, 50%);
export const LinkVisitedColor = Purple;

// Focus
export const FocusColor = Yellow;
export const FocusTextColor = Black;

// Border
export const BorderColor = Grey4;
// $nhsuk-secondary-border-color: $color_transparent_nhsuk-white-20;

// Box shadow
// $nhsuk-box-shadow: rgba(33, 43, 50, .16);
// export const box-shadow-color = grey-1-rgb;

//
// Forms
//

export const ErrorColor = Red;
export const FormBorderColor = Grey1;
export const FormElementBackgroundColor = White;

//
// Buttons
//

export const ButtonColor = Green;
// $nhsuk-button-hover-color: shade($nhsuk-button-color, 20%);
// $nhsuk-button-active-color: shade($nhsuk-button-color, 50%);
// $nhsuk-button-shadow-color: shade($nhsuk-button-color, 50%);

export const SecondaryButtonColor = Grey1;
// $nhsuk-secondary-button-hover-color: shade($nhsuk-secondary-button-color, 20%);
// $nhsuk-secondary-button-active-color: shade($nhsuk-secondary-button-color, 50%);
// $nhsuk-secondary-button-shadow-color: shade($nhsuk-secondary-button-color, 50%);

export const ReverseButtonColor = White;
// $nhsuk-reverse-button-hover-color: shade($nhsuk-reverse-button-color, 20%);
// $nhsuk-reverse-button-active-color: $color-nhsuk-black;
// $nhsuk-reverse-button-shadow-color: $color-nhsuk-black;

export const ButtonTextColor = White;
export const ReverseButtonTextColor = Black;
