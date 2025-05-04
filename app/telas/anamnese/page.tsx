"use client";

import React, { useState } from "react";
import Modal from "@/app/components/Modal/Modal";

interface FormularioAnamnesePageProps {
  agendamentoId: number;
  onClose: () => void;
}

const FormularioAnamnesePage: React.FC<FormularioAnamnesePageProps> = ({
  agendamentoId,
  onClose,
}) => {
  // Estados do formulário
  const [dataRegistro, setDataRegistro] = useState<string>("");
  const [idade, setIdade] = useState<string>("");
  const [genero, setGenero] = useState<string>("");
  const [queixaPrincipal, setQueixaPrincipal] = useState<string>("");
  const [tempoProblema, setTempoProblema] = useState<string>("");
  const [tratamentoAnterior, setTratamentoAnterior] = useState<string>("");
  const [historia, setHistoria] = useState<string>("");
  const [doencas, setDoencas] = useState<string[]>([]);
  const [outraDoenca, setOutraDoenca] = useState<string>("");
  const [cirurgiaRecente, setCirurgiaRecente] = useState<string>("");
  const [alergia, setAlergia] = useState<string>("");
  const [medicamentos, setMedicamentos] = useState<string>("");
  const [produtos, setProdutos] = useState<string>("");
  const [materiais, setMateriais] = useState<string>("");
  const [historicoFamiliar, setHistoricoFamiliar] = useState<string>("");
  const [historicoFamiliarEspecificar, setHistoricoFamiliarEspecificar] =
    useState<string>("");
  const [habitos, setHabitos] = useState({
    atividadeFisica: "",
    consomeAlcool: "",
    fuma: "",
    nivelEstresse: "",
  });
  const [saudePes, setSaudePes] = useState({
    dorPes: "",
    calos: "",
    unhasEncravadas: "",
    formigamento: "",
    alteracaoCor: "",
  });
  const [avaliacao, setAvaliacao] = useState({
    pele: "",
    unhas: "",
    calosidades: "",
    tipoPisada: "",
    edemas: "",
    hidratacao: "",
  });
  const [anexos, setAnexos] = useState<File[]>([]);

  // Função de envio
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const anamneseData = {
      agendamentoId,
      dataRegistro,
      idade: parseInt(idade, 10),
      genero,
      queixaPrincipal,
      tempoProblema,
      tratamentoAnterior,
      historia,
      doencas: doencas.join(", "),
      outraDoenca,
      cirurgiaRecente,
      alergia,
      medicamentos,
      produtos,
      materiais,
      historicoFamiliar,
      historicoFamiliarEspecificar,
      habitos: JSON.stringify(habitos),
      saudePes: JSON.stringify(saudePes),
      avaliacao: JSON.stringify(avaliacao),
    };

    try {
      const response = await fetch("http://localhost:8080/api/anamnese/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(anamneseData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      alert("Anamnese salva com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao salvar anamnese:", error);
      alert("Erro ao salvar a anamnese.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAnexos((prev) => [...prev, ...filesArray]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAnexos((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Formulário de Anamnese</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* === Dados Iniciais === */}
          <div>
            <label className="block mb-2">Data de Registro:</label>
            <input
              type="date"
              value={dataRegistro}
              onChange={(e) => setDataRegistro(e.target.value)}
              className="border rounded p-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Idade:</label>
            <input
              type="number"
              value={idade}
              onChange={(e) => setIdade(e.target.value)}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Gênero:</label>
            <select
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              className="border rounded p-2 w-full"
              required
            >
              <option value="">Selecione</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          {/* === Informações do Cliente === */}
          <h2 className="text-2xl font-semibold mt-6">
            Informações do Cliente
          </h2>
          <div>
            <label className="block mb-2">Queixa Principal:</label>
            <input
              type="text"
              value={queixaPrincipal}
              onChange={(e) => setQueixaPrincipal(e.target.value)}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-2">
              Há quanto tempo está com esse problema?
            </label>
            <input
              type="text"
              value={tempoProblema}
              onChange={(e) => setTempoProblema(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label className="block mb-2">
              Já fez algum tratamento antes? Qual?
            </label>
            <input
              type="text"
              value={tratamentoAnterior}
              onChange={(e) => setTratamentoAnterior(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label className="block mb-2">História:</label>
            <textarea
              value={historia}
              onChange={(e) => setHistoria(e.target.value)}
              className="border rounded p-2 w-full h-32"
              required
            />
          </div>
          <div>
            <label className="block mb-2">
              Possui alguma doença diagnosticada?
            </label>
            <select
              multiple
              value={doencas}
              onChange={(e) => {
                const opts = Array.from(e.target.options);
                setDoencas(opts.filter((o) => o.selected).map((o) => o.value));
              }}
              className="border rounded p-2 w-full"
            >
              <option value="diabetes">Diabetes</option>
              <option value="hipertensao">Hipertensão</option>
              <option value="doenca_vascular">Doença Vascular</option>
              <option value="outra">Outra</option>
            </select>
            {doencas.includes("outra") && (
              <input
                type="text"
                placeholder="Especifique"
                value={outraDoenca}
                onChange={(e) => setOutraDoenca(e.target.value)}
                className="border rounded p-2 w-full mt-2"
              />
            )}
          </div>
          <div>
            <label className="block mb-2">Já passou por cirurgias?</label>
            <select
              value={cirurgiaRecente}
              onChange={(e) => setCirurgiaRecente(e.target.value)}
              className="border rounded p-2 w-full"
            >
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </div>

          {/* === Alergias === */}
          <div>
            <label className="block mb-2">Possui alergias?</label>
            <select
              value={alergia}
              onChange={(e) => setAlergia(e.target.value)}
              className="border rounded p-2 w-full"
            >
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
            {alergia === "sim" && (
              <div className="space-y-2 mt-2">
                <input
                  type="text"
                  placeholder="Medicamentos"
                  value={medicamentos}
                  onChange={(e) => setMedicamentos(e.target.value)}
                  className="border rounded p-2 w-full"
                />
                <input
                  type="text"
                  placeholder="Produtos"
                  value={produtos}
                  onChange={(e) => setProdutos(e.target.value)}
                  className="border rounded p-2 w-full"
                />
                <input
                  type="text"
                  placeholder="Materiais"
                  value={materiais}
                  onChange={(e) => setMateriais(e.target.value)}
                  className="border rounded p-2 w-full"
                />
              </div>
            )}
          </div>

          {/* === Histórico Familiar === */}
          <div>
            <label className="block mb-2">Histórico familiar de doenças?</label>
            <select
              value={historicoFamiliar}
              onChange={(e) => setHistoricoFamiliar(e.target.value)}
              className="border rounded p-2 w-full"
            >
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
            {historicoFamiliar === "sim" && (
              <input
                type="text"
                placeholder="Especifique"
                value={historicoFamiliarEspecificar}
                onChange={(e) =>
                  setHistoricoFamiliarEspecificar(e.target.value)
                }
                className="border rounded p-2 w-full mt-2"
              />
            )}
          </div>

          {/* === Hábitos === */}
          <h2 className="text-2xl font-semibold mt-6">Hábitos do Cliente</h2>
          <div>
            <label className="block mb-2">Pratica atividades físicas?</label>
            <select
              value={habitos.atividadeFisica}
              onChange={(e) =>
                setHabitos({ ...habitos, atividadeFisica: e.target.value })
              }
              className="border rounded p-2 w-full"
            >
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </div>
          <div>
            <label className="block mb-2">Consome álcool?</label>
            <select
              value={habitos.consomeAlcool}
              onChange={(e) =>
                setHabitos({ ...habitos, consomeAlcool: e.target.value })
              }
              className="border rounded p-2 w-full"
            >
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </div>
          <div>
            <label className="block mb-2">Fuma?</label>
            <select
              value={habitos.fuma}
              onChange={(e) => setHabitos({ ...habitos, fuma: e.target.value })}
              className="border rounded p-2 w-full"
            >
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
            <div>
              <label className="block mb-2">Nível de estresse:</label>
              <select
                value={habitos.nivelEstresse}
                onChange={(e) =>
                  setHabitos({ ...habitos, nivelEstresse: e.target.value })
                }
                className="border rounded p-2 w-full"
              >
                <option value="">Selecione</option>
                <option value="baixo">Baixo</option>
                <option value="medio">Médio</option>
                <option value="alto">Alto</option>
              </select>
            </div>
          </div>

          {/* === Saúde dos Pés === */}
          <h2 className="text-2xl font-semibold mt-6">Saúde dos Pés</h2>
          <div>
            <label className="block mb-2">
              Sente dor nos pés? Em qual região?
            </label>
            <input
              type="text"
              value={saudePes.dorPes}
              onChange={(e) =>
                setSaudePes({ ...saudePes, dorPes: e.target.value })
              }
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label className="block mb-2">
              Já teve calos, rachaduras, micoses ou verrugas plantares?
            </label>
            <select
              value={saudePes.calos}
              onChange={(e) =>
                setSaudePes({ ...saudePes, calos: e.target.value })
              }
              className="border rounded p-2 w-full"
            >
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </div>
          <div>
            <label className="block mb-2">
              Possui unhas encravadas ou deformadas?
            </label>
            <select
              value={saudePes.unhasEncravadas}
              onChange={(e) =>
                setSaudePes({ ...saudePes, unhasEncravadas: e.target.value })
              }
              className="border rounded p-2 w-full"
            >
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </div>
          <div>
            <label className="block mb-2">
              Sente formigamento, dormência ou queimação nos pés?
            </label>
            <select
              value={saudePes.formigamento}
              onChange={(e) =>
                setSaudePes({ ...saudePes, formigamento: e.target.value })
              }
              className="border rounded p-2 w-full"
            >
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </div>
          <div>
            <label className="block mb-2">
              Alteração de cor ou temperatura dos pés?
            </label>
            <select
              value={saudePes.alteracaoCor}
              onChange={(e) =>
                setSaudePes({ ...saudePes, alteracaoCor: e.target.value })
              }
              className="border rounded p-2 w-full"
            >
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </div>

          {/* === Avaliação Visual === */}
          <h2 className="text-2xl font-semibold mt-6">Avaliação Visual</h2>
          <div>
            <label className="block mb-2">Pele:</label>
            <input
              type="text"
              value={avaliacao.pele}
              onChange={(e) =>
                setAvaliacao({ ...avaliacao, pele: e.target.value })
              }
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label className="block mb-2">Unhas:</label>
            <input
              type="text"
              value={avaliacao.unhas}
              onChange={(e) =>
                setAvaliacao({ ...avaliacao, unhas: e.target.value })
              }
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label className="block mb-2">
              Calosidades, fissuras ou micoses?
            </label>
            <input
              type="text"
              value={avaliacao.calosidades}
              onChange={(e) =>
                setAvaliacao({ ...avaliacao, calosidades: e.target.value })
              }
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label className="block mb-2">Tipo de pisada:</label>
            <input
              type="text"
              value={avaliacao.tipoPisada}
              onChange={(e) =>
                setAvaliacao({ ...avaliacao, tipoPisada: e.target.value })
              }
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label className="block mb-2">Edemas:</label>
            <input
              type="text"
              value={avaliacao.edemas}
              onChange={(e) =>
                setAvaliacao({ ...avaliacao, edemas: e.target.value })
              }
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label className="block mb-2">
              Hidratação e sensibilidade da pele:
            </label>
            <input
              type="text"
              value={avaliacao.hidratacao}
              onChange={(e) =>
                setAvaliacao({ ...avaliacao, hidratacao: e.target.value })
              }
              className="border rounded p-2 w-full"
            />
          </div>

          {/* === Anexos === */}
          <div>
            <label className="block mb-2">Anexar arquivos (fotos, PDFs):</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="border rounded p-2 w-full"
            />
            <div className="mt-2 space-y-1">
              {anexos.map((file, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="truncate max-w-xs">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    className="text-red-500 hover:underline ml-2"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Botão de Fechar Modal sem Salvar */}
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose} // Use onClose aqui
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Fechar
            </button>
          </div>

          {/* Botão de Envio */}

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Salvar Anamnese
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default FormularioAnamnesePage;
