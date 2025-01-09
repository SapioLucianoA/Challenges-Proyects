export async function fetchWords() {
  try {
    const response = await fetch('https://random-word.ryanrk.com/api/en/word/random/60');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const words = await response.json();
    return words;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}