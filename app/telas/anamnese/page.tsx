"use client";

import React, { useState, useEffect } from "react";

export interface AnamnesePayload { 
  id?: number; 
  agendamentoId: number;
  clienteId: number;
  dataRegistro: string; 
  idade: number | string; 
  genero: string;
  queixaPrincipal: string;
  tempoProblema: string;
  tratamentoAnterior: string;
  historia: string;
  doencas: string; 
  outraDoenca?: string;
  cirurgiaRecente: string;
  alergia: string; 
  medicamentos?: string;
  produtos?: string;
  materiais?: string;
  historicoFamiliar: string;
  historicoFamiliarEspecificar?: string;
  habitos: string;
  saudePes: string; 
  avaliacao: string; 
  foto?: string | null; 
}

interface FormularioAnamnesePageProps {
  agendamentoId: number;
  clienteId: number;
  onClose: () => void;
  anamneseExistente?: Partial<AnamnesePayload>;
}


const FormularioAnamnesePage: React.FC<FormularioAnamnesePageProps> = ({
  agendamentoId,
  clienteId,
  onClose,
  anamneseExistente,
}) => {
  console.log('Form Anamnese - Cliente ID:', clienteId, "Agendamento ID:", agendamentoId);
  console.log('Anamnese Existente recebida no form:', anamneseExistente);


  const [idAnamnese, setIdAnamnese] = useState<number | undefined>(undefined);
  const [dataRegistro, setDataRegistro] = useState<string>(new Date().toISOString().split('T')[0]);
  const [idade, setIdade] = useState<string>("");
  const [genero, setGenero] = useState<string>("");
  const [queixaPrincipal, setQueixaPrincipal] = useState<string>("");
  const [tempoProblema, setTempoProblema] = useState<string>("");
  const [tratamentoAnterior, setTratamentoAnterior] = useState<string>("");
  const [historia, setHistoria] = useState<string>("");
  const [doencasSelecionadas, setDoencasSelecionadas] = useState<string[]>([]);
  const [outraDoenca, setOutraDoenca] = useState<string>("");
  const [cirurgiaRecente, setCirurgiaRecente] = useState<string>("");
  const [alergia, setAlergia] = useState<string>("");
  const [medicamentos, setMedicamentos] = useState<string>("");
  const [produtos, setProdutos] = useState<string>("");
  const [materiais, setMateriais] = useState<string>("");
  const [historicoFamiliar, setHistoricoFamiliar] = useState<string>("");
  const [historicoFamiliarEspecificar, setHistoricoFamiliarEspecificar] = useState<string>("");

  const [habitos, setHabitos] = useState({ atividadeFisica: "", consomeAlcool: "", fuma: "", nivelEstresse: "" });
  const [saudePes, setSaudePes] = useState({ dorPes: "", calos: "", unhasEncravadas: "", formigamento: "", alteracaoCor: "" });
  const [avaliacao, setAvaliacao] = useState({ pele: "", unhas: "", calosidades: "", tipoPisada: "", edemas: "", hidratacao: "" });
  
  const [anexoFoto, setAnexoFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (anamneseExistente) {
        console.log("Populando formulário com anamneseExistente:", anamneseExistente);
        setIdAnamnese(anamneseExistente.id);
        setDataRegistro(anamneseExistente.dataRegistro?.split("T")[0] || new Date().toISOString().split('T')[0]);
        setIdade(anamneseExistente.idade?.toString() || "");
        setGenero(anamneseExistente.genero || "");
        setQueixaPrincipal(anamneseExistente.queixaPrincipal || "");
        setTempoProblema(anamneseExistente.tempoProblema || "");
        setTratamentoAnterior(anamneseExistente.tratamentoAnterior || "");
        setHistoria(anamneseExistente.historia || "");
        setDoencasSelecionadas(anamneseExistente.doencas ? anamneseExistente.doencas.split(", ") : []);
        setOutraDoenca(anamneseExistente.outraDoenca || "");
        setCirurgiaRecente(anamneseExistente.cirurgiaRecente || "");
        setAlergia(anamneseExistente.alergia || "");
        setMedicamentos(anamneseExistente.medicamentos || "");
        setProdutos(anamneseExistente.produtos || "");
        setMateriais(anamneseExistente.materiais || "");
        setHistoricoFamiliar(anamneseExistente.historicoFamiliar || "");
        setHistoricoFamiliarEspecificar(anamneseExistente.historicoFamiliarEspecificar || "");

        const parseJsonField = (jsonString: string | undefined, defaultObject: object) => {
            if (jsonString) {
                try {
                    return JSON.parse(jsonString);
                } catch (e) {
                    console.error("Erro ao parsear campo JSON:", jsonString, e);
                    return defaultObject;
                }
            }
            return defaultObject;
        };

        setHabitos(parseJsonField(anamneseExistente.habitos, { atividadeFisica: "", consomeAlcool: "", fuma: "", nivelEstresse: "" }));
        setSaudePes(parseJsonField(anamneseExistente.saudePes, { dorPes: "", calos: "", unhasEncravadas: "", formigamento: "", alteracaoCor: "" }));
        setAvaliacao(parseJsonField(anamneseExistente.avaliacao, { pele: "", unhas: "", calosidades: "", tipoPisada: "", edemas: "", hidratacao: "" }));

        if (anamneseExistente.foto) {
            setFotoPreview(`data:image/jpeg;base64,${anamneseExistente.foto}`);
        } else {
            setFotoPreview(null);
        }
        setAnexoFoto(null); 
    } else {
        setIdAnamnese(undefined);
        setDataRegistro(new Date().toISOString().split('T')[0]);
        setIdade("");
        setGenero("");
        setQueixaPrincipal("");
        setTempoProblema("");
        setTratamentoAnterior("");
        setHistoria("");
        setDoencasSelecionadas([]);
        setOutraDoenca("");
        setCirurgiaRecente("");
        setAlergia("");
        setMedicamentos("");
        setProdutos("");
        setMateriais("");
        setHistoricoFamiliar("");
        setHistoricoFamiliarEspecificar("");
        setHabitos({ atividadeFisica: "", consomeAlcool: "", fuma: "", nivelEstresse: "" });
        setSaudePes({ dorPes: "", calos: "", unhasEncravadas: "", formigamento: "", alteracaoCor: "" });
        setAvaliacao({ pele: "", unhas: "", calosidades: "", tipoPisada: "", edemas: "", hidratacao: "" });
        setAnexoFoto(null);
        setFotoPreview(null);
    }
  }, [anamneseExistente]);


  const convertFileToBase64 = (file: File): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result.split(',')[1]); 
        } else {
          resolve(null); 
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!clienteId || !agendamentoId) {
        alert("Cliente ID ou Agendamento ID estão ausentes. Não é possível salvar a anamnese.");
        setIsSubmitting(false);
        return;
    }
    if (!dataRegistro || !idade || !genero || !queixaPrincipal || !historia) {
        alert("Por favor, preencha todos os campos obrigatórios: Data de Registro, Idade, Gênero, Queixa Principal e História.");
        setIsSubmitting(false);
        return;
    }

    let fotoBase64: string | null = null;
    if (anexoFoto) {
      try {
        fotoBase64 = await convertFileToBase64(anexoFoto);
      } catch (error) {
        console.error("Erro ao converter imagem:", error);
        alert("Erro ao processar a imagem. Tente novamente ou envie sem imagem.");
        setIsSubmitting(false);
        return;
      }
    } else if (idAnamnese && anamneseExistente?.foto) {
        fotoBase64 = anamneseExistente.foto;
    }

    const payload: AnamnesePayload = {
      id: idAnamnese === undefined ? null : idAnamnese,
      agendamentoId,
      clienteId,
      dataRegistro,
      idade: parseInt(idade, 10) || 0,
      genero,
      queixaPrincipal,
      tempoProblema,
      tratamentoAnterior,
      historia,
      doencas: doencasSelecionadas.join(", "),
      outraDoenca: doencasSelecionadas.includes("Outra") ? outraDoenca : "",
      cirurgiaRecente,
      alergia,
      medicamentos: alergia === "sim" ? medicamentos : "",
      produtos: alergia === "sim" ? produtos : "",
      materiais: alergia === "sim" ? materiais : "",
      historicoFamiliar,
      historicoFamiliarEspecificar: historicoFamiliar === "sim" ? historicoFamiliarEspecificar : "",
      habitos: JSON.stringify(habitos),
      saudePes: JSON.stringify(saudePes),
      avaliacao: JSON.stringify(avaliacao),
      foto: fotoBase64,
    };


    console.log("handleSubmitForm: Payload que será enviado para /api/anamnese/salvar ou /atualizar:", JSON.stringify(payload, null, 2));
    console.log("payload.id:", payload.id);
    console.log("handleSubmitForm: Detalhes chave para o backend:");
    console.log("payload.id (para edição):", payload.id);
    console.log("payload.agendamentoId:", payload.agendamentoId);
    console.log("payload.clienteId:", payload.clienteId);


    const isEditing = idAnamnese !== undefined;
    const apiUrl = isEditing
      ? `http://localhost:8080/api/anamnese/atualizar/${idAnamnese}`
      : "http://localhost:8080/api/anamnese/salvar";
    const method = isEditing ? "PUT" : "POST";

    console.log(`Enviando para ${apiUrl} com método ${method}`);

    try {
      const response = await fetch(apiUrl, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text(); 
        let detailedMessage = `Erro ${response.status}: ${response.statusText || 'Desconhecido'}`;

  
        if (errorText) {
            detailedMessage = errorText;
        } else {
            try {
                const errorJson = JSON.parse(errorText);
                detailedMessage = errorJson.message || errorJson.error || detailedMessage;
            } catch (e) {
            }
        }
        console.error("Erro do backend ao salvar anamnese (texto da resposta):", errorText);
        throw new Error(detailedMessage);
      }

      const responseData = await response.json(); 
      alert(`Anamnese ${isEditing ? 'atualizada' : 'salva'} com sucesso! ID: ${responseData.id}`);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar anamnese (no catch do frontend):", error);
      alert(`Erro ao salvar a anamnese: ${(error as Error).message}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAnexoFoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAnexoFoto(null);
      setFotoPreview(null);
    }
  };

  const handleRemoveFoto = () => {
    setAnexoFoto(null);
    setFotoPreview(null);
    const inputFile = document.getElementById('foto-anamnese-input') as HTMLInputElement | null;
    if (inputFile) {
        inputFile.value = ""; 
    }
  };

  const handleDoencasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setDoencasSelecionadas((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleNestedStateChange = (
    setState: React.Dispatch<React.SetStateAction<any>>, // eslint-disable-line @typescript-eslint/no-explicit-any
    field: string,
    value: string
  ) => {
    setState((prevState: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      ...prevState,
      [field]: value,
    }));
  };


  return (
    <div className="p-6 md:p-8 max-h-[85vh] overflow-y-auto bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-700 border-b pb-4">
        {idAnamnese ? "Editar Ficha de Anamnese" : "Nova Ficha de Anamnese"}
      </h1>
      <form onSubmit={handleSubmitForm} className="space-y-8">

        <fieldset className="border p-4 rounded-md shadow-sm bg-white">
            <legend className="text-xl font-semibold px-2 text-blue-600">Dados Iniciais</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mt-2">
                <div>
                    <label htmlFor="dataRegistro" className="block text-sm font-medium text-gray-700 mb-1">Data de Registro:</label>
                    <input id="dataRegistro" type="date" value={dataRegistro} onChange={(e) => setDataRegistro(e.target.value)}
                    className="border rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500 transition-colors" required />
                </div>
                <div>
                    <label htmlFor="idade" className="block text-sm font-medium text-gray-700 mb-1">Idade:</label>
                    <input id="idade" type="number" value={idade} onChange={(e) => setIdade(e.target.value)}
                    className="border rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500 transition-colors" required />
                </div>
                <div>
                    <label htmlFor="genero" className="block text-sm font-medium text-gray-700 mb-1">Gênero:</label>
                    <select id="genero" value={genero} onChange={(e) => setGenero(e.target.value)}
                    className="border rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500 transition-colors" required >
                    <option value="">Selecione...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                    </select>
                </div>
            </div>
        </fieldset>

        <fieldset className="border p-4 rounded-md shadow-sm bg-white">
            <legend className="text-xl font-semibold px-2 text-blue-600">Informações da Queixa</legend>
            <div className="space-y-4 mt-2">
                <div>
                    <label htmlFor="queixaPrincipal" className="block text-sm font-medium text-gray-700 mb-1">Queixa Principal:</label>
                    <textarea id="queixaPrincipal" value={queixaPrincipal} onChange={(e) => setQueixaPrincipal(e.target.value)}
                    className="border rounded-md p-2 w-full h-20 focus:ring-blue-500 focus:border-blue-500 transition-colors" required />
                </div>
                <div>
                    <label htmlFor="tempoProblema" className="block text-sm font-medium text-gray-700 mb-1">Há quanto tempo está com esse problema?</label>
                    <input id="tempoProblema" type="text" value={tempoProblema} onChange={(e) => setTempoProblema(e.target.value)}
                    className="border rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
                <div>
                    <label htmlFor="tratamentoAnterior" className="block text-sm font-medium text-gray-700 mb-1">Já fez algum tratamento antes? Qual?</label>
                    <input id="tratamentoAnterior" type="text" value={tratamentoAnterior} onChange={(e) => setTratamentoAnterior(e.target.value)}
                    className="border rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
                <div>
                    <label htmlFor="historia" className="block text-sm font-medium text-gray-700 mb-1">História (descreva com detalhes):</label>
                    <textarea id="historia" value={historia} onChange={(e) => setHistoria(e.target.value)}
                    className="border rounded-md p-2 w-full h-24 focus:ring-blue-500 focus:border-blue-500 transition-colors" required />
                </div>
            </div>
        </fieldset>

        <fieldset className="border p-4 rounded-md shadow-sm bg-white">
            <legend className="text-xl font-semibold px-2 text-blue-600">Saúde Geral</legend>
            <div className="space-y-4 mt-2">
                <div>
                    <span className="block text-sm font-medium text-gray-700 mb-1">Possui alguma doença diagnosticada?</span>
                    <div className="mt-2 space-y-1">
                        {["Diabetes", "Hipertensão", "Doença Vascular", "Outra"].map(d => (
                            <label key={d} className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" value={d} checked={doencasSelecionadas.includes(d)}
                                    onChange={handleDoencasChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{d}</span>
                            </label>
                        ))}
                    </div>
                    {doencasSelecionadas.includes("Outra") && (
                    <input type="text" placeholder="Especifique outra doença" value={outraDoenca} onChange={(e) => setOutraDoenca(e.target.value)}
                        className="border rounded-md p-2 w-full mt-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                    )}
                </div>
                <div>
                    <label htmlFor="cirurgiaRecente" className="block text-sm font-medium text-gray-700 mb-1">Já passou por cirurgias recentemente? Se sim, qual(is) e quando?</label>
                     <input id="cirurgiaRecente" type="text" value={cirurgiaRecente} onChange={(e) => setCirurgiaRecente(e.target.value)}
                        className="border rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
            </div>
        </fieldset>

        <fieldset className="border p-4 rounded-md shadow-sm bg-white">
            <legend className="text-xl font-semibold px-2 text-blue-600">Alergias</legend>
             <div className="space-y-4 mt-2">
                <div>
                    <label htmlFor="alergia" className="block text-sm font-medium text-gray-700 mb-1">Possui alergias?</label>
                    <select id="alergia" value={alergia} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAlergia(e.target.value)}
                        className="border rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500 transition-colors" >
                        <option value="">Selecione...</option> <option value="sim">Sim</option> <option value="nao">Não</option>
                    </select>
                    {alergia === "sim" && (
                    <div className="space-y-2 mt-3">
                        <input type="text" placeholder="Alergia a Medicamentos (quais?)" value={medicamentos} onChange={(e) => setMedicamentos(e.target.value)}
                        className="border rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                        <input type="text" placeholder="Alergia a Produtos (quais?)" value={produtos} onChange={(e) => setProdutos(e.target.value)}
                        className="border rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                        <input type="text" placeholder="Alergia a Materiais (quais?)" value={materiais} onChange={(e) => setMateriais(e.target.value)}
                        className="border rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                    </div>
                    )}
                </div>
            </div>
        </fieldset>

        {/* === Histórico Familiar === */}
        <fieldset className="border p-4 rounded-md shadow-sm bg-white">
            <legend className="text-xl font-semibold px-2 text-blue-600">Histórico Familiar</legend>
            <div className="space-y-4 mt-2">
                <div>
                    <label htmlFor="historicoFamiliar" className="block text-sm font-medium text-gray-700 mb-1">Doenças relevantes na família?</label>
                    <select id="historicoFamiliar" value={historicoFamiliar} onChange={(e) => setHistoricoFamiliar(e.target.value)}
                        className="border rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500 transition-colors">
                        <option value="">Selecione...</option>
                        <option value="sim">Sim</option>
                        <option value="nao">Não</option>
                    </select>
                </div>
                {historicoFamiliar === "sim" && (
                    <div>
                        <label htmlFor="historicoFamiliarEspecificar" className="block text-sm font-medium text-gray-700 mb-1">Quais doenças?</label>
                        <input id="historicoFamiliarEspecificar" type="text" value={historicoFamiliarEspecificar} onChange={(e) => setHistoricoFamiliarEspecificar(e.target.value)}
                            placeholder="Especifique as doenças familiares"
                            className="border rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                    </div>
                )}
            </div>
        </fieldset>

        {/* === Hábitos === */}
        <fieldset className="border p-4 rounded-md shadow-sm bg-white">
            <legend className="text-xl font-semibold px-2 text-blue-600">Hábitos</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-2">
                <div>
                    <label htmlFor="habitosAtividadeFisica" className="block text-sm font-medium text-gray-700 mb-1">Pratica atividade física?</label>
                    <select id="habitosAtividadeFisica" value={habitos.atividadeFisica}
                        onChange={(e) => handleNestedStateChange(setHabitos, "atividadeFisica", e.target.value)}
                        className="border rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500 transition-colors">
                        <option value="">Selecione...</option>
                        <option value="sim">Sim</option>
                        <option value="nao">Não</option>
                        <option value="asvezes">Às vezes</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="habitosConsomeAlcool" className="block text-sm font-medium text-gray-700 mb-1">Consome álcool?</label>
                    <select id="habitosConsomeAlcool" value={habitos.consomeAlcool}
                        onChange={(e) => handleNestedStateChange(setHabitos, "consomeAlcool", e.target.value)}
                        className="border rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500 transition-colors">
                        <option value="">Selecione...</option>
                        <option value="sim_frequentemente">Sim, frequentemente</option>
                        <option value="sim_socialmente">Sim, socialmente</option>
                        <option value="nao">Não</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="habitosFuma" className="block text-sm font-medium text-gray-700 mb-1">Fuma?</label>
                    <select id="habitosFuma" value={habitos.fuma}
                        onChange={(e) => handleNestedStateChange(setHabitos, "fuma", e.target.value)}
                        className="border rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500 transition-colors">
                        <option value="">Selecione...</option>
                        <option value="sim">Sim</option>
                        <option value="nao">Não</option>
                        <option value="parou">Já fumou, mas parou</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="habitosNivelEstresse" className="block text-sm font-medium text-gray-700 mb-1">Nível de Estresse:</label>
                    <select id="habitosNivelEstresse" value={habitos.nivelEstresse}
                        onChange={(e) => handleNestedStateChange(setHabitos, "nivelEstresse", e.target.value)}
                        className="border rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500 transition-colors">
                        <option value="">Selecione...</option>
                        <option value="baixo">Baixo</option>
                        <option value="medio">Médio</option>
                        <option value="alto">Alto</option>
                    </select>
                </div>
            </div>
        </fieldset>

        {/* === Saúde dos Pés === */}
        <fieldset className="border p-4 rounded-md shadow-sm bg-white">
            <legend className="text-xl font-semibold px-2 text-blue-600">Saúde dos Pés</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-2">
                <div>
                    <label htmlFor="saudePesDorPes" className="block text-sm font-medium text-gray-700 mb-1">Sente dor nos pés?</label>
                    <input id="saudePesDorPes" type="text" value={saudePes.dorPes}
                        onChange={(e) => handleNestedStateChange(setSaudePes, "dorPes", e.target.value)}
                        placeholder="Ex: Ao caminhar, constante, etc."
                        className="border rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
                <div>
                    <label htmlFor="saudePesCalos" className="block text-sm font-medium text-gray-700 mb-1">Presença de calos/calosidades?</label>
                    <input id="saudePesCalos" type="text" value={saudePes.calos}
                        onChange={(e) => handleNestedStateChange(setSaudePes, "calos", e.target.value)}
                        placeholder="Ex: Sim, no calcanhar; Não"
                        className="border rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
                <div>
                    <label htmlFor="saudePesUnhasEncravadas" className="block text-sm font-medium text-gray-700 mb-1">Unhas encravadas?</label>
                    <input id="saudePesUnhasEncravadas" type="text" value={saudePes.unhasEncravadas}
                        onChange={(e) => handleNestedStateChange(setSaudePes, "unhasEncravadas", e.target.value)}
                        placeholder="Ex: Sim, dedão esquerdo; Não"
                        className="border rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
                <div>
                    <label htmlFor="saudePesFormigamento" className="block text-sm font-medium text-gray-700 mb-1">Formigamento ou dormência?</label>
                    <input id="saudePesFormigamento" type="text" value={saudePes.formigamento}
                        onChange={(e) => handleNestedStateChange(setSaudePes, "formigamento", e.target.value)}
                        placeholder="Ex: Sim, nos dedos à noite; Não"
                        className="border rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="saudePesAlteracaoCor" className="block text-sm font-medium text-gray-700 mb-1">Alteração de cor na pele dos pés?</label>
                    <input id="saudePesAlteracaoCor" type="text" value={saudePes.alteracaoCor}
                        onChange={(e) => handleNestedStateChange(setSaudePes, "alteracaoCor", e.target.value)}
                        placeholder="Ex: Palidez, vermelhidão, manchas escuras"
                        className="border rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
            </div>
        </fieldset>

        {/* === Avaliação Visual (Profissional) === */}
        <fieldset className="border p-4 rounded-md shadow-sm bg-white">
            <legend className="text-xl font-semibold px-2 text-blue-600">Avaliação Visual (Profissional)</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-2">
                <div>
                    <label htmlFor="avaliacaoPele" className="block text-sm font-medium text-gray-700 mb-1">Aspecto da Pele:</label>
                    <input id="avaliacaoPele" type="text" value={avaliacao.pele}
                        onChange={(e) => handleNestedStateChange(setAvaliacao, "pele", e.target.value)}
                        placeholder="Ex: Ressecada, fina, íntegra"
                        className="border rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
                <div>
                    <label htmlFor="avaliacaoUnhas" className="block text-sm font-medium text-gray-700 mb-1">Aspecto das Unhas:</label>
                    <input id="avaliacaoUnhas" type="text" value={avaliacao.unhas}
                        onChange={(e) => handleNestedStateChange(setAvaliacao, "unhas", e.target.value)}
                        placeholder="Ex: Quebradiças, espessas, com micose"
                        className="border rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
                <div>
                    <label htmlFor="avaliacaoCalosidades" className="block text-sm font-medium text-gray-700 mb-1">Calosidades:</label>
                    <input id="avaliacaoCalosidades" type="text" value={avaliacao.calosidades}
                        onChange={(e) => handleNestedStateChange(setAvaliacao, "calosidades", e.target.value)}
                        placeholder="Localização e tipo"
                        className="border rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
                <div>
                    <label htmlFor="avaliacaoTipoPisada" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Pisada:</label>
                    <input id="avaliacaoTipoPisada" type="text" value={avaliacao.tipoPisada}
                        onChange={(e) => handleNestedStateChange(setAvaliacao, "tipoPisada", e.target.value)}
                        placeholder="Ex: Pronada, supinada, neutra"
                        className="border rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
                <div>
                    <label htmlFor="avaliacaoEdemas" className="block text-sm font-medium text-gray-700 mb-1">Edemas (Inchaços):</label>
                    <input id="avaliacaoEdemas" type="text" value={avaliacao.edemas}
                        onChange={(e) => handleNestedStateChange(setAvaliacao, "edemas", e.target.value)}
                        placeholder="Presença, localização, intensidade"
                        className="border rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
                <div>
                    <label htmlFor="avaliacaoHidratacao" className="block text-sm font-medium text-gray-700 mb-1">Nível de Hidratação:</label>
                    <input id="avaliacaoHidratacao" type="text" value={avaliacao.hidratacao}
                        onChange={(e) => handleNestedStateChange(setAvaliacao, "hidratacao", e.target.value)}
                        placeholder="Ex: Boa, regular, ruim"
                        className="border rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
            </div>
        </fieldset>


        <fieldset className="border p-4 rounded-md shadow-sm bg-white">
            <legend className="text-xl font-semibold px-2 text-blue-600">Anexar Foto (Opcional)</legend>
            <div className="mt-2">
                <label htmlFor="foto-anamnese-input" className="block text-sm font-medium text-gray-700 mb-1">Selecione uma foto (Ex: da área afetada):</label>
                <input id="foto-anamnese-input" type="file" accept="image/*" onChange={handleFotoChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                {fotoPreview && (
                <div className="mt-4 p-2 border rounded-md inline-block">
                    <p className="text-sm font-medium text-gray-700 mb-1">Pré-visualização:</p>
                    <img src={fotoPreview} alt="Preview da foto da anamnese" className="mt-1 rounded-md border max-w-xs h-auto shadow-sm" />
                    <button type="button" onClick={handleRemoveFoto}
                    className="mt-2 text-xs text-red-600 hover:text-red-800 hover:underline">Remover foto</button>
                </div>
                )}
            </div>
        </fieldset>


        <div className="flex flex-col sm:flex-row justify-end items-center mt-10 pt-6 border-t gap-3">
          <button type="button" onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-medium text-sm">
            Cancelar
          </button>
          <button type="submit" disabled={isSubmitting}
            className={`w-full sm:w-auto px-8 py-2.5 text-white rounded-md transition-colors font-medium text-sm ${
                isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Salvando..." : (idAnamnese ? "Atualizar Anamnese" : "Salvar Anamnese")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioAnamnesePage;