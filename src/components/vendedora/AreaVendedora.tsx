"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { CATEGORIAS, type Categoria } from "@/data/pecas";
import { useLoja } from "@/lib/store";
import { preco } from "@/lib/formato";
import { Pedidos } from "./Pedidos";
import { Caixa } from "./Caixa";
import s from "./AreaVendedora.module.css";

/**
 * Senha de DEMONSTRAÇÃO. Sem back-end, isto não protege nada de verdade:
 * só evita que clientes caiam aqui por acaso. Trocar por login real quando houver servidor.
 */
const SENHA = "renata";
const CHAVE_SESSAO = "rf-joias:vendedora";

/** Reduz a foto para caber no armazenamento do navegador (lado maior até 1400 px, JPEG). */
async function prepararFoto(arquivo: File): Promise<string> {
  const bitmap = await createImageBitmap(arquivo);
  const escala = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.82);
}

export function AreaVendedora() {
  const [liberada, setLiberada] = useState(false);
  const [verificado, setVerificado] = useState(false);

  useEffect(() => {
    try {
      setLiberada(window.sessionStorage.getItem(CHAVE_SESSAO) === "ok");
    } catch {
      /* sem sessionStorage: pede a senha */
    }
    setVerificado(true);
  }, []);

  if (!verificado) return null;
  return liberada ? <Painel onSair={() => setLiberada(false)} /> : <Entrada onEntrar={() => setLiberada(true)} />;
}

function Entrada({ onEntrar }: { onEntrar: () => void }) {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(false);

  function entrar(e: React.FormEvent) {
    e.preventDefault();
    if (senha.trim().toLowerCase() !== SENHA) return setErro(true);
    try {
      window.sessionStorage.setItem(CHAVE_SESSAO, "ok");
    } catch {}
    onEntrar();
  }

  return (
    <div className={`envoltorio ${s.entrada}`}>
      <form className={s.cartaoEntrada} onSubmit={entrar}>
        <h1>Área da vendedora</h1>
        <p>Digite a senha para ver os pedidos e cadastrar peças.</p>
        <div className="campo">
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            className="entrada"
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value);
              setErro(false);
            }}
            aria-invalid={erro || undefined}
            autoFocus
          />
          {erro && <p className="erro-campo">Senha incorreta.</p>}
        </div>
        <button type="submit" className="botao botao--largo">
          Entrar
        </button>
      </form>
    </div>
  );
}

const VAZIO = { nome: "", categoria: "" as Categoria | "", materiais: "", preco: "", medidas: "", descricao: "" };

function Painel({ onSair }: { onSair: () => void }) {
  const { adicionarPeca, removerPeca, minhasPublicadas, registro } = useLoja();
  const [campos, setCampos] = useState(VAZIO);
  const [foto, setFoto] = useState<string | null>(null);
  const [preparando, setPreparando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [publicada, setPublicada] = useState<string | null>(null);
  const inputFoto = useRef<HTMLInputElement>(null);

  function mudar(campo: keyof typeof VAZIO, valor: string) {
    setCampos((c) => ({ ...c, [campo]: valor }));
    setErro(null);
    setPublicada(null);
  }

  async function escolherFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    setPreparando(true);
    setErro(null);
    try {
      setFoto(await prepararFoto(arquivo));
    } catch {
      setErro("Não consegui abrir essa foto. Tente outra imagem (JPG ou PNG).");
    } finally {
      setPreparando(false);
    }
  }

  function publicar(e: React.FormEvent) {
    e.preventDefault();
    const valor = Number(campos.preco.replace(/\./g, "").replace(",", "."));
    if (!foto) return setErro("Escolha uma foto da peça.");
    if (!campos.nome.trim()) return setErro("Dê um nome para a peça.");
    if (!campos.categoria) return setErro("Escolha o tipo de peça.");
    if (!valor || valor <= 0) return setErro("Informe o valor da peça.");
    if (!campos.descricao.trim()) return setErro("Escreva uma descrição curta.");

    const res = adicionarPeca({
      nome: campos.nome.trim(),
      categoria: campos.categoria,
      materiais: campos.materiais
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean),
      preco: valor,
      medidas: campos.medidas.trim(),
      descricao: campos.descricao.trim(),
      foto,
    });
    if (!res.ok) return setErro("O armazenamento do navegador está cheio. Remova alguma peça antiga e tente de novo.");
    setPublicada(res.peca.numero);
    setCampos(VAZIO);
    setFoto(null);
    if (inputFoto.current) inputFoto.current.value = "";
  }

  function sair() {
    try {
      window.sessionStorage.removeItem(CHAVE_SESSAO);
    } catch {}
    onSair();
  }

  return (
    <div className={`envoltorio ${s.painel}`}>
      <header className={s.topo}>
        <h1>Área da vendedora</h1>
        <button type="button" className={s.sair} onClick={sair}>
          Sair
        </button>
      </header>

      <Pedidos />

      <h2 className={s.tituloSecao}>Nova peça</h2>
      <form className={s.form} onSubmit={publicar} noValidate>
        <label className={s.foto} data-vazia={!foto || undefined}>
          {foto ? (
            <Image src={foto} alt="Prévia da foto escolhida" fill sizes="(max-width: 800px) 100vw, 40vw" style={{ objectFit: "cover" }} />
          ) : (
            <span className={s.fotoVazia}>
              <ImagePlus size={28} strokeWidth={1.4} aria-hidden />
              {preparando ? "Preparando foto…" : "Toque para escolher a foto"}
            </span>
          )}
          <input ref={inputFoto} type="file" accept="image/*" onChange={escolherFoto} className="sr-only" />
          {foto && <span className={s.trocar}>Trocar foto</span>}
        </label>

        <div className={s.campos}>
          <div className="campo">
            <label htmlFor="nome">Nome da peça</label>
            <input id="nome" className="entrada" value={campos.nome} onChange={(e) => mudar("nome", e.target.value)} placeholder="Ex.: Brincos Laroyê" />
          </div>

          <div className={s.linha}>
            <div className="campo">
              <label htmlFor="categoria">Tipo</label>
              <select id="categoria" className="entrada" value={campos.categoria} onChange={(e) => mudar("categoria", e.target.value)}>
                <option value="">Escolha…</option>
                {CATEGORIAS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="campo">
              <label htmlFor="preco">Valor (R$)</label>
              <input id="preco" className="entrada" inputMode="decimal" value={campos.preco} onChange={(e) => mudar("preco", e.target.value)} placeholder="320,00" />
            </div>
          </div>

          <div className={s.linha}>
            <div className="campo">
              <label htmlFor="materiais">Materiais</label>
              <input id="materiais" className="entrada" value={campos.materiais} onChange={(e) => mudar("materiais", e.target.value)} placeholder="Latão, búzio" />
            </div>
            <div className="campo">
              <label htmlFor="medidas">Medidas (opcional)</label>
              <input id="medidas" className="entrada" value={campos.medidas} onChange={(e) => mudar("medidas", e.target.value)} placeholder="Aro 17" />
            </div>
          </div>

          <div className="campo">
            <label htmlFor="descricao">Descrição</label>
            <textarea id="descricao" className="entrada" rows={4} value={campos.descricao} onChange={(e) => mudar("descricao", e.target.value)} placeholder="Como a peça é, o que ela tem de especial." />
          </div>

          {erro && (
            <p className={s.erro} role="alert">
              {erro}
            </p>
          )}
          {publicada && (
            <p className={s.ok} role="status">
              Peça publicada na vitrine. <Link href={`/peca/${publicada}`}>Ver a peça</Link>
            </p>
          )}

          <button type="submit" className="botao botao--largo" disabled={preparando}>
            Publicar na vitrine
          </button>
        </div>
      </form>

      <section className={s.lista} aria-labelledby="titulo-publicadas">
        <h2 id="titulo-publicadas">Suas peças publicadas</h2>
        {minhasPublicadas.length === 0 ? (
          <p className={s.vazio}>Nenhuma peça cadastrada por aqui ainda.</p>
        ) : (
          <ul>
            {minhasPublicadas.map((p) => {
              const situacao = registro(p.numero).situacao;
              return (
                <li key={p.numero} className={s.item}>
                  <Link href={`/peca/${p.numero}`} className={s.itemFoto}>
                    <Image src={p.foto.src} alt="" fill sizes="64px" style={{ objectFit: "cover" }} />
                  </Link>
                  <div className={s.itemTexto}>
                    <p className={s.itemNome}>{p.nome}</p>
                    <p className={s.itemInfo}>
                      Nº {p.numero} · {preco(p.preco)} · {situacao === "vendida" ? "Vendida" : situacao === "reservada" ? "Reservada" : "Na vitrine"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={s.remover}
                    onClick={() => {
                      if (window.confirm(`Remover "${p.nome}" da vitrine?`)) removerPeca(p.numero);
                    }}
                  >
                    <Trash2 size={16} aria-hidden />
                    <span>Remover</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <Caixa />
    </div>
  );
}
