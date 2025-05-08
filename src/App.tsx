import { Button } from "./components/ui/Button";
import { H1 } from "./components/ui/H1";
import { Input } from "./components/ui/Input";
import { Label } from "./components/ui/Label";

export const App = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-8 text-zinc-950">
      <div className="max-w-full flex gap-8">
        <H1>Teste</H1>
      </div>
      <div className="max-w-full flex gap-8">
        <Button>Salvar</Button>
      </div>
      <div className=" flex flex-col items-center justify-center gap-8">
        <div className="flex flex-col gap-1">
          <Label>Teste:</Label>
          <Input type="text" placeholder="Digite algo..." />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Teste:</Label>
          <Input type="text" placeholder="Digite algo..." />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Teste:</Label>
          <Input type="text" placeholder="Digite algo..." />
        </div>
      </div>
    </div>
  );
};
