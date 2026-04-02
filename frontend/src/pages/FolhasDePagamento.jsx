import { useEffect, useState } from "react";
import { useModal } from "@/hooks/useModal";
import api from "../api/axios";
import { Button } from "@/components/ui/button";
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

const anoAtual = new Date().getFullYear();
const ANOS = Array.from({ length: 5 }, (_, i) => String(anoAtual - 2 + i));

const FORM_INICIAL = {
  mes: "",
  ano: String(anoAtual),
  status: "aberta",
};

export default function FolhasDePagamento() {
  const [folhas, setFolhas] = useState([]);
  const {
    modalAberto,
    form,
    editandoId,
    erro,
    setErro,
    abrirModalNovo,
    abrirModalEditar,
    fecharModal,
    handleSelect,
  } = useModal(FORM_INICIAL);

  useEffect(() => {
    carregarFolhas();
  }, []);

  async function carregarFolhas() {
    const { data } = await api.get("/folhas");
    setFolhas(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    try {
      if (editandoId) {
        await api.put(`/folhas/${editandoId}`, form);
      } else {
        await api.post(`/folhas`, form);
      }
      await carregarFolhas();
      fecharModal();
    } catch (err) {
      console.log(err);

      setErro(err.response?.data?.erro || "Erro ao salvar.");
    }
  }

  async function handleRemover(id) {
    if (!confirm("Remover esta folha de pagamento?")) return;
    try {
      await api.delete(`/folhas/${id}`);
      await carregarFolhas();
    } catch (err) {
      alert(err.response?.data?.erro || "Erro ao remover");
    }
  }

  const statusVariant = {
    aberta: "text-blue-600",
    fechada: "text-yellow-600",
    paga: "text-green-600",
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Folhas de Pagamento</h2>
        <Button onClick={abrirModalNovo}>+ Nova Folha</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Período</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {folhas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground py-8"
                >
                  Nenhuma folha cadastrada
                </TableCell>
              </TableRow>
            ) : (
              folhas.map((f) => (
                <TableRow key={f.id}>
                  <TableCell>
                    {MESES[f.mes - 1]} / {f.ano}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-medium capitalize ${statusVariant[f.status]}`}
                    >
                      {f.status}
                    </span>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        abrirModalEditar({
                          id: f.id,
                          mes: String(f.mes),
                          ano: String(f.ano),
                          status: f.status,
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
              {editandoId ? "Editar folha" : "Nova folha"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1">
              <Label>Mês</Label>
              <Select
                value={form.mes}
                onValueChange={(v) => handleSelect("mes", v)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {MESES.map((nome, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>
                      {nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <Label>Ano</Label>
              <Select
                value={form.ano}
                onValueChange={(v) => handleSelect("ano", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ANOS.map((ano) => (
                    <SelectItem key={ano} value={ano}>
                      {ano}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => handleSelect("status", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aberta">Aberta</SelectItem>
                  <SelectItem value="fechada">Fechada</SelectItem>
                  <SelectItem value="paga">Paga</SelectItem>
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
