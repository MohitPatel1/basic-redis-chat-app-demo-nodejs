export const apiUrl = (path: string) => {
  const baseUrl = "http://localhost:4000";
  return `${baseUrl}${path}`;
};