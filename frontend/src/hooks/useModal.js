import { useState } from "react";

export function useModal(formInicial) {
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState(formInicial);
  const [editandoId, setEditandoId] = useState(null);
  const [erro, setErro] = useState("");

  function abrirModalNovo() {
    setForm(formInicial);
    setEditandoId(null);
    setErro("");
    setModalAberto(true);
  }

  function abrirModalEditar(dados) {
    setForm(dados);
    setEditandoId(dados.id);
    setErro("");
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setForm(formInicial);
    setEditandoId(null);
    setErro("");
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSelect(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  return {
    modalAberto,
    form,
    setForm,
    editandoId,
    erro,
    setErro,
    abrirModalNovo,
    abrirModalEditar,
    fecharModal,
    handleChange,
    handleSelect,
  };
}
