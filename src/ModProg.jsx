import _ from 'lodash';

const Next = {
    2: [5, 3, 4, 6, 7],
    3: [6, 4, 2, 5],
    4: [5, 1, 6, 2, 7, 3],
    5: [1, 6, 3, 4],
    6: [2, 5, 4, 3],
    7: [1, 6, 3, 5]
};

const ChordNames = ['Maj7', 'm7', 'm7(b9)', 'Maj7(+11)', '7', 'm7(+5)', 'm7b5'];

const Pitches = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'];

const Scales = {
    'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
    'D': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
    'A': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
    'E': ['E', 'F#', 'G', 'A', 'B', 'C#', 'D#'],
    'B': ['B', 'C#', 'D#', 'E', 'F#', 'G', 'A#'],
    'F#': ['F#', 'G', 'A#', 'B', 'C#', 'D#', 'E#'],
    'C#': ['C#', 'D#', 'E#', 'F#', 'G', 'A#', 'B#'],
    'F': ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
    'Bb': ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
    'Eb': ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],
    'Ab': ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'],
    'Db': ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'],
    'Gb': ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F'],
    'Cb': ['Cb', 'Db', 'Eb', 'Fb', 'Gb', 'Ab', 'Bb',],
};

/**
 *  Return the list of next candidate chords
 * ```
 *  [{
 *   chord: integer,
 *   priority: integer
 *   },
 *   ...
 *  ]
 * }
 * ```
 * @param {*} from 
 */
function nextCandidate(from) {
    function nextCandidateUnzip() {
        if (from === 1) {
            const chords = _.range(2, 8);
            const priorities = _.fill(_.range(2, 8), 1);
            const result = {
                chords: chords,
                priorities: priorities
            };
            return result;
        } else {
            const chords = Next[from];
            const priorities = _.range(1, chords.length + 1);
            const result = {
                chords: chords,
                priorities: priorities
            };
            return result;
        }
    };
    const { chords, priorities } = nextCandidateUnzip();
    const result = _(chords).zip(priorities).map(ary => {
        return {
            chord: ary[0],
            priority: ary[1]
        };
    }).value();
    return result;
}

/**
 * Returns true if the chord sequence doeas not contain the chord
 * @param {*} sequence array of chord modes
 * @param {*} chord chord mode
 */
function notContains(sequence, chord) {
    const dupIdx = _.indexOf(sequence, chord);
    const result = dupIdx < 0;
    return result;
}

/**
 * Returns the a list of chords added by next chord
 * ```json
 * {
 *   chords: array of chord modes
 *   priority: priority of chord chain
 * }
 * ```
 *
 * @param {*} param0 
 * ```json
 * {
 *   chords: array of chord modes
 *   priority: priority of chord chain
 * }
 * ```
 */
function addChord({ chords, priority }, { end, minLen }) {
    const last = _.last(chords);
    const nexts = nextCandidate(last);
    // filter for unique chord sequence
    const uniqueNexts = _.filter(nexts, s => {
        return notContains(chords, s.chord) ||
            (s.chord === end && chords.length + 1 >= minLen);
    });
    const result = _.map(uniqueNexts, r => {
        return {
            chords: _.concat(chords, r.chord),
            priority: priority + r.priority
        }
    });
    return result;
}

function isFinal(chords, { end, minLen }) {
    const last = _.last(chords);
    return chords.length >= minLen && end === last;
}

function chordName(pitch, mode) {
    return Scales[pitch][mode - 1] + ChordNames[mode - 1];
}

/**
 * Returns the chains
 * ```json
 * {
 *   pitch: string
 *   chains: [
 *     {
 *       priority: int
 *       avgPriority: int
 *       chords: [
 *          {
 *            mode: int
 *            name: string
 *          },
 *       ]
 *     },
 *     ...
 *   ]
 * }
 * ```
 * 
 * @param {*} param0 
 */
function createProgressions({ start, end, minLen, maxLen, pitch }) {
    var seed = [{ chords: [start], priority: 0 }];
    var chains = [];
    for (var i = 1; i <= maxLen - 1; i++) {
        const nexts = _(seed).map(s => addChord(s, { end, minLen })).flatten().value();
        const ary = _.partition(nexts, s => isFinal(s.chords, { end, minLen }));
        chains = _.concat(chains, ary[0]);
        seed = ary[1];
    }
    const chainsWithNames = _(chains).map(chain => {
        chain.avgPriority = chain.priority / (chain.chords.length - 1);
        return chain;
    }).sortBy('avgPriority', 'priority', chain => chain.chords.length)
        .map(chain => {
            const chordsWithNames = _.map(chain.chords, mode => {
                return {
                    mode,
                    name: chordName(pitch, mode)
                };
            });
            chain.chords = chordsWithNames;
            return chain;
        }).value();
    const result = {
        pitch: pitch,
        chains: chainsWithNames
    };
    return result;
}

export { createProgressions, Pitches };