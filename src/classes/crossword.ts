class Crossword {
    board: string[];
    answer: string[];

    constructor(answer: string[]) {
        this.answer = answer;        
        this.board = Array.from({length: answer.length}, ()=> '');
    }

}