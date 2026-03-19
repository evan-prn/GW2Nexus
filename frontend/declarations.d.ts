// Déclaration globale des CSS Modules
// Permet à TypeScript de reconnaître les imports *.module.css
declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}