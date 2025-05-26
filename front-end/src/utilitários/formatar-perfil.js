export default function formatarPerfil(perfil) { 
  switch (perfil) {
    case "organizador": 
      return "Organizador";
    case "participante": 
      return "Participante";
    default:
      return ""; 
  }
}