export type NoteColor = {
  bg: string;
  border: string;
  accent: string;
};

const NOTE_COLORS: NoteColor[] = [
  { bg: "#E9F0E2", border: "#D5E1CB", accent: "#AFC49D" },
  { bg: "#E8F1F8", border: "#D3E1ED", accent: "#AEC9DF" },
  { bg: "#FBEDF0", border: "#F0D9DE", accent: "#DFB7C0" },
  { bg: "#FBF4E2", border: "#EFE4C5", accent: "#DECB9E" },
  { bg: "#EFECF7", border: "#DED9EA", accent: "#C2B9DA" },
  { bg: "#FCEEE3", border: "#F2DCCA", accent: "#E3BD9E" },
];

export function getNoteColor(id: string): NoteColor {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % NOTE_COLORS.length;
  return NOTE_COLORS[index];
}