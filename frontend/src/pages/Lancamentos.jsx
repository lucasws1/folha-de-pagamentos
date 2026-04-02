import { useEffect, useState } from "react";
import { useModal } from "@/hooks/useModal";
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

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const FORM_INICIAL = {
  folha_id: "",
  funcionario_id: "",
  salario_bruto: "",
  horas_extras: "0",
  desconto: "0",
  beneficio: "0",
  tipo: "salario",
};

export default function Lancamentos() {
  const [lancamentos, setLancamentos] = useState([]);
  const [folhas, setFolhas] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [folhaFiltro, setFolhaFiltro] = useState("");

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
    carregarDependencias();
  }, []);

  useEffect(() => {
    carregarLancamentos();
  }, [folhaFiltro]);

  async function carregarDependencias() {
    const [f, func] = await Promise.all([
      api.get("/folhas"),
      api.get("/funcionarios"),
    ]);
    setFolhas(f.data);
    setFuncionarios(func.data);
  }

  async function carregarLancamentos() {
    const params = folhaFiltro ? { folha_id: folhaFiltro } : {};
    const { data } = await api.get("/lancamentos", { params });
    setLancamentos(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    try {
      if (editandoId) {
        await api.put(`/lancamentos/${editandoId}`, form);
      } else {
        await api.post("/lancamentos", form);
      }
      await carregarLancamentos();
      fecharModal();
    } catch (err) {
      setErro(err.response?.data?.erro || "Erro ao salvar.");
    }
  }

  async function handleRemover(id) {
    if (!confirm("Remover este lançamento?")) return;
    try {
      await api.delete(`/lancamentos/${id}`);
      await carregarLancamentos();
    } catch (err) {
      alert(err.response?.data?.erro || "Erro ao remover.");
    }
  }

  function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function nomeFolha(id) {
    const f = folhas.find((f) => f.id === Number(id));
    if (!f) return "-";
    return `${MESES[f.mes - 1]} / ${f.ano}`;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Lançamentos</h2>
        <Button onClick={abrirModalNovo}>+ Novo Lançamento</Button>
      </div>

      {/* Filtro por folha */}
      <div className="flex items-center gap-3 mb-4">
        <Label className="whitespace-nowrap">Filtrar por folha:</Label>
        <Select
          value={folhaFiltro}
          onValueChange={(v) => setFolhaFiltro(v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Todas as folhas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as folhas</SelectItem>
            {folhas.map((f) => (
              <SelectItem key={f.id} value={String(f.id)}>
                {MESES[f.mes - 1]} / {f.ano} - {f.status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {folhaFiltro && (
          <Button variant="ghost" size="sm" onClick={() => setFolhaFiltro("")}>
            Limpar
          </Button>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Funcionário</TableHead>
              <TableHead>Folha</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Salário bruto</TableHead>
              <TableHead>Descontos</TableHead>
              <TableHead>Líquido</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lancamentos.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-8"
                >
                  Nenhum lançamento encontrado.
                </TableCell>
              </TableRow>
            ) : (
              lancamentos.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>{l.funcionario_nome}</TableCell>
                  <TableCell>{nomeFolha(l.folha_id)}</TableCell>
                  <TableCell className="capitalize">{l.tipo}</TableCell>
                  <TableCell>{formatarMoeda(l.salario_bruto)}</TableCell>
                  <TableCell>{formatarMoeda(l.desconto)}</TableCell>
                  <TableCell className="font-medium">
                    {formatarMoeda(l.salario_liquido)}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        abrirModalEditar({
                          id: l.id,
                          folha_id: String(l.folha_id),
                          funcionario_id: String(l.funcionario_id),
                          salario_bruto: String(l.salario_bruto),
                          horas_extras: String(l.horas_extras),
                          desconto: String(l.desconto),
                          beneficio: String(l.beneficio),
                          tipo: l.tipo,
                        })
                      }
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemover(l.id)}
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editandoId ? "Editar lançamento" : "Novo lançamento"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1">
              <Label>Folha de pagamento</Label>
              <Select
                value={form.folha_id}
                onValueChange={(v) => handleSelect("folha_id", v)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a folha..." />
                </SelectTrigger>
                <SelectContent>
                  {folhas.map((f) => (
                    <SelectItem key={f.id} value={String(f.id)}>
                      {MESES[f.mes - 1]} / {f.ano} - {f.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <Label>Funcionários</Label>
              <Select
                value={form.funcionario_id}
                onValueChange={(v) => handleSelect("funcionario_id", v)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o funcionário..." />
                </SelectTrigger>
                <SelectContent>
                  {funcionarios.map((f) => (
                    <SelectItem key={f.id} value={String(f.id)}>
                      {f.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <Label>Tipo</Label>
              <Select
                value={form.tipo}
                onValueChange={(v) => handleSelect("tipo", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salario">Salário</SelectItem>
                  <SelectItem value="bonus">Bônus</SelectItem>
                  <SelectItem value="ferias">Férias</SelectItem>
                  <SelectItem value="rescisao">Rescisão</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Valores em grid em 2 colunas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <Label htmlFor="salario_bruto">Salário bruto (R$)</Label>
                <Input
                  id="salario_bruto"
                  name="salario_bruto"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.salario_bruto}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="horas_extras">Horas extras (R$)</Label>
                <Input
                  id="horas_extras"
                  name="horas_extras"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.horas_extras}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="desconto">Desconto (R$)</Label>
                <Input
                  id="desconto"
                  name="desconto"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.desconto}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="beneficio">Benefício (R$)</Label>
                <Input
                  id="beneficio"
                  name="beneficio"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.beneficio}
                  onChange={handleChange}
                />
              </div>
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
