import { atom } from 'jotai';
import { responseType } from './types';

export const responsesAtom = atom<responseType[]>([]);
export const isLoadingAtom = atom(false);
