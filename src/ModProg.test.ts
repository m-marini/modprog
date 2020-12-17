import _ from 'lodash';
import { nextCandidate, addChord, ChordSeq, ProgressionProps, createProgressions } from './ModProg';

describe('nextCandidate', () => {
    test('should return next 6,4,2,5 for 3', () => {
        const result = nextCandidate(3);
        expect(result).toEqual([{
            chord: 6,
            priority: 1
        }, {
            chord: 4,
            priority: 2
        }, {
            chord: 2,
            priority: 3
        }, {
            chord: 5,
            priority: 4
        }]);
    });

    test('should return next 2,3,4,5,6,7 for 1', () => {
        const result = nextCandidate(1);
        expect(result).toEqual([{
            chord: 2,
            priority: 1
        }, {
            chord: 3,
            priority: 1
        }, {
            chord: 4,
            priority: 1
        }, {
            chord: 5,
            priority: 1
        }, {
            chord: 6,
            priority: 1
        }, {
            chord: 7,
            priority: 1
        }]);
    });
});

describe('addChord', () => {
    test('should return next 6,4,2,5 from 3', () => {
        const seq: ChordSeq = {
            chords: [3],
            priority: 1
        };
        const props = {
            end: 6,
            minLen: 1
        }
        const result = addChord(seq, props);

        expect(result).toEqual([{
            chords: [3, 6],
            priority: 2
        }, {
            chords: [3, 4],
            priority: 3
        }, {
            chords: [3, 2],
            priority: 4
        }, {
            chords: [3, 5],
            priority: 5
        }]);
    });
});

describe('createProgressions', () => {
    test('should create progressions', () => {
        const props: ProgressionProps = {
            start: 3,
            end: 6,
            minLen: 2,
            maxLen: 2,
            pitch: 'C'
        }

        const result = createProgressions(props);

        expect(result).toEqual({
            pitch: 'C',
            chains: [{
                priority: 1,
                avgPriority: (2 - 1) / 1,
                chords: [{
                    mode: 3,
                    name: 'Em7(b9)'
                }, {
                    mode: 6,
                    name: 'Am7(+5)'
                }]
            }]
        })

    });
});


// export function createProgressions({ start, end, minLen, maxLen, pitch }: ProgressionProps): Progressions {
