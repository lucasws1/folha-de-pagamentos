import { useEffect, useState } from "react";
import { useModal } from "@/hooks/useModal";
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

const FORM_INICIAL = {
  nome: "",
  centro_custo: "",
};

export default function Departamentos() {
  const [departamentos, setDepartamentos] = useState([]);
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
    carregarDepartamentos();
  }, []);

  async function carregarDepartamentos() {
    const { data } = await api.get("/departamentos");
    setDepartamentos(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    try {
      if (editandoId) {
        await api.put(`/departamentos/${editandoId}`, form);
      } else {
        await api.post("/departamentos", form);
      }
      await carregarDepartamentos();
      fecharModal();
    } catch (err) {
      setErro(err.response?.data?.erro || "Erro ao salvar");
    }
  }

  async function handleRemover(id) {
    if (!confirm("Remover este departamento?")) return;
    try {
      await api.delete(`/departamentos/${id}`);
      await carregarDepartamentos();
    } catch (err) {
      alert(err.response?.data?.erro || "Erro ao remover.");
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Departamentos</h2>
        <Button onClick={abrirModalNovo}>+ Novo Departamento</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Centro de Custo</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departamentos.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground py-8"
                >
                  Nenhum departamento cadastrado
                </TableCell>
              </TableRow>
            ) : (
              departamentos.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.nome}</TableCell>
                  <TableCell>{d.centro_custo}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        abrirModalEditar({
                          id: d.id,
                          nome: d.nome,
                          centro_custo: d.centro_custo,
                        })
                      }
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemover(d.id)}
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
              {editandoId ? "Editar Departamento" : "Novo Departamento"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Ex.: TI, Jurídico..."
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="centro_custo">Centro de Custo</Label>
              <Input
                id="centro_custo"
                name="centro_custo"
                value={form.centro_custo}
                onChange={handleChange}
                placeholder="Ex.: CC-001"
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
