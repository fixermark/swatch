import { RandomAPI } from "boardgame.io/dist/types/src/plugins/random/random";
import { codeToColor, Color, colorToCode } from "./Color";

export interface SelectedColor {
    name: string;
    color: Color;
}

interface ColorRow {
    name: string;
    color: string;
}

// have to set up the colors; call this during module load
const ALL_COLORS: ColorRow[] | undefined = initColors();

/**
 * Locate the color file, which may be in one of two places depending
 * on whether we're running locally or on server
 * @param fs Dynamically-loaded fs module
 * @param path Dyanically-loaded path module
 * @return Path to colors.json. Throws error if file cannot be found
 */
function findColorFile(fs: any, path:any): string {
    const possibleLocations = [
        path.resolve(__dirname, '../../private/colors.json'),
        path.resolve(__dirname, '../private/colors.json'),
    ];

    for (const location of possibleLocations) {
        if (fs.existsSync(location)) {
            return location;
        }
    }

    throw new Error(`color file not found in ${possibleLocations}`);
}

/**
 * If we are the server, load colors from the file in private. Else, return undefined
 */
function initColors(): ColorRow[] | undefined {
    const fs = require('fs');
    const path = require('path');
    if (!fs.readFileSync) {
        // we are not a NodeJS server
        return undefined;
    }
    const filePath = findColorFile(fs, path);
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
}

export function selectColor(rand: RandomAPI): SelectedColor | undefined {
    if (!ALL_COLORS) {
        return undefined;
    }

    const colorIdx = Math.floor(rand.Number() * ALL_COLORS.length);
    const selectedColor = ALL_COLORS[colorIdx];
    const color = codeToColor(selectedColor.color.slice(1));
    if (!color) {
        throw new Error(`could not decode ${selectedColor.color.slice(1)}`);
    }

    return {
        name: selectedColor.name,
        color: color,
    };
}