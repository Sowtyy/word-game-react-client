export class WordGame {
  private static _get_random_number(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

  static get_available_words(firstCharacter: string, usedWords: string[], words: string[], lastOpponentFirstCharacter: string) {
    if (!firstCharacter) return [];
    return words.filter(word => word.startsWith(firstCharacter) && !usedWords.includes(word) && word.at(-1) != lastOpponentFirstCharacter);
  }

  static get_random_available_word(firstCharacter: string, usedWords: string[], words: string[], lastOpponentFirstCharacter: string) {
    const available = this.get_available_words(firstCharacter, usedWords, words, lastOpponentFirstCharacter);
    if (!available.length) return "";
    return available[this._get_random_number(0, available.length - 1)];
  }

  static get_next_first_character(word: string, additionalIgnore: string[] = []) {
    const ignore = ["ь", "ъ", "ы"].concat(additionalIgnore);
    let character = "";
    let index = word.length;

    while (!character && index > 0) {
      index--;
      character = word[index];

      if (!ignore.includes(character)) break;
      character = "";
    }

    return character;
  }
}
