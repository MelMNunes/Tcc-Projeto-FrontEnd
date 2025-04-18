// pages/anamnese/page.tsx
import React, { useState, useEffect } from 'react';

interface AnamnesePageProps {
  agendamentoId: number;
}

const AnamnesePage: React.FC = () => {
  const [dataRegistro, setDataRegistro] = useState('');
  const [idade, setIdade] = useState('');
  const [genero, setGenero] = useState('');
  const [queixaPrincipal, setQueixaPrincipal] = useState('');
  const [tempoProblema, setTempoProblema] = useState('');
  const [tratamentoAnterior, setTratamentoAnterior] = useState('');
  const [historia, setHistoria] = useState('');
  const [doencas, setDoencas] = useState<string[]>([]);
  const [outraDoenca, setOutraDoenca] = useState('');
  const [cirurgiaRecente, setCirurgiaRecente] = useState('nao');
  const [alergia, setAlergia] = useState('nao');
  const [medicamentos, setMedicamentos] = useState('');
  const [produtos, setProdutos] = useState('');
  const [materiais, setMateriais] = useState('');
  const [historicoFamiliar, setHistoricoFamiliar] = useState('nao');
  const [historicoFamiliarEspecificar, setHistoricoFamiliarEspecificar] = useState('');
  const [habitos, setHabitos] = useState({
    atividadeFisica: '',
    consomeAlcool: 'nao',
    fuma: 'nao',
    nivelEstresse: '',
  });
  const [saudePes, setSaudePes] = useState({
    dorPes: '',
    calos: '',
    unhasEncravadas: '',
    formigamento: '',
    alteracaoCor: '',
  });
  const [avaliacao, setAvaliacao] = useState({
    pele: '',
    unhas: '',
    calosidades: '',
    tipoPisada: '',
    edemas: '',
    hidratacao: '',
  });
  const [anexos, setAnexos] = useState<File[]>([]);

  // Efeito para definir a data de registro como a data atual
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Formata a data no formato YYYY-MM-DD
    setDataRegistro(formattedDate);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAnexos((prevAnexos) => [...prevAnexos, ...filesArray]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAnexos((prevAnexos) => prevAnexos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const anamneseData = {
        agendamentoId: {agendamentoId}, // Substitua pelo ID do agendamento real
        dataRegistro,
        idade: parseInt(idade),
        genero,
        queixaPrincipal,
        tempoProblema,
        tratamentoAnterior,
        historia,
        doencas: doencas.join(','), // Converte o array de doenças em uma string
        outraDoenca,
        cirurgiaRecente,
        alergia,
        medicamentos,
        produtos,
        materiais,
        historicoFamiliar,
        historicoFamiliarEspecificar,
        habitos: JSON.stringify(habitos), // Converte o objeto de hábitos em uma string JSON
        saudePes: JSON.stringify(saudePes), // Converte o objeto de saúde dos pés em uma string JSON
        avaliacao: JSON.stringify(avaliacao), // Converte o objeto de avaliação em uma string JSON
    };

    try {
        const response = await fetch('http://localhost:8080/api/anamnese/criar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(anamneseData),
        });

        if (!response.ok) {
            throw new Error('Erro ao salvar a anamnese');
        }

        const result = await response.json();
        console.log('Anamnese salva com sucesso:', result);
        // Aqui você pode adicionar lógica para redirecionar ou mostrar uma mensagem de sucesso
    } catch (error) {
        console.error('Erro ao enviar anamnese:', error);
    }
};

  return (
    <div className="p-8 bg-white rounded shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Formulário de Anamnese</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados do Cliente */}
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

        {/* Informações do Cliente */}
        <h3 className="text-xl font-semibold mt-6">Informações do Cliente</h3>
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
          <label className="block mb-2">Há quanto tempo está com esse problema?</label>
          <input
            type="text"
            value={tempoProblema}
            onChange={(e) => setTempoProblema(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-2">Já fez algum tratamento antes? Qual?</label>
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

        {/* Doenças */}
        <div>
          <label className="block mb-2">Possui alguma doença diagnosticada?</label>
          <select
            multiple
            value={doencas}
            onChange={(e) => {
              const options = e.target.options;
              const selected = [];
              for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                  selected.push(options[i].value);
                }
              }
              setDoencas(selected);
            }}
            className="border rounded p-2 w-full"
          >
            <option value="diabetes">Diabetes</option>
            <option value="hipertensao">Hipertensão</option>
            <option value="doenca_vascular">Doença Vascular</option>
            <option value="outra">Outra</option>
          </select>
          {doencas.includes('outra') && (
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
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
          {cirurgiaRecente === 'sim' && (
            <input
              type="text"
              placeholder="Especifique"
              className="border rounded p-2 w-full mt-2"
            />
          )}
        </div>
        <div>
          <label className="block mb-2">Possui alergias?</label>
          <select
            value={alergia}
            onChange={(e) => setAlergia(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
          {alergia === 'sim' && (
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
        <div>
          <label className="block mb-2">Histórico familiar de doenças?</label>
          <select
            value={historicoFamiliar}
            onChange={(e) => setHistoricoFamiliar(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
          {historicoFamiliar === 'sim' && (
            <input
              type="text"
              placeholder="Especifique"
              value={historicoFamiliarEspecificar}
              onChange={(e) => setHistoricoFamiliarEspecificar(e.target.value)}
              className="border rounded p-2 w-full mt-2"
            />
          )}
        </div>

        {/* Hábitos do Cliente */}
        <h3 className="text-xl font-semibold mt-6">Hábitos do Cliente</h3>
        <div>
          <label className="block mb-2">Pratica atividades físicas?</label>
          <select
            value={habitos.atividadeFisica}
            onChange={(e) => setHabitos({ ...habitos, atividadeFisica: e.target.value })}
            className="border rounded p-2 w-full"
          >
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
          {habitos.atividadeFisica === 'sim' && (
            <input
              type="text"
              placeholder="Quais?"
              className="border rounded p-2 w-full mt-2"
            />
          )}
        </div>
        <div>
          <label className="block mb-2">Consome álcool?</label>
          <select
            value={habitos.consomeAlcool}
            onChange={(e) => setHabitos({ ...habitos, consomeAlcool: e.target.value })}
            className="border rounded p-2 w-full"
          >
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
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
        </div>
        <div>
          <label className="block mb-2">Nível de estresse:</label>
          <select
            value={habitos.nivelEstresse}
            onChange={(e) => setHabitos({ ...habitos, nivelEstresse: e.target.value })}
            className="border rounded p-2 w-full"
          >
            <option value="">Selecione</option>
            <option value="baixo">Baixo</option>
            <option value="medio">Médio</option>
            <option value="alto">Alto</option>
          </select>
        </div>

        {/* Saúde dos Pés */}
        <h3 className="text-xl font-semibold mt-6">Saúde dos Pés</h3>
        <div>
          <label className="block mb-2">Sente dor nos pés? Em qual região?</label>
          <input
            type="text"
            value={saudePes.dorPes}
            onChange={(e) => setSaudePes({ ...saudePes, dorPes: e.target.value })}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-2">Já teve calos, rachaduras, micoses ou verrugas plantares?</label>
          <select
            value={saudePes.calos}
            onChange={(e) => setSaudePes({ ...saudePes, calos: e.target.value })}
            className="border rounded p-2 w-full"
          >
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
        </div>
        <div>
          <label className="block mb-2">Possui unhas encravadas ou deformadas?</label>
          <select
            value={saudePes.unhasEncravadas}
            onChange={(e) => setSaudePes({ ...saudePes, unhasEncravadas: e.target.value })}
            className="border rounded p-2 w-full"
          >
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
        </div>
        <div>
          <label className="block mb-2">Sente formigamento, dormência ou queimação nos pés?</label>
          <select
            value={saudePes.formigamento}
            onChange={(e) => setSaudePes({ ...saudePes, formigamento: e.target.value })}
            className="border rounded p-2 w-full"
          >
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
        </div>
        <div>
          <label className="block mb-2">Há alteração na coloração ou temperatura dos pés?</label>
          <select
            value={saudePes.alteracaoCor}
            onChange={(e) => setSaudePes({ ...saudePes, alteracaoCor: e.target.value })}
            className="border rounded p-2 w-full"
          >
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
        </div>

        {/* Avaliação Visual */}
        <h3 className="text-xl font-semibold mt-6">Avaliação Visual (preenchida pelo profissional)</h3>
        <div>
          <label className="block mb-2">Pele:</label>
          <input
            type="text"
            value={avaliacao.pele}
            onChange={(e) => setAvaliacao({ ...avaliacao, pele: e.target.value })}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-2">Unhas:</label>
          <input
            type="text"
            value={avaliacao.unhas}
            onChange={(e) => setAvaliacao({ ...avaliacao, unhas: e.target.value })}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-2">Presença de calosidades, fissuras ou micoses?</label>
          <input
            type="text"
            value={avaliacao.calosidades}
            onChange={(e) => setAvaliacao({ ...avaliacao, calosidades: e.target.value })}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-2">Tipo de pisada:</label>
          <input
            type="text"
            value={avaliacao.tipoPisada}
            onChange={(e) => setAvaliacao({ ...avaliacao, tipoPisada: e.target.value })}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-2">Edemas (inchaços):</label>
          <input
            type="text"
            value={avaliacao.edemas}
            onChange={(e) => setAvaliacao({ ...avaliacao, edemas: e.target.value })}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-2">Hidratação e sensibilidade da pele:</label>
          <input
            type="text"
            value={avaliacao.hidratacao}
            onChange={(e) => setAvaliacao({ ...avaliacao, hidratacao: e.target.value })}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* Anexar Arquivos */}
        <div>
          <label className="block mb-2">Anexar Arquivos (fotos, PDFs):</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="border rounded p-2 w-full"
          />
          <div className="mt-2">
            {anexos.map((file, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-500 hover:underline"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Botões de Salvar e Cancelar */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600"
            onClick={() => {
              // Lógica para cancelar (por exemplo, limpar campos ou redirecionar)
              console.log('Cancelado');
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnamnesePage;