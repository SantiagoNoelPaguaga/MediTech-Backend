import generator from "generate-password";

export const generarPassword = () => {
  return generator.generate({
    length: 12,
    numbers: true,
    symbols: true,
    uppercase: true,
    lowercase: true,
    strict: true,
  });
};
