export interface Word {
  text: string;
  pangram: boolean;
}

export interface WordListContentProps {
  mappedWords: Word[];
}

export interface WordListHeaderProps {
  isOpen: boolean;
  foundWords: string[];
  mappedWords: Word[];
}