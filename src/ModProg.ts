import _ from 'lodash';

/**
 * Number from 1 to 8
 */
export type ChordMode = number;

export type Pitch = string;

export type Note = string;

export type FullChordName = string;

/**
 * List of next chord by priority
 * the number indicate the chord
 */
const Next: Record<ChordMode, ChordMode[]> = {
    2: [5, 3, 4, 6, 7],
    3: [6, 4, 2, 5],
    4: [5, 1, 6, 2, 7, 3],
    5: [1, 6, 3, 4],
    6: [2, 5, 4, 3],
    7: [1, 6, 3, 5]
};

const ChordNames = ['Maj7', 'm7', 'm7(b9)', 'Maj7(+11)', '7', 'm7(+5)', 'm7b5'];

export const Pitches = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'];

/**
 * Map between pitch and notes
 */
const Scales: Readonly<Record<Pitch, Note[]>> = {
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
 * Returns true if the chord sequence doeas not contain the chord
 * @param {*} sequence array of chord modes
 * @param {*} chord chord mode
 */
function notContains(sequence: ChordMode[], chord: ChordMode): boolean {
    const dupIdx = _.indexOf(sequence, chord);
    const result = dupIdx < 0;
    return result;
}

type Constraints = Readonly<{
    end: ChordMode;
    minLen: number;
}>;

/**
 * Returns true if chords sequence metch the end and the length constraints
 * @param chords 
 * @param param1 
 */
function isFinal(chords: ChordMode[], { end, minLen }: Constraints) {
    const last = _.last(chords);
    return chords.length >= minLen && end === last;
}

/**
 * Returns the full name of chord
 * @param pitch the pitch
 * @param mode  the chord mode
 */
function chordName(pitch: Pitch, mode: ChordMode): FullChordName {
    return Scales[pitch][mode - 1] + ChordNames[mode - 1];
}

interface ChordStep extends Readonly<{
    chord: ChordMode;
    priority: number;
}> { };

interface ChordChoices extends Readonly<{
    chords: ChordMode[];
    priorities: number[];
}> { };

export interface ChordSeq extends Readonly<{
    chords: ChordMode[];
    priority: number;
}> { };

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
export function nextCandidate(from: ChordMode): ChordStep[] {

    function nextCandidateUnzip(): ChordChoices {
        if (from === 1) {
            const chords = _.range(2, 8);
            const priorities = _.fill(_.range(2, 8), 1);
            const result: ChordChoices = {
                chords, priorities
            };
            return result;
        } else {
            const chords = Next[from];
            const priorities = _.range(1, chords.length + 1);
            const result: ChordChoices = {
                chords, priorities
            };
            return result;
        }
    };
    const { chords, priorities } = nextCandidateUnzip();
    const result: ChordStep[] = _(chords).zip(priorities).map(([chord, priority]) => {
        if (!chord || !priority) {
            throw new Error('wrong candidates');
        }
        return { chord, priority };
    }).value();
    return result;
}

/**
 * Returns the a list of chords added by next chord
 *
 * @param {*} param0 
 */
export function addChord({ chords, priority }: ChordSeq, { end, minLen }: Constraints): ChordSeq[] {
    const last = _.last(chords);
    if (!last) {
        throw new Error('no last found');
    }
    const nexts = nextCandidate(last);
    // filter for unique chord sequence
    const uniqueNexts = _.filter(nexts, s => {
        return notContains(chords, s.chord) ||
            (s.chord === end && chords.length + 1 >= minLen);
    });
    const result: ChordSeq[] = _.map(uniqueNexts, r => {
        return {
            chords: _.concat(chords, r.chord),
            priority: priority + r.priority
        }
    });
    return result;
}

export interface Chord extends Readonly<{
    mode: ChordMode;
    name: FullChordName;
}> { };

export interface ChordChain extends Readonly<{
    priority: number;
    avgPriority: number;
    chords: Chord[];
}> { };

export interface Progressions extends Readonly<{
    pitch: Pitch;
    chains: ChordChain[];
}> { };

export type ProgressionProps = Readonly<{
    start: ChordMode;
    end: ChordMode;
    minLen: number;
    maxLen: number;
    pitch: Pitch;
}>;

/**
 * Returns the chains
 * 
 * @param {*} param0 
 */
export function createProgressions({ start, end, minLen, maxLen, pitch }: ProgressionProps): Progressions {
    var seed: ChordSeq[] = [{ chords: [start], priority: 0 }];
    var chains: ChordSeq[] = [];
    for (var i = 1; i <= maxLen - 1; i++) {
        const nexts = _(seed).map(s => addChord(s, { end, minLen })).flatten().value();
        const ary = _.partition(nexts, s => isFinal(s.chords, { end, minLen }));
        chains = _.concat(chains, ary[0]);
        seed = ary[1];
    }
    const chainsWithNames = _(chains)
        .map(chain => {
            const avgPriority = chain.priority / (chain.chords.length - 1);
            const chords = _.map(chain.chords, mode => {
                return {
                    mode,
                    name: chordName(pitch, mode)
                };
            });
            const result = {
                avgPriority, chords,
                priority: chain.priority
            };
            return result;
        })
        .sortBy('avgPriority', 'priority', chain => chain.chords.length)
        .value();
    const result = {
        pitch: pitch,
        chains: chainsWithNames
    };
    return result;
}
