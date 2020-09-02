import _ from 'lodash';

const Next = {
    2: [5, 3, 4, 6, 7],
    3: [6, 4, 2, 5],
    4: [5, 1, 6, 2, 7, 3],
    5: [1, 6, 3, 4],
    6: [2, 5, 4, 3],
    7: [1, 6, 3, 5]
};

function nextCandidate(from) {
    if (from === 1) {
        const ranks = _.range(2, 7);
        const priorities = _.fill(_.range(2, 7), 1);
        const result = {
            ranks: ranks,
            prioritis: priorities
        };
        return result;
    } else {
        const ranks = Next[from];
        const priorities = _.range(1, ranks.lenght + 1);
        const result = {
            ranks: ranks,
            prioritis: priorities
        };
        return result;
    }
}

class ModProg {
}

function createSequences(start, end, minLen, maxLength) {
    return [{
        sequence: [1, 2, 3, 4, 5, 6, 7],
        priority: 8
    }, {
        sequence: [1, 2, 7],
        priority: 8
    }
    ];
}


export { createSequences, nextCandidate };