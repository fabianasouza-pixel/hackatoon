"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { formatarWhatsapp, sairDaConta, salvarConta, useConta, type Conta } from "@/lib/conta";
import s from "./MinhaConta.module.css";

export function MinhaConta() {
  const conta = useConta();
  const [editando, setEditando] = useState(false);

  if (conta === undefined) return null; // ainda carregando no navegador

  return (
    <div className={`envoltorio ${s.pagina}`}>
      {conta && !editando ? (
        <Resumo conta={conta} onEditar={() => setEditando(true)} />
      ) : (
        <Formulario inicial={conta ?? undefined} onSalvo={() => setEditando(false)} onCancelar={conta ? () => setEditando(false) : undefined} />
      )}
    </div>
  );
}

function dataBR(iso: string) {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

function Resumo({ conta, onEditar }: { conta: Conta; onEditar: () => void }) {
  return (
    <section className={s.cartao} aria-labelledby="titulo-conta">
      <p className={s.sobretitulo}>Minha conta</p>
      <h1 id="titulo-conta">Olá, {conta.nome.split(" ")[0]}</h1>
      <dl className={s.dados}>
        <dt>Nome</dt>
        <dd>{conta.nome}</dd>
        <dt>WhatsApp</dt>
        <dd className="numero">{formatarWhatsapp(conta.whatsapp)}</dd>
        <dt>E-mail</dt>
        <dd>{conta.email}</dd>
        <dt>Nascimento</dt>
        <dd className="numero">{dataBR(conta.nascimento)}</dd>
        <dt>Indicação</dt>
        <dd>{conta.indicacao ? `Sim${conta.indicadaPor ? `, por ${conta.indicadaPor}` : ""}` : "Não"}</dd>
      </dl>
      <div className={s.acoes}>
        <Link href="/vitrine" className="botao">
          Ver a vitrine
        </Link>
        <button type="button" className="botao botao--contorno" onClick={onEditar}>
          Editar dados
        </button>
      </div>
      <button type="button" className={s.sair} onClick={sairDaConta}>
        Sair da conta
      </button>
    </section>
  );
}

type Campo = "nome" | "whatsapp" | "email" | "nascimento" | "indicacao" | "indicadaPor";
type Erros = Partial<Record<Campo, string>>;
const ORDEM: Campo[] = ["nome", "whatsapp", "email", "nascimento", "indicacao", "indicadaPor"];

function Formulario({ inicial, onSalvo, onCancelar }: { inicial?: Conta; onSalvo: () => void; onCancelar?: () => void }) {
  const [nome, setNome] = useState(inicial?.nome ?? "");
  const [whatsapp, setWhatsapp] = useState(inicial ? formatarWhatsapp(inicial.whatsapp) : "");
  const [email, setEmail] = useState(inicial?.email ?? "");
  const [nascimento, setNascimento] = useState(inicial?.nascimento ?? "");
  const [indicacao, setIndicacao] = useState<"sim" | "nao" | "">(inicial ? (inicial.indicacao ? "sim" : "nao") : "");
  const [indicadaPor, setIndicadaPor] = useState(inicial?.indicadaPor ?? "");
  const [erros, setErros] = useState<Erros>({});
  const [falhou, setFalhou] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const hoje = new Date().toISOString().slice(0, 10);

  function validar(): Erros {
    const e: Erros = {};
    if (nome.trim().split(/\s+/).length < 2) e.nome = "Escreva seu nome e sobrenome.";
    const digitos = whatsapp.replace(/\D/g, "");
    if (digitos.length < 10 || digitos.length > 11) e.whatsapp = "Informe o WhatsApp com DDD, ex.: (11) 98765-4321.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Confira o e-mail, ex.: nome@email.com.";
    if (!nascimento) e.nascimento = "Informe sua data de nascimento.";
    else if (nascimento > hoje || nascimento < "1900-01-01") e.nascimento = "Confira a data de nascimento.";
    if (!indicacao) e.indicacao = "Conte se você chegou por indicação.";
    if (indicacao === "sim" && !indicadaPor.trim()) e.indicadaPor = "Diga quem indicou.";
    return e;
  }

  function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validar();
    setErros(e);
    const primeiro = ORDEM.find((c) => e[c]);
    if (primeiro) {
      form.current?.querySelector<HTMLElement>(`[name="${primeiro}"]`)?.focus();
      return;
    }
    const ok = salvarConta({
      nome: nome.trim().replace(/\s+/g, " "),
      whatsapp: whatsapp.replace(/\D/g, ""),
      email: email.trim().toLowerCase(),
      nascimento,
      indicacao: indicacao === "sim",
      indicadaPor: indicacao === "sim" ? indicadaPor.trim() : undefined,
      criadaEm: inicial?.criadaEm ?? new Date().toISOString(),
    });
    if (!ok) return setFalhou(true);
    onSalvo();
  }

  // limpa o erro do campo assim que a cliente corrige
  const limpar = (c: Campo) => erros[c] && setErros((x) => ({ ...x, [c]: undefined }));

  return (
    <form ref={form} className={s.cartao} onSubmit={enviar} noValidate aria-labelledby="titulo-form">
      <p className={s.sobretitulo}>{inicial ? "Minha conta" : "Renata Ferré Jóias"}</p>
      <h1 id="titulo-form">{inicial ? "Editar dados" : "Criar conta"}</h1>
      {!inicial && <p className={s.lede}>Para a Renata saber quem é você e avisar quando entrar peça nova na vitrine.</p>}

      <div className="campo">
        <label htmlFor="nome">Nome completo</label>
        <input id="nome" name="nome" className="entrada" autoComplete="name" value={nome} onChange={(e) => (setNome(e.target.value), limpar("nome"))} aria-invalid={!!erros.nome || undefined} aria-describedby={erros.nome ? "erro-nome" : undefined} />
        {erros.nome && <p id="erro-nome" className="erro-campo">{erros.nome}</p>}
      </div>

      <div className={s.duas}>
        <div className="campo">
          <label htmlFor="whatsapp">WhatsApp</label>
          <input id="whatsapp" name="whatsapp" className="entrada" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="(11) 98765-4321" value={whatsapp} onChange={(e) => (setWhatsapp(formatarWhatsapp(e.target.value)), limpar("whatsapp"))} aria-invalid={!!erros.whatsapp || undefined} aria-describedby={erros.whatsapp ? "erro-whatsapp" : undefined} />
          {erros.whatsapp && <p id="erro-whatsapp" className="erro-campo">{erros.whatsapp}</p>}
        </div>
        <div className="campo">
          <label htmlFor="nascimento">Data de nascimento</label>
          <input id="nascimento" name="nascimento" className="entrada" type="date" autoComplete="bday" min="1900-01-01" max={hoje} value={nascimento} onChange={(e) => (setNascimento(e.target.value), limpar("nascimento"))} aria-invalid={!!erros.nascimento || undefined} aria-describedby={erros.nascimento ? "erro-nascimento" : undefined} />
          {erros.nascimento && <p id="erro-nascimento" className="erro-campo">{erros.nascimento}</p>}
        </div>
      </div>

      <div className="campo">
        <label htmlFor="email">E-mail</label>
        <input id="email" name="email" className="entrada" type="email" autoComplete="email" placeholder="nome@email.com" value={email} onChange={(e) => (setEmail(e.target.value), limpar("email"))} aria-invalid={!!erros.email || undefined} aria-describedby={erros.email ? "erro-email" : undefined} />
        {erros.email && <p id="erro-email" className="erro-campo">{erros.email}</p>}
      </div>

      <fieldset className={s.grupo} aria-describedby={erros.indicacao ? "erro-indicacao" : undefined}>
        <legend className="rotulo">Você chegou por indicação?</legend>
        <div className={s.opcoes}>
          {(["sim", "nao"] as const).map((v) => (
            <label key={v} className={s.opcao}>
              <input type="radio" name="indicacao" value={v} checked={indicacao === v} onChange={() => (setIndicacao(v), limpar("indicacao"))} />
              <span>{v === "sim" ? "Sim" : "Não"}</span>
            </label>
          ))}
        </div>
        {erros.indicacao && <p id="erro-indicacao" className="erro-campo">{erros.indicacao}</p>}
      </fieldset>

      {indicacao === "sim" && (
        <div className="campo">
          <label htmlFor="indicadaPor">Quem indicou?</label>
          <input id="indicadaPor" name="indicadaPor" className="entrada" placeholder="Nome de quem indicou" value={indicadaPor} onChange={(e) => (setIndicadaPor(e.target.value), limpar("indicadaPor"))} aria-invalid={!!erros.indicadaPor || undefined} aria-describedby={erros.indicadaPor ? "erro-indicadaPor" : undefined} />
          {erros.indicadaPor && <p id="erro-indicadaPor" className="erro-campo">{erros.indicadaPor}</p>}
        </div>
      )}

      {falhou && (
        <p className={s.falha} role="alert">
          Não consegui salvar neste navegador (modo anônimo ou armazenamento bloqueado). Tente em uma janela normal.
        </p>
      )}

      <button type="submit" className="botao botao--largo">
        {inicial ? "Salvar alterações" : "Criar conta"}
      </button>
      {onCancelar && (
        <button type="button" className={s.sair} onClick={onCancelar}>
          Cancelar
        </button>
      )}
    </form>
  );
}
