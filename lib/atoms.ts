import { atomWithStorage } from 'jotai/utils';

export const responsesAtom = atomWithStorage<unknown[]>('responses', []);

