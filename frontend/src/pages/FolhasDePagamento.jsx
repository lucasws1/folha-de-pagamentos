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
        await api.put(`/folhas/${id}`, form);
      } else {
        await api.post(`/folhas`, form);
      }
      await carregarFolhas();
      fecharModal();
    } catch (err) {
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
    </div>
  );
}
