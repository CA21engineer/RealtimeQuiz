const correctSound = require('assets/sound/correct.mp3');
const incorrectSound = require('assets/sound/incorrect.mp3');
const questionSound = require('assets/sound/question.mp3');

const sounds = {
  CORRECT: 'CORRECT',
  INCORRECT: 'INCORRECT',
  QUESTION: 'QUESTION',
} as const;

export const getSoundSource = (sound: keyof typeof sounds) => {
  switch (sound) {
    case 'QUESTION': {
      return questionSound;
    }

    case 'CORRECT': {
      return correctSound;
    }

    case 'INCORRECT': {
      return incorrectSound;
    }

    default:
      throw new Error('存在しない音です');
  }
};
