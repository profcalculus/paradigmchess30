// Convert FEN strings to/from 'Dragon Bishop' notation
export function FENtoP30(FEN) {
    return FEN.replace('b','d').replace('B','D');
}

export function P30toFEN(P30) {
    return P30.replace('d','b').replace('D','B');
}

