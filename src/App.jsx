
import React, { useEffect, useRef, useState } from 'react';
import { supabase } from './lib/supabaseClient';

console.log('URL', import.meta.env.VITE_SUPABASE_URL);
console.log('KEY', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'ok' : 'faltando');



// === DADOS E CONFIGURAÇÕES DO PROJETO (ALTAMENTE CONFIGURÁVEL) ===

// TODO: SUBSTITUA o link do WhatsApp (mantenha a codificação da mensagem)

const WHATSAPP_LINK_BASE = "https://api.whatsapp.com/send?phone=5519982105888&text=Oi%2C%20quero%20saber%20mais%20sobre%20o%20curso%20de%20Terapias%20Injet%C3%A1veis%20em%20SP%20(04-05%2F12).";

// TODO: Configure os parâmetros UTM para rastreamento de anúncios
//const UTM_PARAMS = "?utm_source=instagram&utm_medium=cpc&utm_campaign=imersao-hof-2025&utm_content=stories-reels-mobile";
//const WHATSAPP_LINK = WHATSAPP_LINK_BASE + UTM_PARAMS;
const WHATSAPP_LINK = WHATSAPP_LINK_BASE
// TODO: Link da Política de Privacidade (placeholder)
const PRIVACY_POLICY_LINK = "#politica-de-privacidade"; 

const projectData = {
  title: "Imersão Terapias Injetáveis para HOF – 04 e 05/12 (São Paulo)",
  subtitle: "Para cirurgiões-dentistas, médicos e biomédicos que querem potencializar resultados na harmonização facial.",
  heroSubheadline: "Eleve os resultados da harmonização facial, use protocolos injetáveis com segurança, prática guiada e aplicação imediata na clínica.",
  value: "R$ 1.700 em até 10x",
  enrollment: "matrícula R$ 260",
  dateLabel: "04-05/12",
  agenda: "São Paulo – 04 e 05/12 • 9h às 18h",
    instructors: [
    { name: "Dra. Paola Baldo", cro: "CROSP 88555", photo: "/instrutoras/paola.jpg", instagram: "https://www.instagram.com/dra.paolabaldo" },
    { name: "Dra. Grace Isnardi", cro: "CRO 84169", photo: "/instrutoras/grace.jpg", instagram: "https://www.instagram.com/dra.graceisnardi/" },
  ],
  

  differentials: [
    "Protocolos seguros e integrativos aplicados à HOF",
    "Prática guiada + materiais de suporte",
    "Turma reduzida • Certificado",
    "Suporte pré e pós-curso",
  ],
  learnings: [
    "Seleção de terapias injetáveis de suporte (indicações/contraindicações)",
    "Protocolo pré e pós-procedimento para otimizar cicatrização e resultado",
    "Combinações seguras com técnicas de HOF",
    "Manejo de intercorrências e checklist de biossegurança",
    "Documentação e padronização de protocolos",
  ],
  faq: [
    { q: "Emite certificado?", a: "Sim." },
    { q: "Parcelamento?", a: "Sim, até 10x." },
    { q: "Como reservo?", a: "Fale com a equipe no WhatsApp." },
  ],
  testimonialPlaceholders: [
    "\"Melhor curso de Terapias Injetáveis que já fiz! Conteúdo prático e aplicável. As Dras. Paola e Grace são incríveis.\"",
    "\"A atenção pós-curso é o grande diferencial. Protocolos que realmente funcionam e me deram mais segurança na prática clínica.\"",
    "\"Turma reduzida foi essencial para a prática. Saí da imersão com total domínio das técnicas integrativas.\"",
  ],
  legalNotice: "Curso para profissionais habilitados (dentistas, médicos e biomédicos). Emissão de certificado. Sujeito a vagas.",
};

// Galeria: troque a extensão se não for .jpg
const galleryImages = [
  "/galeria/Foto1.jpg",
  "/galeria/Foto2.jpg",
  "/galeria/Foto3.jpg",
  "/galeria/Foto4.jpg",
  "/galeria/Foto5.jpg",
  "/galeria/Foto6.jpg",
  "/galeria/Foto7.jpg",
];



// --- Funções de Rastreamento (Pixel/GTM) ---

const trackConversion = (ctaName) => {
  // Dispara o evento de conversão para o Google Tag Manager (GTM)
  // TODO: Certifique-se de que o GTM/dataLayer esteja configurado no seu index.html
  if (window.dataLayer) {
    window.dataLayer.push({
      event: "wa_cta_click",
      cta_name: ctaName,
    });
  }
  // Log para depuração no console
  console.log(`cta_whatsapp: ${ctaName}`);
};

// --- Componentes Reutilizáveis (Para manter o código limpo) ---

const CTAButton = ({ text, style = {}, ctaName, variation = 1, children, ...props }) => {
  const isPrimary = variation === 1;
  const finalStyle = {
    ...styles.ctaButton,
    ...(isPrimary ? styles.ctaPrimary : styles.ctaSecondary),
    ...style
  };

  const href = props.href;
  const isWhatsApp = /(?:wa\.me|api\.whatsapp\.com|whatsapp:\/\/)/i.test(href);

  // WhatsApp abre na mesma aba; outros continuam em nova aba
  const target = isWhatsApp ? "_self" : "_blank";
  const rel = isWhatsApp ? undefined : "noopener noreferrer";

  const handleClick = () => {
    // não bloquear a navegação
    trackConversion(ctaName);
    try { setTimeout(() => { logClick(ctaName || "cta_sem_nome", href); }, 0); } catch { /* empty */ }
  };

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      style={finalStyle}
      onClick={handleClick}
      aria-label={text}
      {...props}
    >
      {children ?? text}
    </a>
  );
};


const Section = ({ id, title, children, style = {} }) => (
  <section id={id} style={{ ...styles.section, ...style }}>
    <div style={styles.container}>
      {title && <h2 style={styles.sectionTitle}>{title}</h2>}
      {children}
    </div>
  </section>
);


const IconCheck = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M20 6L9 17L4 12"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zM18 6.2a1 1 0 1 1-1 1 1 1 0 0 1 1-1z"/>
  </svg>
);





// Carrossel automático, pausa no hover e no toque
const AutoCarousel = ({ images, height = 160, gap = 12, speedSeconds = 40 }) => {
  // injeta CSS só uma vez
  useEffect(() => {
    if (document.getElementById("carousel-css")) return;
    const styleEl = document.createElement("style");
    styleEl.id = "carousel-css";
    styleEl.innerHTML = `
      @keyframes scrollLoop {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .carousel-viewport {
        overflow: hidden;
        width: 100%;
        mask-image: linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%);
        -webkit-mask-image: linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%);
      }
      .carousel-track {
        display: flex;
        width: max-content;
        will-change: transform;
        animation: scrollLoop var(--speed) linear infinite;
        gap: var(--gap);
      }
      .carousel-viewport:hover .carousel-track,
      .carousel-viewport:active .carousel-track {
        animation-play-state: paused;
      }
      @media (min-width: 600px) {
        .carousel-item { height: 220px; width: 392px; } /* 16:9 */
      }
    `;
    document.head.appendChild(styleEl);
  }, []);

  const itemStyle = {
    height: `${height}px`,
    width: `${Math.round((height * 16) / 9)}px`,
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 6px 16px rgba(0,0,0,.3)",
    flex: "0 0 auto",
  };

  return (
    <div
      className="carousel-viewport"
      style={{ "--gap": `${gap}px`, "--speed": `${speedSeconds}s` }}
    >
      <div className="carousel-track">
        {[...images, ...images].map((src, i) => (
          <div key={i} className="carousel-item" style={itemStyle}>
            <img
              src={src}
              alt="Momentos das turmas"
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

function getUTM() {
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get('utm_source'),
    utm_medium: p.get('utm_medium'),
    utm_campaign: p.get('utm_campaign'),
    utm_content: p.get('utm_content'),
    utm_term: p.get('utm_term'),
  };
}

async function logView() {
  const payload = {
    path: window.location.pathname + window.location.search,
    referrer: document.referrer || null,
    user_agent: navigator.userAgent.slice(0, 500),
    ...getUTM(),
  };
  await supabase.from('lp_page_views').insert(payload);
}

async function logClick(ctaName, href) {
  const payload = {
    cta_name: ctaName,
    href,
    path: window.location.pathname + window.location.search,
    referrer: document.referrer || null,
    user_agent: navigator.userAgent.slice(0, 500),
    ...getUTM(),
  };
  await supabase.from('lp_clicks').insert(payload);
}

// Countdown para o evento
function Countdown({ target = "2025-12-04T09:00:00-03:00" }) {
  const [left, setLeft] = useState(() => new Date(target).getTime() - Date.now());

  useEffect(() => {
    const id = setInterval(() => setLeft(new Date(target).getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (left <= 0) return null;

  const total = Math.max(0, left);
  const d = Math.floor(total / 86400000);
  const h = Math.floor((total % 86400000) / 3600000);
  const m = Math.floor((total % 3600000) / 60000);
  const s = Math.floor((total % 60000) / 1000);

  return (
    <div style={styles.countdownBox} aria-label="Contagem regressiva">
      <span style={styles.countdownDot} />
      Faltam {d}d {String(h).padStart(2,'0')}:{String(m).padStart(2,'0')}:{String(s).padStart(2,'0')} para o início
    </div>
  );
}


// --- Componente Principal da Landing Page ---

function App() {
  // Efeito para injetar Meta Tags e JSON-LD no Head
  useEffect(() => {
    const metaTags = [
      // SEO/Desempenho: Meta Description
      { name: "description", content: projectData.heroSubheadline.substring(0, 160) },
      // Open Graph/Twitter Cards
      { property: "og:title", content: projectData.title },
      { property: "og:description", content: projectData.heroSubheadline },
      // TODO: Substitua pelo URL da imagem otimizada para anúncios (9:16)
      { property: "og:image", content: "https://via.placeholder.com/600x1080?text=Imersao+PaolaGrace" }, 
      { property: "og:url", content: window.location.href },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: projectData.title },
      { name: "twitter:description", content: projectData.heroSubheadline },
      // TODO: Substitua pelo URL da imagem otimizada para anúncios (9:16)
      { name: "twitter:image", content: "https://via.placeholder.com/600x1080?text=Imersao+PaolaGrace" },
    ];

    metaTags.forEach(tagData => {
      const tag = document.createElement('meta');
      Object.entries(tagData).forEach(([key, value]) => tag.setAttribute(key, value));
      document.head.appendChild(tag);
    });

    // Título da página
    document.title = projectData.title;

    // Canonical URL (ajusta se tiver domínios diferentes)
    const canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', window.location.href.split('?')[0]);
    document.head.appendChild(canonical);

    // JSON-LD (Schema.org/Event)
    const eventSchema = {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": projectData.title,
      "startDate": "2025-12-04T09:00:00-03:00",
      "endDate": "2025-12-05T18:00:00-03:00",
      "location": {
        "@type": "Place",
        "name": "São Paulo",
        // TODO: Substitua pelo endereço completo (para melhor SEO local)
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Rua Exemplo, 123", 
          "addressLocality": "São Paulo",
          "addressRegion": "SP",
          "addressCountry": "BR"
        }
      },
      "image": "https://via.placeholder.com/600x1080?text=Imersao+PaolaGrace", // Reuso da imagem OG
      "description": projectData.heroSubheadline,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "organizer": {
        "@type": "Person",
        "name": "Dra. Paola Baldo",
        "url": WHATSAPP_LINK
      },
      "offers": {
        "@type": "Offer",
        "price": "1700.00",
        "priceCurrency": "BRL",
        "availability": "https://schema.org/InStock",
        "url": WHATSAPP_LINK
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(eventSchema);
    document.head.appendChild(script);

    // Favicon (Genérico)
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💉</text></svg>';
    document.head.appendChild(favicon);

  }, []);

  useEffect(() => {
  // evita duplicar no mesmo carregamento
  if (!window.__loggedView) {
    window.__loggedView = true;
    logView().catch(() => {});
  }
}, []);


  // Controle do vídeo e da película
const videoRef = useRef(null);
const [showOverlay, setShowOverlay] = useState(true);
const [showControls, setShowControls] = useState(false);

useEffect(() => {
  const v = videoRef.current;
  if (!v) return;

  // garante atributos e propriedades desde o início
  v.muted = true;
  v.defaultMuted = true;
  v.playsInline = true;

  const tryPlay = () => v.play().catch(() => {});

  // tenta assim que houver dados suficientes
  if (v.readyState >= 2) {
    tryPlay();
  } else {
    const onLoadedMeta = () => tryPlay();
    v.addEventListener('loadedmetadata', onLoadedMeta, { once: true });
    // limpeza
    return () => v.removeEventListener('loadedmetadata', onLoadedMeta);
  }

  // primeira interação do usuário em qualquer lugar da página, força o play se ainda estiver pausado
  const onFirstGesture = () => {
    if (v.paused) tryPlay();
    document.removeEventListener('touchstart', onFirstGesture);
    document.removeEventListener('click', onFirstGesture);
  };
  document.addEventListener('touchstart', onFirstGesture, { once: true });
  document.addEventListener('click', onFirstGesture, { once: true });

  // quando voltar de outra aba
  const onVisibility = () => {
    if (!document.hidden && v.paused) tryPlay();
  };
  document.addEventListener('visibilitychange', onVisibility);

  return () => {
    document.removeEventListener('touchstart', onFirstGesture);
    document.removeEventListener('click', onFirstGesture);
    document.removeEventListener('visibilitychange', onVisibility);
  };
}, []);



const handleUnmuteAndRestart = () => {
  const v = videoRef.current;
  if (!v) return;
  try { v.pause(); } catch { /* empty */ }
  try { v.currentTime = 0; } catch { /* empty */ }
  v.muted = false;
  setShowControls(true);
  setShowOverlay(false);
  v.play().catch(() => {});
};


  return (
    <div style={{ ...styles.body, overflowX: 'hidden' }}>

      {/* 1. Header Fixo */}
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          {/* TODO: Substitua pelo seu logo/nome do projeto (Ex: PaolaGrace) */}
          
          <CTAButton
            text="Falar no WhatsApp"
            href={WHATSAPP_LINK}
            ctaName="header_fixo"
            style={styles.headerCta}
          />
        </div>
      </header>

      <main style={{ paddingTop: '14px' }}>
        

        {/* 2. Seção Hero */}
        <Section id="hero" style={styles.heroSection}>
          <div style={styles.heroContent}>
  <span style={styles.dateBadge}>{projectData.dateLabel}</span>
  <h1 style={styles.heroTitle}>{projectData.title}</h1>
  <p style={styles.heroSubtitle}>{projectData.heroSubheadline}</p>

  <Countdown />

  {/* Selos de valor logo acima do CTA */}
  <div style={styles.badgesRow}>
    <div style={styles.badge}>Prática guiada</div>
    <div style={styles.badge}>Suporte pós curso</div>
    <div style={styles.badge}>Certificado</div>
  </div>

  {/* CTA vem antes do vídeo para converter no topo */}
  <CTAButton
    text="Falar com a equipe agora no WhatsApp"
    href={WHATSAPP_LINK}
    ctaName="hero_principal_top"
    variation={2}
    style={styles.ctaHero}
  />

  {/* Vídeo do herói */}
  <div style={{
    marginTop: '12px',
    marginBottom: '28px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 8px 20px rgba(0,0,0,.25)',
    border: '1px solid rgba(255,255,255,.12)',
    background: '#0F203C'
  }}>
    <div style={{
      marginTop: '12px',
      marginBottom: '28px',
      position: 'relative',
      width: '100%',
      maxWidth: 300,
      marginLeft: 'auto',
      marginRight: 'auto',
      background: 'transparent',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 8px 20px rgba(0,0,0,.25)',
      border: '1px solid rgba(255,255,255,.12)'
    }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        defaultMuted
        playsInline
        loop
        preload="metadata"
        controls={showControls}
        style={{ width: '100%', height: 'auto', aspectRatio: '9 / 16', display: 'block', background: '#000' }}
        aria-label="Vídeo da imersão"
      >
        <source src="/video-lp.mp4" type="video/mp4" />
        Seu navegador não suportou este vídeo.
      </video>

      {showOverlay && (
        <button
          onClick={handleUnmuteAndRestart}
          aria-label="Ativar som e reiniciar vídeo"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(15,32,60,0.40)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            borderRadius: '999px',
            background: '#FFD700',
            color: '#0F203C',
            fontWeight: 800,
            boxShadow: '0 6px 18px rgba(0,0,0,.35)'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M3 10v4h4l5 4V6l-5 4H3z"></path>
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03z"></path>
              <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path>
            </svg>
            Toque para ativar o som
          </span>
        </button>
      )}
    </div>
  </div>

  {/* Caixa de preço permanece abaixo do vídeo */}
  <div style={styles.priceBox}>
    <p style={styles.priceValue}>{projectData.value}</p>
    <p style={styles.priceEnrollment}>+ {projectData.enrollment}</p>
    <p style={styles.priceDisclaimer}>Vagas limitadas</p>
  </div>

  {/* Segundo CTA logo depois do preço para reforço */}
  <CTAButton
    text="Quero garantir minha vaga"
    href={WHATSAPP_LINK}
    ctaName="hero_principal"
    variation={2}
    style={styles.ctaHero}
  />

  <p style={styles.targetAudience}>{projectData.subtitle}</p>
</div>

        </Section>

        {/* 3. Seção Diferenciais */}
        <Section id="diferenciais" title="Por que esta imersão?">
          <ul style={styles.list}>
            {projectData.differentials.map((item, index) => (
              <li key={index} style={styles.listItem}>
                <IconCheck style={styles.listIcon} width="20" height="20" />
                <span style={styles.listText}>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* 4. Seção Conteúdo Programático */}
        <Section id="conteudo" title="O que você vai aprender">
          <ul style={styles.list}>
            {projectData.learnings.map((item, index) => (
              <li key={index} style={styles.listItem}>
                <IconCheck style={styles.listIcon} width="20" height="20" />
                <span style={styles.listText}>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* 5. Seção Instrutoras */}
        <Section id="instrutoras" title="Quem ministra" style={styles.instructorsSection}>
          <p style={styles.instructorsIntro}>
            Duas referências na área unidas para entregar a você os protocolos mais avançados e seguros em Terapias Injetáveis.
          </p>
          <div style={styles.instructorsGrid}>
            {projectData.instructors.map((instructor, index) => (
              <div key={index} style={styles.instructorCard}>
                {/* TODO: Substitua pelos URLs das fotos das instrutoras (círculo) */}
                <img
  src={instructor.photo}
  alt={`Foto da ${instructor.name}`}
  style={styles.instructorImage}
/>

                <h3 style={styles.instructorName}>{instructor.name}</h3>
                <p style={styles.instructorCro}>{instructor.cro}</p>
                {instructor.instagram && (
                  <a
                    href={instructor.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => logClick(`instagram_${instructor.name}`, instructor.instagram)}
                    style={styles.igLink}
                    aria-label={`Instagram de ${instructor.name}`}
                  >
                    <InstagramIcon width="16" height="16" style={{ marginRight: 8 }} />
                    {new URL(instructor.instagram).pathname.replace(/\//g, "")}
                  </a>
                )}
              </div>
            ))}
          </div>
        </Section>
        
        {/* 6. Seção Depoimentos */}
        <Section id="depoimentos" title="O que dizem sobre nós">
          <div style={styles.testimonialsGrid}>
            {projectData.testimonialPlaceholders.map((text, index) => (
              <blockquote key={index} style={styles.testimonialCard} aria-label="Depoimento de aluna">
                <span style={styles.quoteIcon}>“</span>
                {text}
              </blockquote>
            ))}
          </div>
        </Section>
        {/* 6.1 Seção Galeria */}
<Section id="galeria" title="Momentos de turmas anteriores" style={{ backgroundColor: colors.lightGray }}>
  <AutoCarousel images={galleryImages} height={160} gap={12} speedSeconds={38} />
  
</Section>


        {/* 7. Seção Local e Agenda */}
        <Section id="agenda" title="Quando e onde">
          <p style={styles.agendaText}>{projectData.agenda}</p>
          <div style={{
  position: 'relative',
  width: '100%',
  maxWidth: 600,
  margin: '0 auto',
  borderRadius: '8px',
  overflow: 'hidden',
  border: `1px solid ${colors.primary}`,
  backgroundColor: colors.lightGray,
  paddingTop: '56.25%' // 16 por 9
}}>
  <iframe
    title="Mapa do local do curso"
    src={"https://www.google.com/maps?q=" +
         encodeURIComponent("Rua Jesuíno Maciel, 321, Campo Belo, São Paulo, SP") +
         "&output=embed"}
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      border: 0
    }}
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    allowFullScreen
  />
</div>

<div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
  <a
    href={
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("Rua Jesuíno Maciel, 321, Campo Belo, São Paulo, SP")
    }
    target="_blank"
    rel="noopener noreferrer"
    style={styles.mapLink}
  >
    Ver no Google Maps
  </a>
</div>

        </Section>

        {/* 8. Seção FAQ */}
        <Section id="faq" title="Perguntas frequentes">
          <div style={styles.faqList}>
            {projectData.faq.map((item, index) => (
              <details key={index} style={styles.faqItem}>
                <summary style={styles.faqQuestion}>{item.q}</summary>
                <p style={styles.faqAnswer}>{item.a}</p>
              </details>
            ))}
          </div>
        </Section>

        {/* 9. CTA Final Grande */}
        <Section id="final-cta" title="Garanta sua vaga" style={styles.finalCtaSection}>
          <p style={styles.finalCtaText}>
            Não perca a chance de transformar sua prática clínica com protocolos injetáveis de ponta. **Turmas reduzidas** garantem o máximo de aproveitamento e prática guiada.
          </p>
          <CTAButton
            text="Falar no WhatsApp"
            href={WHATSAPP_LINK}
            ctaName="cta_final"
            style={styles.ctaFinal}
          />
          <p style={styles.priceDisclaimerSmall}>Restam poucas vagas! Garanta a sua agora.</p>
        </Section>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.container}>
          <p style={styles.footerText}>
            {projectData.legalNotice}
          </p>
          <a href={PRIVACY_POLICY_LINK} style={styles.footerLink}>Política de Privacidade</a>
          <p style={styles.copyright}>© {new Date().getFullYear()} PaolaGrace. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Barra fixa no rodapé com CTA */}
<div style={styles.stickyBar} role="region" aria-label="Ação rápida">
  <span style={styles.stickyText}>Turma de 4 e 5 de dezembro em São Paulo. Vagas limitadas.</span>
  <CTAButton
    text="Falar no WhatsApp"
    href={WHATSAPP_LINK}
    ctaName="sticky_bar"
    variation={1}
    style={styles.stickyBarCta}
  />
</div>

      
      {/* CSS Crítico Inline (Mobile First 9:16) */}
      <style>{`
  /* Reset básico */
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  /* Garante largura total e elimina rolagem lateral */
  html, body, #root { width: 100%; height: 100%; overflow-x: hidden; }

  /* Fundo escuro global */
  body { 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
    line-height: 1.6; 
    color: #fff; 
    background-color: #0F203C;
  }

  /* Container usado nas sections e footer */
  .container {
      max-width: 90%;
      margin: 0 auto;
      padding: 0 1rem;
  }
`}</style>

    </div>
  );
}

// === CSS-in-JS (Objetos de Estilo) ===

// Cores
const colors = {
  primary: '#0F203C', // Azul Marinho Sóbrio (Fundo/Texto)
  secondary: '#FFD700', // Dourado (Detalhes/Ênfase)
  white: '#FFFFFF',
  text: '#333333',
  lightGray: '#F4F7F6',
  darkOverlay: 'rgba(0, 0, 0, 0.4)',
};

// Estilos Responsivos (Mobile First)
const styles = {
body: {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'transparent',
},

  container: {
    maxWidth: '90%',
    margin: '0 auto',
    padding: '0 1rem',
  },
  
  // --- Header Fixo ---
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: colors.primary,
    zIndex: 1000,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    maxWidth: '600px', // Limita a largura em telas maiores para foco mobile
    margin: '0 auto',
  },
  logo: {
    color: colors.white,
    fontSize: '1.2rem',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  headerCta: {
    padding: '0.5rem 1rem',
    fontSize: '0.85rem',
    fontWeight: '700',
    backgroundColor: colors.secondary,
    color: colors.primary,
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  },

  // --- Seção Hero ---
  heroSection: {
    backgroundColor: colors.primary,
    color: colors.white,
    paddingTop: '96px', // Espaço para o header fixo
    paddingBottom: '2rem',
    minHeight: 'calc(100vh - 50px)', // Ocupa a maior parte da tela mobile
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `linear-gradient(${colors.darkOverlay}, ${colors.darkOverlay}), url("https://via.placeholder.com/600x1080/0F203C/FFFFFF?text=Seu+Video+de+Fundo+Aqui")`, // TODO: Substitua pelo URL da imagem de fundo/mockup
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    textAlign: 'center',
  },
  heroContent: {
    padding: '1rem 0',
    maxWidth: '90%',
    margin: '0 auto',
  },
  dateBadge: {
    display: 'inline-block',
    backgroundColor: colors.secondary,
    color: colors.primary,
    padding: '0.3rem 1rem',
    borderRadius: '20px',
    fontWeight: '800',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  heroTitle: {
    fontSize: '2rem',
    fontWeight: '900',
    lineHeight: '1.2',
    marginBottom: '0.75rem',
  },
  heroSubtitle: {
    fontSize: '1.1rem',
    fontWeight: '500',
    marginBottom: '1.5rem',
    opacity: 0.9,
  },
  priceBox: {
    backgroundColor: colors.white,
    color: colors.primary,
    padding: '1rem',
    borderRadius: '10px',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  },
  priceValue: {
    fontSize: '1.5rem',
    fontWeight: '900',
    lineHeight: '1.1',
    color: colors.primary,
  },
  priceEnrollment: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: colors.text,
    marginTop: '0.2rem',
  },
  priceDisclaimer: {
    fontSize: '0.75rem',
    marginTop: '0.5rem',
    color: colors.text,
    opacity: 0.7,
  },
  targetAudience: {
    fontSize: '0.9rem',
    marginTop: '1.5rem',
    opacity: 0.7,
    fontStyle: 'italic',
  },

  // --- CTA Geral ---
  ctaButton: {
    display: 'block',
    textAlign: 'center',
    textDecoration: 'none',
    borderRadius: '12px',
    transition: 'background-color 0.3s, transform 0.1s',
    cursor: 'pointer',
    width: '100%',
    margin: '0.5rem 0',
  },
  ctaPrimary: {
    backgroundColor: colors.secondary,
    color: colors.primary,
    padding: '1rem 1.5rem',
    fontSize: '1.1rem',
    fontWeight: '800',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    border: '2px solid transparent',
  },
  ctaSecondary: { // Usado para "Quero garantir minha vaga" no Hero
    backgroundColor: colors.secondary,
    color: colors.primary,
    padding: '1.1rem 1.5rem',
    fontSize: '1.2rem',
    fontWeight: '800',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
    border: `2px solid ${colors.secondary}`,
  },
  ctaHero: {
    marginBottom: '1rem',
    // Hover/Active (precisa de JS ou CSS real para melhor efeito)
    // ':hover': { transform: 'scale(1.02)' }
  },

  // --- Seções Comuns ---
  section: {
    padding: '2.5rem 0',
    backgroundColor: colors.white,
  },
  sectionTitle: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '0.5rem',
    position: 'relative',
  },
  
  // --- Listas de Diferenciais/Conteúdo ---
  list: {
    listStyle: 'none',
    padding: '0',
    maxWidth: '450px',
    margin: '0 auto',
  },
  listItem: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    fontSize: '1rem',
    fontWeight: '500',
    lineHeight: '1.4',
  },
  listIcon: {
    color: colors.secondary,
    marginRight: '0.75rem',
    flexShrink: 0,
    marginTop: '3px',
  },
  listText: {
    color: colors.text,
  },

  // --- Seção Instrutoras ---
  instructorsSection: {
    backgroundColor: colors.lightGray,
  },
  instructorsIntro: {
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '1rem',
    color: colors.text,
    maxWidth: '450px',
    margin: '0 auto 2rem',
  },
  instructorsGrid: {
    display: 'flex',
    flexDirection: 'column', // Mobile: stacked
    gap: '2rem',
    alignItems: 'center',
  },
  instructorCard: {
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: colors.white,
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '300px',
  },
  instructorImage: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '1rem',
    border: `3px solid ${colors.secondary}`,
  },
  instructorName: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: colors.primary,
    marginBottom: '0.25rem',
  },
  instructorCro: {
    fontSize: '0.9rem',
    color: colors.text,
    opacity: 0.7,
  },

  igLink: {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  marginTop: "10px",
  padding: "6px 10px",
  borderRadius: "999px",
  textDecoration: "none",
  fontWeight: 700,
  backgroundColor: colors.secondary,
  color: colors.primary,
  boxShadow: "0 2px 6px rgba(0,0,0,.15)",
  border: `2px solid ${colors.secondary}`
},

  
  // --- Seção Depoimentos ---
  testimonialsGrid: {
    display: 'grid',
    gap: '1.5rem',
  },
  testimonialCard: {
    backgroundColor: colors.white,
    padding: '1.5rem',
    borderRadius: '10px',
    borderLeft: `5px solid ${colors.secondary}`,
    fontSize: '1rem',
    fontStyle: 'italic',
    color: colors.text,
    lineHeight: '1.5',
    position: 'relative',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
  },
  quoteIcon: {
    fontSize: '3rem',
    color: colors.secondary,
    position: 'absolute',
    top: '-0.5rem',
    left: '0.5rem',
    opacity: 0.3,
    lineHeight: 1,
  },

  // --- Seção Local/Agenda ---
  agendaText: {
    textAlign: 'center',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: colors.primary,
    marginBottom: '1.5rem',
  },
  mapPlaceholder: {
    backgroundColor: colors.lightGray,
    height: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '8px',
    border: `1px solid ${colors.primary}`,
    textAlign: 'center',
    padding: '1rem',
  },
  mapLink: {
    marginTop: '0.75rem',
    color: colors.primary,
    textDecoration: 'none',
    fontWeight: '600',
    borderBottom: `1px solid ${colors.primary}`,
  },

  // --- Seção FAQ ---
  faqList: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  faqItem: {
    marginBottom: '1rem',
    border: `1px solid ${colors.primary}`,
    borderRadius: '8px',
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  faqQuestion: {
    display: 'block',
    padding: '1rem',
    fontWeight: '700',
    color: colors.primary,
    cursor: 'pointer',
    position: 'relative',
    transition: 'background-color 0.2s',
  },
  faqAnswer: {
    padding: '0 1rem 1rem 1rem',
    fontSize: '0.95rem',
    color: colors.text,
  },

  // --- CTA Final ---
  finalCtaSection: {
    backgroundColor: colors.primary,
    color: colors.white,
    textAlign: 'center',
  },
  finalCtaText: {
    fontSize: '1.1rem',
    marginBottom: '2rem',
    maxWidth: '450px',
    margin: '0 auto 2rem',
  },
  ctaFinal: {
    maxWidth: '300px',
    margin: '0 auto 1rem',
    padding: '1.2rem 1.5rem',
    fontSize: '1.25rem',
  },
  priceDisclaimerSmall: {
    fontSize: '0.85rem',
    opacity: 0.8,
    marginTop: '1rem',
  },

  // --- Footer ---
  footer: {
    backgroundColor: colors.primary,
    color: colors.white,
    padding: '1.5rem 0',
    marginTop: 'auto', // Fixa no final do conteúdo
    fontSize: '0.8rem',
    textAlign: 'center',
  },
  footerText: {
    marginBottom: '1rem',
    opacity: 0.8,
  },
  footerLink: {
    color: colors.secondary,
    textDecoration: 'none',
    borderBottom: `1px solid ${colors.secondary}`,
    display: 'block',
    marginBottom: '0.5rem',
  },
  copyright: {
    marginTop: '1rem',
    opacity: 0.6,
  },

  // --- Botão Flutuante ---
floatingCta: {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  width: '55px',
  height: '55px',
  borderRadius: '50%',
  backgroundColor: '#25D366',
  color: colors.white,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4)',
  zIndex: 1001,
  padding: 0,
  lineHeight: 0        // evita texto fantasma sem afetar o SVG
},

// Contagem regressiva
countdownBox: {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 12px',
  borderRadius: '999px',
  background: 'rgba(255,255,255,.15)',
  backdropFilter: 'blur(4px)',
  margin: '10px 0 12px 0',
  fontWeight: 700
},
countdownDot: {
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: '#FFD700',
  display: 'inline-block'
},

// Selos
badgesRow: {
  display: 'flex',
  gap: '8px',
  justifyContent: 'center',
  flexWrap: 'wrap',
  margin: '10px 0 16px 0'
},
badge: {
  fontSize: '.85rem',
  fontWeight: 700,
  backgroundColor: '#FFFFFF',
  color: '#0F203C',
  border: '1px solid rgba(0,0,0,.06)',
  borderRadius: '999px',
  padding: '6px 10px',
  boxShadow: '0 2px 6px rgba(0,0,0,.08)'
},

// Barra fixa
stickyBar: {
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1002,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  padding: '10px 14px',
  background: '#0F203C',
  borderTop: '1px solid rgba(255,255,255,.12)'
},
stickyText: {
  color: '#FFFFFF',
  fontSize: '.95rem',
  lineHeight: 1.2,
  flex: 1,
  paddingRight: 8
},
stickyBarCta: {
  width: 'auto',
  minWidth: 180,
  margin: 0
},


  
  // --- Media Query para Desktop/Tablet (Exemplo Básico) ---
  // Nota: Estilos inline JS não suportam media queries simples. 
  // Para regras complexas como esta, é melhor usar a tag <style> ou CSS real.
  // Mantendo o foco no MOBILE FIRST, este código prioriza a visualização 9:16/mobile.
};

// Injeta um <style> real para regras responsivas essenciais.
// A performance é garantida por ser CSS crítico inline.
document.addEventListener('DOMContentLoaded', () => {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    /* Responsividade para Desktop/Tablet (quebra em 600px) */
    @media (min-width: 600px) {
        /* Header */
        header a[role="button"] {
            padding: 0.6rem 1.25rem !important;
            font-size: 0.95rem !important;
        }

        /* Hero Section */
        #hero {
            min-height: 80vh;
            padding-bottom: 4rem !important;
        }
        #hero .hero-content {
            max-width: 500px;
        }
        #hero h1 {
            font-size: 2.5rem !important;
        }
        #hero p:first-of-type {
            font-size: 1.2rem !important;
        }
        
        /* Layout de Seções */
        section {
            padding: 4rem 0 !important;
        }
        h2 {
            font-size: 2rem !important;
        }
        
        /* Instrutoras em Grid */
        #instrutoras .instructors-grid {
            flex-direction: row !important;
            justify-content: center;
        }
        
        /* Depoimentos em Grid */
        #depoimentos .testimonials-grid {
            grid-template-columns: repeat(3, 1fr);
        }
        
        /* CTA Final */
        #final-cta .cta-button {
            max-width: 400px;
        }
        
        /* Botão Flutuante maior e mais discreto */
        .floating-cta {
            width: 65px !important;
            height: 65px !important;
            bottom: 30px !important;
            right: 30px !important;
        }
    }
  `;
  document.head.appendChild(styleEl);
});

export default App;