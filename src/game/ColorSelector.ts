import { RandomAPI } from "boardgame.io/dist/types/src/plugins/random/random";
import { Color } from "./Color";

export interface SelectedColor {
    name: string;
    color: Color;
}

export function selectColor(rand: RandomAPI): SelectedColor | undefined {
    // Later, we will load the database on the server and select a color. For now, we just return a default selection
    return {
        name: 'Pure green',
        color: {r: 0, g: 255, b: 0},
    }
}