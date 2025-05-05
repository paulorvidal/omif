import { Button } from "./components/ui/Button";

export const App = () => {
  return (
    <div className="h-screen flex items-center justify-center gap-8">
      <Button>Salvar</Button>
      <Button>Editar</Button>
      <Button>Excluir</Button>
    </div>
  );
};
