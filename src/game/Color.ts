/**
 * Colors and functions operating on them
 */

/**
 * A hex string describing a color, such as '336699'
 */
 export type ColorCode = string;

 /**
  * A specific color. Red, green, and blue components are range 0-255
  */
 export interface Color {
   r: number;
   g: number;
   b: number;
 }

 /**
  * Converts a hex code to a numeric value
  * 
  * @param hexcode Code ranging from 00 to FF
  * @return Value between 0 and 255, or undefined if hexcode could not be converted
  */
 function hexToValue(hexcode: string): number | undefined {
    const value = parseInt(hexcode, 16);

    return value < 0 || value > 255 || isNaN(value) ? undefined : value;
 }

function noUndefinedValues<T>(array: Array<T | undefined>): array is Array<T> {
    return !array.some((x) => x === undefined);
}

 /**
  * Function to convert a ColorCode to the corresponding color
  * 
  * @param color Color to convert
  * @return Converted color, or undefined if the ColorCode could not convert to a valid color
  */
export function codeToColor(color: ColorCode): Color | undefined {
   if (color.length !== 6) {
     console.log(`bailing, could not encode ${color}`);
       return undefined;
   }

   const colorParts = [color.slice(0,2), color.slice(2,4), color.slice(4)];

   const colorValues = colorParts.map((hexcode) => hexToValue(hexcode));

   if (!noUndefinedValues(colorValues)) {
       return undefined;
   }

   return {
       r: colorValues[0],
       g: colorValues[1],
       b: colorValues[2],
   };
 }

 /**
  * Convert a color to a hex string representing the color
  * 
  * @param color Color to convert
  * @return Hex string representing the color
  */
 export function colorToCode(color: Color): ColorCode {
    const colorValues = [color.r, color.g, color.b];
    const colorParts = colorValues.map((value) => value.toString(16))
    .map((stringPiece) => stringPiece.length < 2 ? `0${stringPiece}` : stringPiece);
    return colorParts.join('');
 }

 /**
  * Computes a distance metric between two colors, where higher values are more different.
  * @param first first color
  * @param second second color
  */
 export function distance(first: Color, second: Color): number {
    return Math.abs(first.r - second.r) + Math.abs(first.g - second.g) + Math.abs(first.b - second.b);
 }