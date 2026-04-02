import { useEffect, useState } from "react";
import api from "../api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  nome: "",
  cpf: "",
  email: "",
  data_admissao: "",
  cargo_id: "",
  departamento_id: "",
};

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [cargos, setCargos] = useState([]);
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
    handleSelect,
  } = useModal(FORM_INICIAL);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const [f, c, d] = await Promise.all([
      api.get("/funcionarios"),
      api.get("/cargos"),
      api.get("/departamentos"),
    ]);
    setFuncionarios(f.data);
    setCargos(c.data);
    setDepartamentos(d.data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    try {
      if (editandoId) {
        await api.put(`/funcionarios/${editandoId}`, form);
      } else {
        await api.post("/funcionarios", form);
      }
      await carregarDados();
      fecharModal();
    } catch (err) {
      setErro(err.response?.data?.erro) || "Erro ao salvar";
    }
  }

  async function handleRemover(id) {
    if (!confirm("Remover este funcionário?")) return;
    try {
      await api.delete(`/funcionarios/${id}`);
      await carregarDados();
    } catch (err) {
      alert(err.response?.data?.erro || "Erro ao remover.");
    }
  }

  function nomeCargo(id) {
    return cargos.find((c) => c.id === id)?.titulo || "-";
  }

  function nomeDepartamento(id) {
    return departamentos.find((d) => d.id === id)?.nome || "-";
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Funcionários</h2>
        <Button onClick={abrirModalNovo}>+ Novo Funcionário</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Admissão</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {funcionarios.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-8"
                >
                  Nenhum funcionário cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              funcionarios.map((f) => (
                <TableRow key={f.id}>
                  <TableCell>{f.nome}</TableCell>
                  <TableCell>{f.cpf}</TableCell>
                  <TableCell>{nomeCargo(f.cargo_id)}</TableCell>
                  <TableCell>{nomeDepartamento(f.departamento_id)}</TableCell>
                  <TableCell>{f.data_admissao?.slice(0, 10)}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        abrirModalEditar({
                          id: f.id,
                          nome: f.nome,
                          cpf: f.cpf,
                          email: f.email || "",
                          data_admissao: f.data_admissao?.slice(0, 10),
                          cargo_id: String(f.cargo_id),
                          departamento_id: String(f.departamento_id),
                        })
                      }
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemover(f.id)}
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
              {editandoId ? "Editar funcionário" : "Novo funcionário"}
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
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="cpf">CPF (só números)</Label>
              <Input
                id="cpf"
                name="cpf"
                value={form.cpf}
                onChange={handleChange}
                maxLength={11}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="data_admissao">Data de admissão</Label>
              <Input
                id="data_admissao"
                name="data_admissao"
                type="date"
                value={form.data_admissao}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap1">
              <Label>Cargo</Label>
              <Select
                value={form.cargo_id}
                onValueChange={(v) => handleSelect("cargo_id", v)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {cargos.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <Label>Departamento</Label>
              <Select
                value={form.departamento_id}
                onValueChange={(v) => handleSelect("departamento_id", v)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {departamentos.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
