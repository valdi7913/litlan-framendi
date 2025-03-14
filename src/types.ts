export type Cell = {
    value: string;
    is_blank: boolean;
    x_coord: number;
    y_coord: number;
};

export type Hint = {
    id: number
    x_coord: number,
    y_coord: number,
    direction: "Horizontal" | "Vertical",
    text: string,
}

export type RowCol = {
    row: number,
    col: number
}