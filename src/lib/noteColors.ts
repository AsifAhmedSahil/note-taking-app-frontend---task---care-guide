export type NoteColor = {
  bg: string;
  border: string;
};

const NOTE_COLORS: NoteColor[] = [
  { bg: "#FAF6DF", border: "#EDE7C4" },
  { bg: "#FAEEF0", border: "#EFD9DE" },
  { bg: "#FBEFE2", border: "#F1DDC9" },
  { bg: "#EBF0E4", border: "#D9E2CF" },
  { bg: "#EEECF6", border: "#DDD8EA" },
  { bg: "#E7F0F7", border: "#D4E2EE" },
];

export function getNoteColor(id: string): NoteColor {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % NOTE_COLORS.length;
  return NOTE_COLORS[index];
}