import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { JaTemDona, VitrineDoDia } from "@/components/home/VitrineDoDia";
import { Buzio } from "@/components/Marca";
import { Losango, Ornamento, Totem } from "@/components/home/Ornamentos";
import s from "@/components/home/Home.module.css";

export default function Home() {
  return (
    <>
      <section className={s.chegada} aria-labelledby="titulo-chegada">
        <figure className={s.chegadaFoto}>
          <Image
            src="/capa/capa-tiara-buzios-hd.jpg"
            alt="Mulher negra de cabelo crespo preso no alto, de olhos baixos, usando uma tiara de latão martelado com triângulos e búzios, diante de uma parede de barro"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 64vw"
            style={{ objectFit: "cover", objectPosition: "50% 22%" }}
          />
        </figure>
        <Totem className={s.chegadaTotem} />

        <div className={s.chegadaTexto}>
          <p className={s.chegadaSobretitulo}>Joalheria autoral</p>
          <Ornamento className={s.chegadaOrnamento} />
          <h1 id="titulo-chegada">
            Feitas à mão,
            <em>uma vez só</em>
          </h1>
          <Losango className={s.chegadaLosango} />
          <ul className={s.chegadaPilares} aria-label="Como são as peças">
            <li>
              <strong>Autorais</strong>
              <span>Desenho da Renata</span>
            </li>
            <li>
              <strong>Manuais</strong>
              <span>Marteladas na bancada</span>
            </li>
            <li>
              <strong>Únicas</strong>
              <span>Nenhuma se repete</span>
            </li>
          </ul>
          <div className={s.chegadaAcoes}>
            <a href="#hoje" className="botao botao--areia">
              Ver a vitrine de hoje <ArrowDown size={16} aria-hidden />
            </a>
            <Link href="/encomenda" className={s.chegadaLink}>
              Encomendar a sua peça
            </Link>
          </div>
        </div>
        {/* degradê: a capa clareia até a cor de fundo da página */}
        <div className={s.chegadaDegrade} aria-hidden />
      </section>

      <VitrineDoDia />

      <section className={s.funciona} aria-labelledby="titulo-funciona">
        <div className="envoltorio">
          <h2 id="titulo-funciona">Como funciona uma peça única</h2>
          <ol className={s.passos}>
            <li>
              <p className={s.passoEstado}>
                <Buzio size={12} /> Disponível
              </p>
              <p>Cada peça que sai da bancada da Renata ganha um número de registro e existe uma vez só.</p>
            </li>
            <li>
              <p className={s.passoEstado} data-estado="reservada">
                Reservada
              </p>
              <p>Na sua sacola, a peça fica guardada só para você enquanto finaliza a compra. Para as outras clientes, ela aparece como reservada.</p>
            </li>
            <li>
              <p className={s.passoEstado} data-estado="vendida">
                No acervo
              </p>
              <p>Com o pagamento confirmado, a peça ganha dona e entra no acervo. Se a reserva vencer antes, ela volta para a vitrine.</p>
            </li>
          </ol>
        </div>
      </section>

      <JaTemDona />

      <section className={s.encomenda} aria-labelledby="titulo-encomenda">
        <div className="faixa" aria-hidden />
        <div className={`envoltorio ${s.encomendaGrade}`}>
          <h2 id="titulo-encomenda">Nenhuma é a sua?</h2>
          <div>
            <p>
              Conte sua ideia, escolha os materiais e os símbolos, e a Renata cria uma peça única para você. Pode partir
              de uma peça do acervo ou de uma referência sua.
            </p>
            <Link href="/encomenda" className="botao botao--areia">
              Encomendar a sua peça
            </Link>
          </div>
        </div>
      </section>
      <section id="renata" className={`envoltorio ${s.renata}`} aria-labelledby="titulo-renata" data-sangra-rodape>
        <div className={s.renataFotos}>
          <figure className={s.renataPrincipal}>
            <Image
              src="/renata/renata-retrato.jpg"
              alt="Renata Ferré com a mão sobre o rosto, usando anéis e bracelete de latão com búzios e colar com búzio grande, todos feitos por ela"
              fill
              sizes="(max-width: 900px) 90vw, 40vw"
              style={{ objectFit: "cover", objectPosition: "55% 35%" }}
            />
          </figure>
          <figure className={s.renataBancada}>
            <div className={s.bancadaFoto}>
            <Image
              src="/pecas/anel-oya.jpg"
              alt="Anel de cobre gravado com a palavra OYA, no tribulet da bancada"
              fill
              sizes="(max-width: 900px) 45vw, 18vw"
              style={{ objectFit: "cover", objectPosition: "50% 45%" }}
            />
            </div>
            <figcaption>Anel Oyá na bancada, antes do acabamento.</figcaption>
          </figure>
        </div>
        <div className={s.renataTexto}>
          <h2 id="titulo-renata">Feitas à mão por Renata Ferré</h2>
          <p>
            Tudo começou com uma coroa. A Renata era professora e frequentava a Igreja de Nossa Senhora do Rosário dos
            Homens Pretos da Penha. Quando teve a coroação de rei e rainha, ela resolveu reformar a coroa com as próprias
            mãos, e ali descobriu um dom que virou profissão.
          </p>
          <p>
            Hoje ela faz tudo sozinha, na própria bancada: recorta, martela e monta cada peça em latão e cobre, com búzios,
            ráfia e fio de cobre. As marcas do martelo ficam à mostra, e nenhuma peça sai igual à outra.
          </p>
          <p>
            São joias pro dia a dia e também paramentas e ferramentas de orixás, com símbolos das raízes africanas e
            afro-brasileiras, como o búzio, o raio, o arco e flecha e a sankofa. Muita coisa é feita por encomenda: se você
            tem uma ideia, ela cria junto com você.
          </p>
          <figure className={s.renataUsando}>
            <Image
              src="/renata/renata-braceletes.jpg"
              alt="Renata Ferré usando braceletes largos de latão e cobre, com mãos de outras mulheres apoiadas em seus ombros"
              fill
              sizes="(max-width: 900px) 90vw, 30vw"
              style={{ objectFit: "cover", objectPosition: "50% 40%" }}
            />
          </figure>
        </div>
      </section>
    </>
  );
}
