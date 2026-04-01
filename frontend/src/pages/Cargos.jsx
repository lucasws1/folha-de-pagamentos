import { useEffect, useState } from "react";
import api from "../api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useModal } from "@/hooks/useModal";

const FORM_INICIAL = {
  titulo: "",
  salario_base: "",
};

export default function Cargos() {
  const [cargos, setCargos] = useState([]);
  const {
    modalAberto,
    form,
    editandoId,
    erro,
    setErro,
    abrirModalNovo,
    abrirModalEditar,
    fecharModal,
    handleChange,
  } = useModal(FORM_INICIAL);

  useEffect(() => {
    carregarCargos();
  }, []);

  async function carregarCargos() {
    const { data } = await api.get("/cargos");
    setCargos(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    try {
      if (editandoId) {
        await api.put(`/cargos/${editandoId}`, form);
      } else {
        await api.post("/cargos", form);
      }
      await carregarCargos();
      fecharModal();
    } catch (err) {
      setErro(err.response?.data?.erro || "Erro ao salvar.");
    }
  }

  async function handleRemover(id) {
    if (!confirm("Remover este cargo?")) return;
    try {
      await api.delete(`/cargos/${id}`);
      await carregarCargos();
    } catch (err) {
      alert(err.response?.data?.erro || "Erro ao remover");
    }
  }

  function formatarSalario(valor) {
    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Cargos</h2>
        <Button onClick={abrirModalNovo}>+ Novo Cargo</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Salário base</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cargos.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground py-8"
                >
                  Nenhum cargo cadastrado
                </TableCell>
              </TableRow>
            ) : (
              cargos.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.titulo}</TableCell>
                  <TableCell>{formatarSalario(c.salario_base)}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        abrirModalEditar({
                          id: c.id,
                          titulo: c.titulo,
                          salario_base: String(c.salario_base),
                        })
                      }
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemover(c.id)}
                    >
                      Remover
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalAberto} onOpenChange={fecharModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editandoId ? "Editar cargo" : "Novo cargo"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                placeholder="Ex.: Analista, Supervisor..."
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="salario_base">Salário base (R$)</Label>
              <Input
                id="salario_base"
                name="salario_base"
                type="number"
                min="0"
                step="0.01"
                value={form.salario_base}
                onChange={handleChange}
                placeholder="Ex.: 4500.00"
                required
              />
            </div>

            {erro && <p className="text-sm text-destructive">{erro}</p>}

            <div className="flex justify-end gap-2 mt-2">
              <Button type="button" variant="outline" onClick={fecharModal}>
                Cancelar
              </Button>
              <Button type="submit">{editandoId ? "Salvar" : "Criar"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
