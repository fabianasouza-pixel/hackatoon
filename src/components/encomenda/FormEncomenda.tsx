"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { buscarPeca, type Peca } from "@/data/pecas";
import { INSTAGRAM_RENATA, LINK_INSTAGRAM, WHATSAPP_RENATA, formatarWhatsapp, linkWhatsapp } from "@/lib/contato";
import { AROS, BRACELETES, mm } from "./medidas";
import s from "./FormEncomenda.module.css";

type TipoId = "anel" | "colar" | "bracelete" | "brincos" | "aliancas" | "ferramentas" | "paramentas";
type Medida = "aro" | "par" | "pulso";
type Tipo = { id: TipoId; nome: string; grupo: "dia" | "ritual"; medida?: Medida; dica: string };

const TIPOS: Tipo[] = [
  { id: "anel", nome: "Anel", grupo: "dia", medida: "aro", dica: "Largo ou fino, liso, martelado, com búzio, com alguma palavra gravada…" },
  { id: "colar", nome: "Colar", grupo: "dia", dica: "Comprimento, pingentes, se leva búzio ou ráfia…" },
  { id: "bracelete", nome: "Bracelete", grupo: "dia", medida: "pulso", dica: "Largura, se é liso, martelado ou gravado, se leva búzio ou ráfia…" },
  { id: "brincos", nome: "Brincos", grupo: "dia", dica: "Formato, tamanho, se são leves ou marcantes…" },
  { id: "aliancas", nome: "Alianças", grupo: "dia", medida: "par", dica: "Largura, acabamento, nomes ou data gravados por dentro…" },
  { id: "ferramentas", nome: "Ferramentas de orixás", grupo: "ritual", dica: "Para qual orixá, qual ferramenta, tamanho e o que a casa pede…" },
  { id: "paramentas", nome: "Paramentas", grupo: "ritual", dica: "Para qual orixá, qual paramenta, medidas e o que a casa pede…" },
];
const GRUPOS = [
  { id: "dia", nome: "Dia a dia" },
  { id: "ritual", nome: "Rituais religiosos" },
] as const;
const CATEGORIA_PARA_TIPO: Record<Peca["categoria"], TipoId> = {
  aneis: "anel",
  colares: "colar",
  braceletes: "bracelete",
  brincos: "brincos",
  rituais: "ferramentas",
};

const METAIS = ["Latão", "Cobre", "Prata 925"] as const;
type Metal = (typeof METAIS)[number];

const FUNDO = [
  "/pecas/aneis-buzio.jpg",
  "/pecas/braceletes-ninho.jpg",
  "/pecas/brincos-laminas.jpg",
];

const ETAPAS = [
  {
    titulo: "Conversa",
    texto: "Você conta sua ideia no formulário e a Renata responde pelo WhatsApp com o orçamento.",
    foto: "/renata/renata-sorriso.jpg",
    foco: "50% 30%",
    alt: "Renata Ferré sorrindo, usando anéis e braceletes de latão",
  },
  {
    titulo: "Criação",
    texto: "A Renata acerta com você o desenho, o metal e a medida da peça.",
    foto: "/pecas/anel-oya.jpg",
    foco: "50% 60%",
    alt: "Anel de cobre com a palavra OYA gravada, no tribulet da bancada",
  },
  {
    titulo: "Produção",
    texto: "A peça é recortada, martelada e finalizada à mão, na bancada da Renata.",
    foto: "/pecas/bracelete-enlacado.jpg",
    foco: "50% 50%",
    alt: "Bracelete em espiral de cobre com búzio amarrado com fio de cobre",
  },
  {
    titulo: "Entrega",
    texto: "Sua joia única chega no cartão da Renata Ferré, pronta para usar.",
    foto: "/pecas/aneis-buzio.jpg",
    foco: "50% 45%",
    alt: "Anéis de cobre com búzio ao lado do cartão da Renata Ferré",
  },
];

const MIN_DESCRICAO = 20;
const MAX_FOTOS = 3;

type Campo = "tipo" | "medida" | "metal" | "descricao" | "nome";
type Erros = Partial<Record<Campo, string>>;
const ORDEM: Campo[] = ["tipo", "medida", "metal", "descricao", "nome"];

export function FormEncomenda({ referenciaInicial }: { referenciaInicial?: string }) {
  const [referencia, setReferencia] = useState(() => (referenciaInicial ? buscarPeca(referenciaInicial) : undefined));
  const [tipoId, setTipoId] = useState<TipoId | null>(() => (referencia ? CATEGORIA_PARA_TIPO[referencia.categoria] : null));
  const [aro, setAro] = useState("");
  const [aro2, setAro2] = useState("");
  const [pulso, setPulso] = useState("");
  const [metal, setMetal] = useState<Metal | null>(null);
  const [descricao, setDescricao] = useState("");
  const [fotos, setFotos] = useState<{ nome: string; url: string }[]>([]);
  const [nome, setNome] = useState("");
  const [indicacao, setIndicacao] = useState<"Sim" | "Não" | null>(null);
  const [quemIndicou, setQuemIndicou] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [enviado, setEnviado] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const tela = useRef<HTMLElement>(null);
  const coluna = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);
  const confirmacao = useRef<HTMLHeadingElement>(null);

  const tipo = TIPOS.find((t) => t.id === tipoId);
  const link = linkWhatsapp(
    montarMensagem({
      nome,
      tipo,
      medida: textoMedida(tipo?.medida, aro, aro2, pulso),
      metal,
      descricao,
      fotos: fotos.length,
      referencia,
      indicacao: indicacao === "Sim" ? (quemIndicou.trim() ? `sim, de ${quemIndicou.trim()}` : "sim") : indicacao === "Não" ? "não" : "",
    }),
  );

  useEffect(() => () => fotos.forEach((f) => URL.revokeObjectURL(f.url)), [fotos]);
  useEffect(() => {
    if (!enviado) return;
    tela.current?.scrollIntoView({ block: "start" });
    confirmacao.current?.focus({ preventScroll: true });
  }, [enviado]);

  // O formulário aparece quando a cliente desce até ele
  useEffect(() => {
    const el = coluna.current;
    if (!el || !("IntersectionObserver" in window)) {
      setVisivel(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisivel(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  function limpar(campo: Campo) {
    setErros((er) => {
      if (!er[campo]) return er;
      const resto = { ...er };
      delete resto[campo];
      return resto;
    });
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const er: Erros = {};
    if (!tipo) er.tipo = "Escolha o tipo de peça.";
    if (tipo?.medida === "aro" && !aro) er.medida = "Escolha o seu aro.";
    if (tipo?.medida === "par" && (!aro || !aro2)) er.medida = "Escolha o aro das duas alianças.";
    if (tipo?.medida === "pulso" && !pulso) er.medida = "Escolha o tamanho pelo seu pulso.";
    if (!metal) er.metal = "Escolha o metal.";
    if (descricao.trim().length < MIN_DESCRICAO) er.descricao = "Descreva a peça em uma ou duas frases.";
    if (!nome.trim()) er.nome = "Escreva seu nome.";
    setErros(er);
    const primeiro = ORDEM.find((c) => er[c]);
    if (primeiro) {
      form.current?.querySelector<HTMLElement>(`[data-campo="${primeiro}"] :is(input, select, textarea)`)?.focus();
      return;
    }
    // Abre o WhatsApp da Renata com o pedido já escrito
    window.open(link, "_blank", "noopener");
    setEnviado(true);
  }

  function escolherTipo(id: TipoId) {
    setTipoId(id);
    setAro("");
    setAro2("");
    setPulso("");
    limpar("tipo");
    limpar("medida");
  }

  function anexar(e: React.ChangeEvent<HTMLInputElement>) {
    const novos = Array.from(e.target.files ?? [])
      .slice(0, MAX_FOTOS - fotos.length)
      .map((f) => ({ nome: f.name, url: URL.createObjectURL(f) }));
    setFotos((xs) => [...xs, ...novos]);
    e.target.value = "";
  }

  return (
    <>
    <section className={s.como} aria-labelledby="como-funciona">
      <div className={s.comoInterno}>
        <header className={s.comoCabeca}>
          <h1 id="como-funciona">Como funciona</h1>
          <p>Do primeiro contato à peça pronta, tudo é feito à mão pela Renata.</p>
        </header>
        <ol className={s.etapas}>
          {ETAPAS.map((e, i) => (
            <li key={e.titulo} className={s.etapa}>
              <span className={`${s.etapaNumero} numero`}>{i + 1}</span>
              <div className={s.etapaFoto}>
                <Image src={e.foto} alt={e.alt} fill sizes="(max-width: 700px) 40vw, 22vw" style={{ objectFit: "cover", objectPosition: e.foco }} />
              </div>
              <h2 className={s.etapaTitulo}>{e.titulo}</h2>
              <p className={s.etapaTexto}>{e.texto}</p>
            </li>
          ))}
        </ol>
        <a href="#formulario" className="botao botao--areia">
          Fazer minha encomenda
        </a>
      </div>
    </section>

    <section ref={tela} id="formulario" className={s.tela} data-sangra-rodape>
      <div className={s.fundo} aria-hidden>
        <div className={s.fundoFixo}>
          {FUNDO.map((src) => (
            <div key={src} className={s.fundoFoto}>
              <Image src={src} alt="" fill sizes="34vw" />
            </div>
          ))}
        </div>
      </div>

      <div ref={coluna} className={s.coluna} data-visivel={visivel || undefined}>
        {enviado ? (
          <div className={s.confirmacao}>
            <h2 ref={confirmacao} tabIndex={-1}>
              Pedido enviado, {nome.trim().split(" ")[0]}.
            </h2>
            <p>O orçamento é feito pelo WhatsApp. A Renata vai entrar em contato com você por lá.</p>
            {fotos.length > 0 && <p className={s.nota}>Mande suas fotos de referência na mesma conversa.</p>}
            <div className={s.acoes}>
              <a className="botao botao--areia" href={link} target="_blank" rel="noopener noreferrer">
                Abrir o WhatsApp
              </a>
              <button type="button" className={s.textoBotao} onClick={() => setEnviado(false)}>
                Voltar ao pedido
              </button>
            </div>
            <p className={s.nota}>
              WhatsApp da Renata:{" "}
              <a href={`https://wa.me/${WHATSAPP_RENATA}`} target="_blank" rel="noopener noreferrer" className="numero">
                {formatarWhatsapp(WHATSAPP_RENATA)}
              </a>
              <br />
              Instagram:{" "}
              <a href={LINK_INSTAGRAM} target="_blank" rel="noopener noreferrer">
                @{INSTAGRAM_RENATA}
              </a>
            </p>
          </div>
        ) : (
          <>
            <header className={s.cabeca}>
              <h2>Encomende a sua</h2>
              <p>Conte o que você imagina e a Renata cria a peça para você.</p>
            </header>

            <form ref={form} className={s.form} onSubmit={enviar} noValidate>
              <fieldset className={s.campo} data-campo="tipo">
                <legend>Tipo de peça</legend>
                {GRUPOS.map((g) => (
                  <div key={g.id} className={s.grupo}>
                    <span className={s.grupoNome}>{g.nome}</span>
                    <div className={s.opcoes}>
                      {TIPOS.filter((t) => t.grupo === g.id).map((t) => (
                        <label key={t.id} className={s.opcao}>
                          <input type="radio" name="tipo" checked={tipoId === t.id} onChange={() => escolherTipo(t.id)} />
                          <span>{t.nome}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                {erros.tipo && <p className={s.erro}>{erros.tipo}</p>}
                {referencia && (
                  <p className={s.nota}>
                    Inspirada em {referencia.nome}, Nº {referencia.numero}.{" "}
                    <button type="button" className={s.textoBotao} onClick={() => setReferencia(undefined)}>
                      Tirar
                    </button>
                  </p>
                )}
              </fieldset>

              {(tipo?.medida === "aro" || tipo?.medida === "par") && (
                <div className={`${s.campo} ${s.surge}`} data-campo="medida">
                  <div className={s.aros}>
                    <SeletorAro
                      id="aro"
                      rotulo={tipo.medida === "par" ? "Aro da primeira aliança" : "Seu aro"}
                      valor={aro}
                      onMudar={(v) => { setAro(v); limpar("medida"); }}
                      invalido={!!erros.medida && !aro}
                    />
                    {tipo.medida === "par" && (
                      <SeletorAro
                        id="aro2"
                        rotulo="Aro da segunda aliança"
                        valor={aro2}
                        onMudar={(v) => { setAro2(v); limpar("medida"); }}
                        invalido={!!erros.medida && !aro2}
                      />
                    )}
                  </div>
                  {erros.medida && <p className={s.erro}>{erros.medida}</p>}
                  <TabelaAros />
                </div>
              )}

              {tipo?.medida === "pulso" && (
                <fieldset className={`${s.campo} ${s.surge}`} data-campo="medida">
                  <legend>Tamanho pelo pulso</legend>
                  <div className={s.opcoes}>
                    {BRACELETES.map((b) => (
                      <label key={b.id} className={s.opcao}>
                        <input type="radio" name="pulso" checked={pulso === b.id} onChange={() => { setPulso(b.id); limpar("medida"); }} />
                        <span>
                          {b.nome} <small className="numero">{b.pulso}</small>
                        </span>
                      </label>
                    ))}
                  </div>
                  {erros.medida && <p className={s.erro}>{erros.medida}</p>}
                  <p className={s.nota}>Meça logo abaixo do osso do punho, sem apertar.</p>
                </fieldset>
              )}

              <fieldset className={s.campo} data-campo="metal">
                <legend>Metal</legend>
                <div className={s.opcoes}>
                  {METAIS.map((m) => (
                    <label key={m} className={s.opcao}>
                      <input type="radio" name="metal" checked={metal === m} onChange={() => { setMetal(m); limpar("metal"); }} />
                      <span>{m}</span>
                    </label>
                  ))}
                </div>
                {erros.metal && <p className={s.erro}>{erros.metal}</p>}
              </fieldset>

              <div className={s.campo} data-campo="descricao">
                <label htmlFor="descricao">Descrição</label>
                <textarea
                  id="descricao"
                  className={s.entrada}
                  rows={5}
                  value={descricao}
                  onChange={(e) => { setDescricao(e.target.value); limpar("descricao"); }}
                  placeholder={tipo?.dica ?? "Como você imagina a peça, para quem é, que símbolos têm significado para você…"}
                  aria-invalid={erros.descricao ? true : undefined}
                />
                {erros.descricao && <p className={s.erro}>{erros.descricao}</p>}
              </div>

              <div className={s.campo}>
                <span className={s.rotulo} id="rotulo-fotos">
                  Foto de referência (opcional)
                </span>
                <div className={s.fotos} aria-labelledby="rotulo-fotos">
                  {fotos.map((f, i) => (
                    <div key={f.url} className={s.foto}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.url} alt={`Referência ${i + 1}: ${f.nome}`} />
                      <button type="button" onClick={() => setFotos((xs) => xs.filter((x) => x.url !== f.url))}>
                        <X size={14} aria-hidden />
                        <span className="sr-only">Remover {f.nome}</span>
                      </button>
                    </div>
                  ))}
                  {fotos.length < MAX_FOTOS && (
                    <label className={s.anexar}>
                      <ImagePlus size={20} strokeWidth={1.4} aria-hidden />
                      <span>Adicionar</span>
                      <input type="file" accept="image/*" multiple onChange={anexar} className="sr-only" />
                    </label>
                  )}
                </div>
              </div>

              <div className={s.campo} data-campo="nome">
                <label htmlFor="nome-enc">Seu nome</label>
                <input
                  id="nome-enc"
                  className={s.entrada}
                  value={nome}
                  onChange={(e) => { setNome(e.target.value); limpar("nome"); }}
                  autoComplete="name"
                  aria-invalid={erros.nome ? true : undefined}
                />
                {erros.nome && <p className={s.erro}>{erros.nome}</p>}
              </div>

              <fieldset className={s.campo}>
                <legend>Foi indicação? (opcional)</legend>
                <div className={s.opcoes}>
                  {(["Sim", "Não"] as const).map((v) => (
                    <label key={v} className={s.opcao}>
                      <input type="radio" name="indicacao" checked={indicacao === v} onChange={() => setIndicacao(v)} />
                      <span>{v}</span>
                    </label>
                  ))}
                </div>
                {indicacao === "Sim" && (
                  <div className={`${s.seletor} ${s.surge}`}>
                    <label htmlFor="quem-indicou">Quem indicou?</label>
                    <input id="quem-indicou" className={s.entrada} value={quemIndicou} onChange={(e) => setQuemIndicou(e.target.value)} />
                  </div>
                )}
              </fieldset>

              <div className={s.enviar}>
                <button type="submit" className="botao botao--areia botao--largo">
                  Enviar pelo WhatsApp
                </button>
                <p>O orçamento é feito pelo WhatsApp da Renata.</p>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
    </>
  );
}

function SeletorAro({ id, rotulo, valor, onMudar, invalido }: { id: string; rotulo: string; valor: string; onMudar: (v: string) => void; invalido: boolean }) {
  return (
    <div className={s.seletor}>
      <label htmlFor={id}>{rotulo}</label>
      <select id={id} className={`${s.entrada} ${s.select}`} value={valor} onChange={(e) => onMudar(e.target.value)} aria-invalid={invalido || undefined}>
        <option value="" disabled>
          Escolha
        </option>
        {AROS.map((a) => (
          <option key={a.aro} value={a.aro}>
            Aro {a.aro} ({mm(a.circunferencia / 10)} cm)
          </option>
        ))}
      </select>
    </div>
  );
}

function TabelaAros() {
  return (
    <details className={s.tabelaAros}>
      <summary>Não sabe seu aro? Ver tabela</summary>
      <p className={s.nota}>
        Passe um barbante na base do dedo, marque onde ele se encontra e meça em cm. Ficou entre dois números? Escolha o maior.
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">Aro</th>
            <th scope="col">Volta do dedo</th>
            <th scope="col">Diâmetro</th>
          </tr>
        </thead>
        <tbody>
          {AROS.map((a) => (
            <tr key={a.aro}>
              <th scope="row" className="numero">
                {a.aro}
              </th>
              <td className="numero">{mm(a.circunferencia / 10)} cm</td>
              <td className="numero">{mm(Math.round(a.diametro * 10) / 10)} mm</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}

function textoMedida(medida: Medida | undefined, aro: string, aro2: string, pulso: string) {
  if (medida === "aro" && aro) return `aro ${aro}`;
  if (medida === "par" && aro && aro2) return `aros ${aro} e ${aro2}`;
  if (medida === "pulso" && pulso) return `${pulso} (pulso de ${BRACELETES.find((b) => b.id === pulso)?.pulso})`;
  return "";
}

function montarMensagem(p: {
  nome: string;
  tipo?: Tipo;
  medida: string;
  metal: Metal | null;
  descricao: string;
  fotos: number;
  referencia?: Peca;
  indicacao: string;
}) {
  const linhas: (string | false | undefined)[] = [
    `Olá, Renata! Meu nome é ${p.nome.trim()} e quero encomendar uma peça.`,
    "",
    `Peça: ${p.tipo?.nome ?? ""}`,
    p.medida ? `Medida: ${p.medida}` : false,
    `Metal: ${p.metal ?? ""}`,
    p.referencia && `Inspiração: ${p.referencia.nome}, Nº ${p.referencia.numero}`,
    p.indicacao ? `Foi indicação: ${p.indicacao}` : false,
    "",
    `Descrição: ${p.descricao.trim()}`,
    p.fotos > 0 && "",
    p.fotos > 0 && `Vou mandar ${p.fotos === 1 ? "1 foto" : `${p.fotos} fotos`} de referência aqui.`,
    "",
    "Pode me passar o orçamento?",
  ];
  return linhas.filter((l): l is string => typeof l === "string").join("\n");
}
