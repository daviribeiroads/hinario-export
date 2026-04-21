import { useState, useMemo } from "react";
import { hinos, categorias } from "./data/hinos";
import { cdjovem } from "./data/cdjovem";
import "./App.css";

function normalize(str) {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

const categoryColors = {
  Adoração: "#8B5CF6",
  Salvação: "#EF4444",
  "Vida Cristã": "#10B981",
  Oração: "#3B82F6",
  Confiança: "#F59E0B",
  Consagração: "#EC4899",
  Esperança: "#6366F1",
  Missão: "#14B8A6",
  Sábado: "#84CC16",
  Infantil: "#F97316",
  Litúrgico: "#A78BFA",
  Batismo: "#06B6D4",
  "Santa Ceia": "#F43F5E",
  Igreja: "#8B5CF6",
  Profecia: "#D946EF",
  Doutrinas: "#7C3AED",
  Lei: "#B45309",
  Criação: "#16A34A",
  "Escola Sabatina": "#0EA5E9",
  Salmos: "#C026D3",
  Alegria: "#FBBF24",
  Tribulação: "#6B7280",
  Mordomia: "#059669",
  Saúde: "#10B981",
  Família: "#F472B6",
  Jovens: "#34D399",
  Bíblia: "#60A5FA",
  "Espírito Santo": "#7DD3FC",
  Santidade: "#A78BFA",
  Ressurreição: "#FCD34D",
  Paz: "#5EEAD4",
  Natal: "#FB7185",
  Gratidão: "#FDE68A",
  Serviço: "#67E8F9",
  Herança: "#D4B483",
  Unidade: "#86EFAC",
  Amor: "#F9A8D4",
  Encerramento: "#94A3B8",
  Especiais: "#E2E8F0",
};

const CD_JOVEM_COR = "#F59E0B";

function getCor(cat) {
  return categoryColors[cat] || "#5082c7";
}

// Pega todos os anos únicos do CD Jovem e ordena
const anosCD = [...new Set(cdjovem.map((m) => m.ano))].sort();

export default function App() {
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");
  const [hinoSelecionado, setHinoSelecionado] = useState(null);

  // Novo: controla se estamos no modo CD Jovem
  const [modoCDJovem, setModoCDJovem] = useState(false);
  const [anoAtivo, setAnoAtivo] = useState(null);

  // Filtro dos hinos normais
  const hinosFiltrados = useMemo(() => {
    if (modoCDJovem) return [];
    const termNorm = normalize(busca);

    return hinos.filter((h) => {
      const categoriaHino = normalize(h.categoria);
      const categoriaFiltro = normalize(categoriaAtiva);
      const matchCategoria =
        categoriaAtiva === "Todas" || categoriaHino === categoriaFiltro;

      if (!termNorm) return matchCategoria;

      const numeroFormatado = String(h.numero).padStart(3, "0");
      const matchBusca =
        numeroFormatado.includes(termNorm) ||
        String(h.numero).includes(termNorm) ||
        normalize(h.titulo).includes(termNorm) ||
        categoriaHino.includes(termNorm);

      return matchCategoria && matchBusca;
    });
  }, [busca, categoriaAtiva, modoCDJovem]);

  // Filtro das músicas do CD Jovem
  const musicasCDFiltradas = useMemo(() => {
    if (!modoCDJovem) return [];

    const termNorm = normalize(busca);

    return cdjovem.filter((m) => {
      const matchAno = !anoAtivo || m.ano === anoAtivo;
      const matchBusca = !termNorm || normalize(m.titulo).includes(termNorm);
      return matchAno && matchBusca;
    });
  }, [modoCDJovem, anoAtivo, busca]);

  function abrirVideo(item) {
    if (!item.youtube) {
      alert("Este item ainda não tem vídeo cadastrado.");
      return;
    }
    const url = `https://www.youtube.com/watch?v=${item.youtube}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function entrarModoCDJovem() {
    setModoCDJovem(true);
    setAnoAtivo(null);
    setBusca("");
    setHinoSelecionado(null);
  }

  function sairModoCDJovem() {
    setModoCDJovem(false);
    setAnoAtivo(null);
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo-area">
            <div className="logo-icon">H</div>
            <div>
              <h1>Hinário Adventista</h1>
              <p>Novo Hinário · 600 Hinos</p>
              <p>
                <a
                  class="suporte"
                  href="https://wa.me/5579991053399"
                  target="_blank"
                >
                  <i class="fa-brands fa-whatsapp"></i> Suporte
                </a>
              </p>
            </div>
          </div>

          <div className="informativo-link">
            <a
              href="https://www.youtube.com/@daniellocutor/videos"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h1>Informativo</h1>
            </a>
          </div>

          <div className="informativo-link">
            <a
              href="https://www.youtube.com/@provaievedeoficial/videos"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h1>Provai e Vede</h1>
            </a>
          </div>

          <div className="informativo-link">
            <a
              href="https://www.youtube.com/@adoracao_infantil/videos"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h1>Adoração infantil</h1>
            </a>
          </div>

          <div className="header-badge">
            {modoCDJovem
              ? musicasCDFiltradas.length + " músicas"
              : hinosFiltrados.length + " hinos"}
          </div>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          {/* Barra de busca — só aparece no modo hinos */}
          <div className="search-box">
            <span className="search-ico">🔍</span>
            <input
              type="text"
              placeholder={
                modoCDJovem ? "Nome da música..." : "Número, nome ou palavra..."
              }
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            {busca && (
              <button className="clear-btn" onClick={() => setBusca("")}>
                ✕
              </button>
            )}
          </div>

          <div className="cats">
            <p className="cats-label">
              {modoCDJovem ? "CD Jovem / Fundo musical" : "Categoria"}
            </p>

            {modoCDJovem ? (
              // MODO CD JOVEM: mostra anos + botão voltar
              <div className="cats-grid">
                <button
                  className="cat-tag"
                  style={{ borderColor: "#ffffff40", color: "#fff" }}
                  onClick={sairModoCDJovem}
                >
                  ← Voltar
                </button>

                <button
                  className={`cat-tag ${anoAtivo === null ? "cat-active" : ""}`}
                  style={
                    anoAtivo === null
                      ? {
                          background: CD_JOVEM_COR,
                          borderColor: CD_JOVEM_COR,
                          color: "#fff",
                        }
                      : {
                          borderColor: CD_JOVEM_COR + "60",
                          color: CD_JOVEM_COR,
                        }
                  }
                  onClick={() => setAnoAtivo(null)}
                >
                  Todos
                </button>

                {anosCD.map((ano) => (
                  <button
                    key={ano}
                    className={`cat-tag ${anoAtivo === ano ? "cat-active" : ""}`}
                    style={
                      anoAtivo === ano
                        ? {
                            background: CD_JOVEM_COR,
                            borderColor: CD_JOVEM_COR,
                            color: "#fff",
                          }
                        : {
                            borderColor: CD_JOVEM_COR + "60",
                            color: CD_JOVEM_COR,
                          }
                    }
                    onClick={() => setAnoAtivo(ano)}
                  >
                    {ano}
                  </button>
                ))}
              </div>
            ) : (
              // MODO HINOS: mostra categorias normais + botão CD Jovem
              <div className="cats-grid">
                <button
                  className="cat-tag"
                  style={{
                    borderColor: CD_JOVEM_COR + "60",
                    color: CD_JOVEM_COR,
                  }}
                  onClick={entrarModoCDJovem}
                >
                  🎶 CD Jovem
                </button>

                <button
                  className={`cat-tag ${categoriaAtiva === "Todas" ? "cat-active" : ""}`}
                  onClick={() => setCategoriaAtiva("Todas")}
                >
                  Todas
                </button>

                {categorias.map((cat) => (
                  <button
                    key={cat}
                    className={`cat-tag ${categoriaAtiva === cat ? "cat-active" : ""}`}
                    style={
                      categoriaAtiva === cat
                        ? {
                            background: getCor(cat),
                            borderColor: getCor(cat),
                            color: "#fff",
                          }
                        : {
                            borderColor: getCor(cat) + "60",
                            color: getCor(cat),
                          }
                    }
                    onClick={() => setCategoriaAtiva(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        <main className="lista-area">
          {modoCDJovem ? (
            // LISTA DO CD JOVEM
            musicasCDFiltradas.length === 0 ? (
              <div className="empty">
                <span>🎵</span>
                <p>Nenhuma música encontrada.</p>
              </div>
            ) : (
              <div className="hinos-list">
                {musicasCDFiltradas.map((musica, index) => (
                  <div
                    key={index}
                    className={`hino-row ${hinoSelecionado?.titulo === musica.titulo ? "hino-selected" : ""}`}
                    onClick={() => setHinoSelecionado(musica)}
                  >
                    <div
                      className="hino-num"
                      style={{
                        background: CD_JOVEM_COR + "22",
                        color: CD_JOVEM_COR,
                      }}
                    >
                      {musica.ano}
                    </div>

                    <div className="hino-info">
                      <span className="hino-titulo">{musica.titulo}</span>
                      {musica.artista && (
                        <span
                          className="hino-cat"
                          style={{ color: CD_JOVEM_COR }}
                        >
                          {musica.artista}
                        </span>
                      )}
                    </div>

                    <span className="hino-arrow">›</span>
                  </div>
                ))}
              </div>
            )
          ) : // LISTA DOS HINOS NORMAIS
          hinosFiltrados.length === 0 ? (
            <div className="empty">
              <span>🎵</span>
              <p>
                Nenhum hino encontrado para "<strong>{busca}</strong>"
              </p>
              {busca && (
                <p
                  style={{
                    fontSize: "0.85rem",
                    opacity: 0.6,
                    marginTop: "0.5rem",
                  }}
                >
                  Limpe a pesquisa para filtrar por categoria.
                </p>
              )}
            </div>
          ) : (
            <div className="hinos-list">
              {hinosFiltrados.map((hino) => (
                <div
                  key={hino.numero}
                  className={`hino-row ${hinoSelecionado?.numero === hino.numero ? "hino-selected" : ""}`}
                  onClick={() => setHinoSelecionado(hino)}
                >
                  <div
                    className="hino-num"
                    style={{
                      background: getCor(hino.categoria) + "22",
                      color: getCor(hino.categoria),
                    }}
                  >
                    {String(hino.numero).padStart(3, "0")}
                  </div>

                  <div className="hino-info">
                    <span className="hino-titulo">{hino.titulo}</span>
                    <span
                      className="hino-cat"
                      style={{ color: getCor(hino.categoria) }}
                    >
                      {hino.categoria}
                    </span>
                  </div>

                  <span className="hino-arrow">›</span>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* PAINEL DE PREVIEW — funciona para hinos e CD Jovem */}
        {hinoSelecionado && (
          <aside className="preview">
            <button
              className="preview-close"
              onClick={() => setHinoSelecionado(null)}
            >
              ✕
            </button>

            <div
              className="preview-num"
              style={{
                color: modoCDJovem
                  ? CD_JOVEM_COR
                  : getCor(hinoSelecionado.categoria),
              }}
            >
              {modoCDJovem
                ? `CD Jovem ${hinoSelecionado.ano}`
                : `Hino ${String(hinoSelecionado.numero).padStart(3, "0")}`}
            </div>

            <h2 className="preview-titulo">{hinoSelecionado.titulo}</h2>

            {!modoCDJovem && (
              <span
                className="preview-cat-badge"
                style={{
                  background: getCor(hinoSelecionado.categoria) + "20",
                  color: getCor(hinoSelecionado.categoria),
                  border: `1px solid ${getCor(hinoSelecionado.categoria)}50`,
                }}
              >
                {hinoSelecionado.categoria}
              </span>
            )}

            {modoCDJovem && hinoSelecionado.artista && (
              <span
                className="preview-cat-badge"
                style={{
                  background: CD_JOVEM_COR + "20",
                  color: CD_JOVEM_COR,
                  border: `1px solid ${CD_JOVEM_COR}50`,
                }}
              >
                {hinoSelecionado.artista}
              </span>
            )}

            <div className="preview-sep" />

            <p className="preview-desc">
              {modoCDJovem
                ? "Clique no botão para assistir esta música no YouTube."
                : "Clique no botão para assistir este hino no YouTube."}
            </p>

            <button
              className="play-btn"
              onClick={() => abrirVideo(hinoSelecionado)}
              style={{
                background: modoCDJovem
                  ? CD_JOVEM_COR
                  : getCor(hinoSelecionado.categoria),
              }}
            >
              ▶ {modoCDJovem ? "Assistir Música" : "Assistir Hino"}
            </button>

            <p className="preview-hint">O vídeo abrirá em uma nova guia</p>
          </aside>
        )}
      </div>
    </div>
  );
}
